import * as tf from '@tensorflow/tfjs-node'
import * as faceapi from '@vladmandic/face-api/dist/face-api.node.js'
import * as fs from 'fs'
import * as path from 'path'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export type TranscriptWord = {
  t: number
  end: number
  text: string
  speaker?: string
}

export interface ComputeInput {
  videoPath: string
  baseW: number
  baseH: number
  segStart: number
  segEnd: number
  transcript: TranscriptWord[]
}

export interface Constraints {
  margin: number
  maxPan: number
  easeMs: number
  centerBiasY: number
  safeTop: number
  safeBottom: number
}

export type CropKF = {
  t: number
  x: number
  y: number
  w: number
  h: number
}

type FaceBox = {
  x: number
  y: number
  w: number
  h: number
  score: number
}

type FaceSnapshot = {
  t: number
  boxes: FaceBox[]
}

type TrackSample = {
  t: number
  box: FaceBox
}

type FaceTrack = {
  id: string
  samples: TrackSample[]
}

let modelsLoaded = false

async function ensureModelsLoaded(): Promise<void> {
  if (modelsLoaded) {
    return
  }

  await tf.setBackend('tensorflow')
  await tf.enableProdMode()
  await tf.ready()

  const modelPath = path.join(process.cwd(), 'models')

  if (!fs.existsSync(modelPath)) {
    throw new Error(`Face detection models not found at ${modelPath}`)
  }

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath)

  modelsLoaded = true
  console.log('Face detection models loaded successfully')
}

const DEFAULT_SAMPLE_FPS = Number(process.env.FRAMING_SAMPLE_FPS || 3)
const MIN_FACE_CONFIDENCE = Number(process.env.FRAMING_MIN_FACE_CONFIDENCE || 0.6)
const MAX_TRACK_JOIN_GAP_S = Number(process.env.FRAMING_MAX_TRACK_GAP_S || 1.2)
const MAX_INTERP_GAP_S = Number(process.env.FRAMING_MAX_INTERP_GAP_S || 0.8)
const TRACK_HOLD_S = Number(process.env.FRAMING_TRACK_HOLD_S || 0.6)
const MAX_ASSOCIATION_DISTANCE = Number(
  process.env.FRAMING_MAX_ASSOCIATION_DISTANCE || 180,
)
const MIN_TRACK_LENGTH = Number(process.env.FRAMING_MIN_TRACK_SAMPLES || 2)

export async function computeCropMap(
  input: ComputeInput,
  constraints: Constraints,
): Promise<CropKF[] | null> {
  await ensureModelsLoaded()

  const detections = await detectFacesTimeline(
    input.videoPath,
    input.segStart,
    input.segEnd,
    input.baseW,
    input.baseH,
  )

  if (detections.length === 0) {
    return null
  }

  const tracks = buildFaceTracks(detections)

  const rawKeyframes = buildCropKeyframes(
    detections,
    tracks,
    input.baseW,
    input.baseH,
    constraints,
  )

  if (rawKeyframes.length === 0) {
    return null
  }

  const smoothed = smoothKeyframes(rawKeyframes)
  const limited = applyPanLimits(smoothed, constraints.maxPan)
  const eased = easeSegmentEdges(
    limited,
    input.segStart,
    input.segEnd,
    constraints.easeMs / 1000,
  )

  return eased.length > 0 ? dedupeByTime(eased, 0.1) : null
}

async function detectFacesTimeline(
  videoPath: string,
  segStart: number,
  segEnd: number,
  baseW: number,
  baseH: number,
): Promise<FaceSnapshot[]> {
  const sampleFps = Math.max(1, DEFAULT_SAMPLE_FPS)
  const duration = Math.max(0, segEnd - segStart)

  if (duration === 0) {
    return []
  }

  const frameInterval = 1 / sampleFps
  const expectedFrames = Math.ceil(duration * sampleFps)
  const tempDir = path.join(process.cwd(), 'tmp', `frames_${Date.now()}`)

  fs.mkdirSync(tempDir, { recursive: true })

  try {
    await extractFrames(videoPath, segStart, duration, sampleFps, tempDir)

    const frameFiles = fs
      .readdirSync(tempDir)
      .filter((file) => file.endsWith('.jpg'))
      .sort()

    const snapshots: FaceSnapshot[] = []

    for (let i = 0; i < frameFiles.length && i < expectedFrames; i++) {
      const framePath = path.join(tempDir, frameFiles[i])
      const buffer = fs.readFileSync(framePath)
      const tensor = tf.node.decodeImage(buffer, 3) as tf.Tensor3D

      try {
        const timestamp = segStart + i * frameInterval
        const detections = await faceapi
          .detectAllFaces(
            tensor as unknown as faceapi.TNetInput,
            new faceapi.SsdMobilenetv1Options({ minConfidence: MIN_FACE_CONFIDENCE }),
          )
          .withFaceLandmarks()

        const scaleX = baseW / tensor.shape[1]
        const scaleY = baseH / tensor.shape[0]
        const boxes: FaceBox[] = detections.map((det) => {
          const box = det.detection.box
          return {
            x: box.x * scaleX,
            y: box.y * scaleY,
            w: box.width * scaleX,
            h: box.height * scaleY,
            score: det.detection.score,
          }
        })

        if (boxes.length > 0) {
          snapshots.push({ t: timestamp, boxes })
        }
      } finally {
        tensor.dispose()
      }
    }

    return snapshots
  } catch (err) {
    console.error('Face detection failed:', err)
    return []
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  }
}

function buildFaceTracks(snapshots: FaceSnapshot[]): FaceTrack[] {
  if (snapshots.length === 0) {
    return []
  }

  const tracks: FaceTrack[] = []

  for (const snap of snapshots) {
    const assignments = new Set<FaceTrack>()

    for (const box of snap.boxes) {
      const track = findBestTrack(tracks, assignments, snap.t, box)

      if (track) {
        track.samples.push({ t: snap.t, box: cloneBox(box) })
        assignments.add(track)
      } else {
        const newTrack: FaceTrack = {
          id: `track_${tracks.length}`,
          samples: [{ t: snap.t, box: cloneBox(box) }],
        }
        tracks.push(newTrack)
        assignments.add(newTrack)
      }
    }
  }

  return tracks.filter((track) => track.samples.length >= MIN_TRACK_LENGTH)
}

function findBestTrack(
  tracks: FaceTrack[],
  assignments: Set<FaceTrack>,
  t: number,
  box: FaceBox,
): FaceTrack | null {
  let best: { track: FaceTrack; score: number } | null = null

  for (const track of tracks) {
    if (assignments.has(track) || track.samples.length === 0) {
      continue
    }

    const last = track.samples[track.samples.length - 1]
    const dt = t - last.t

    if (dt < 0 || dt > MAX_TRACK_JOIN_GAP_S) {
      continue
    }

    const distance = centerDistance(last.box, box)

    if (distance > MAX_ASSOCIATION_DISTANCE) {
      continue
    }

    const overlap = computeIoU(last.box, box)
    const score = overlap * 2 - distance / 300

    if (!best || score > best.score) {
      best = { track, score }
    }
  }

  return best ? best.track : null
}

function cloneBox(box: FaceBox): FaceBox {
  return { x: box.x, y: box.y, w: box.w, h: box.h, score: box.score }
}

function centerDistance(a: FaceBox, b: FaceBox): number {
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2

  return Math.hypot(ax - bx, ay - by)
}

function computeIoU(a: FaceBox, b: FaceBox): number {
  const left = Math.max(a.x, b.x)
  const right = Math.min(a.x + a.w, b.x + b.w)
  const top = Math.max(a.y, b.y)
  const bottom = Math.min(a.y + a.h, b.y + b.h)

  if (right <= left || bottom <= top) {
    return 0
  }

  const intersection = (right - left) * (bottom - top)
  const areaA = a.w * a.h
  const areaB = b.w * b.h

  if (areaA <= 0 || areaB <= 0) {
    return 0
  }

  const union = areaA + areaB - intersection

  return union > 0 ? intersection / union : 0
}

function getBoxAtTime(track: FaceTrack, t: number): FaceBox | null {
  if (track.samples.length === 0) {
    return null
  }

  let previous: TrackSample | null = null
  let next: TrackSample | null = null

  for (const sample of track.samples) {
    if (sample.t === t) {
      return cloneBox(sample.box)
    }

    if (sample.t < t) {
      if (!previous || sample.t > previous.t) {
        previous = sample
      }
    }

    if (sample.t > t) {
      if (!next || sample.t < next.t) {
        next = sample
      }
    }
  }

  if (previous && next) {
    const gap = next.t - previous.t

    if (gap <= MAX_INTERP_GAP_S) {
      const alpha = gap === 0 ? 0 : (t - previous.t) / gap
      return {
        x: lerp(previous.box.x, next.box.x, alpha),
        y: lerp(previous.box.y, next.box.y, alpha),
        w: lerp(previous.box.w, next.box.w, alpha),
        h: lerp(previous.box.h, next.box.h, alpha),
        score: Math.min(previous.box.score, next.box.score),
      }
    }
  }

  if (previous && t - previous.t <= TRACK_HOLD_S) {
    return cloneBox(previous.box)
  }

  return null
}

function lerp(a: number, b: number, alpha: number): number {
  return a + (b - a) * alpha
}

async function extractFrames(
  videoPath: string,
  segStart: number,
  duration: number,
  fps: number,
  outputDir: string,
): Promise<void> {
  const ffmpegPath = require('ffmpeg-static')

  await execFileAsync(ffmpegPath, [
    '-ss',
    segStart.toFixed(3),
    '-i',
    videoPath,
    '-t',
    duration.toFixed(3),
    '-vf',
    `fps=${fps},scale=640:-1`,
    '-q:v',
    '2',
    path.join(outputDir, 'frame_%04d.jpg'),
  ])
}

function buildCropKeyframes(
  detections: FaceSnapshot[],
  tracks: FaceTrack[],
  baseW: number,
  baseH: number,
  constraints: Constraints,
): CropKF[] {
  const targetW = Math.floor((baseH * 9) / 16)
  const targetH = baseH
  const out: CropKF[] = []

  const activeTracks = tracks.filter((track) => track.samples.length > 0)

  for (const snap of detections) {
    const boxes: FaceBox[] = []

    for (const track of activeTracks) {
      const box = getBoxAtTime(track, snap.t)

      if (box) {
        boxes.push(box)
      }
    }

    if (boxes.length === 0) {
      boxes.push(...snap.boxes)
    }

    const bounds = computeGroupBounds(boxes)

    if (!bounds) {
      continue
    }

    const crop = computeCropFromBounds(bounds, targetW, targetH, baseW, baseH, constraints)
    out.push({ t: snap.t, ...crop })
  }

  return out
}

type GroupBounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

function computeGroupBounds(boxes: FaceBox[]): GroupBounds | null {
  if (boxes.length === 0) {
    return null
  }

  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (const box of boxes) {
    minX = Math.min(minX, box.x)
    maxX = Math.max(maxX, box.x + box.w)
    minY = Math.min(minY, box.y)
    maxY = Math.max(maxY, box.y + box.h)
  }

  if (!isFinite(minX) || !isFinite(maxX) || !isFinite(minY) || !isFinite(maxY)) {
    return null
  }

  return { minX, maxX, minY, maxY }
}

function computeCropFromBounds(
  bounds: GroupBounds,
  targetW: number,
  targetH: number,
  baseW: number,
  baseH: number,
  constraints: Constraints,
): { x: number; y: number; w: number; h: number } {
  const marginPx = Math.max(0, constraints.margin) * targetW

  const paddedMinX = Math.max(0, bounds.minX - marginPx)
  const paddedMaxX = Math.min(baseW, bounds.maxX + marginPx)
  const paddedMinY = Math.max(0, bounds.minY - marginPx)
  const paddedMaxY = Math.min(baseH, bounds.maxY + marginPx)

  const desiredCenterX = (paddedMinX + paddedMaxX) / 2
  const desiredCenterY = (paddedMinY + paddedMaxY) / 2 - targetH * constraints.centerBiasY

  const paddedWidth = paddedMaxX - paddedMinX
  let x: number

  if (paddedWidth <= targetW) {
    const feasibleMinX = Math.max(0, Math.min(baseW - targetW, paddedMaxX - targetW))
    const feasibleMaxX = Math.min(baseW - targetW, Math.max(0, paddedMinX))
    const ideal = desiredCenterX - targetW / 2

    if (feasibleMinX <= feasibleMaxX) {
      x = clamp(ideal, feasibleMinX, feasibleMaxX)
    } else {
      x = clamp(ideal, 0, baseW - targetW)
    }
  } else {
    const ideal = desiredCenterX - targetW / 2
    x = clamp(ideal, 0, baseW - targetW)
  }

  const rawY = desiredCenterY - targetH / 2
  const safeTop = -Math.round(targetH * constraints.safeTop)
  const safeBottom = Math.round(targetH * constraints.safeBottom)
  const minY = safeTop
  const maxY = baseH - targetH + safeBottom
  const y = clamp(rawY, minY, maxY)

  return { x: Math.round(x), y: Math.round(y), w: targetW, h: targetH }
}

function smoothKeyframes(kf: CropKF[]): CropKF[] {
  if (kf.length < 2) {
    return kf
  }

  const windowSize = 2
  const smoothed: CropKF[] = []

  for (let i = 0; i < kf.length; i++) {
    let sumX = 0
    let sumY = 0
    let count = 0

    for (let j = i - windowSize; j <= i + windowSize; j++) {
      if (j < 0 || j >= kf.length) {
        continue
      }

      sumX += kf[j].x
      sumY += kf[j].y
      count += 1
    }

    smoothed.push({
      t: kf[i].t,
      x: Math.round(sumX / count),
      y: Math.round(sumY / count),
      w: kf[i].w,
      h: kf[i].h,
    })
  }

  return smoothed
}

function applyPanLimits(kf: CropKF[], maxPanPerSecond: number): CropKF[] {
  if (kf.length < 2) {
    return kf
  }

  const limited: CropKF[] = [kf[0]]

  for (let i = 1; i < kf.length; i++) {
    const prev = limited[limited.length - 1]
    const cur = kf[i]
    const dt = Math.max(0.001, cur.t - prev.t)
    const maxDelta = Math.max(0, maxPanPerSecond) * dt

    const nextX = stepToward(prev.x, cur.x, maxDelta)
    const nextY = stepToward(prev.y, cur.y, maxDelta)

    limited.push({ t: cur.t, x: nextX, y: nextY, w: cur.w, h: cur.h })
  }

  return limited
}

function easeSegmentEdges(
  kf: CropKF[],
  segStart: number,
  segEnd: number,
  easeSeconds: number,
): CropKF[] {
  if (kf.length === 0 || easeSeconds <= 0) {
    return kf
  }

  const eased: CropKF[] = []

  for (const frame of kf) {
    const fromStart = Math.min(1, Math.max(0, (frame.t - segStart) / easeSeconds))
    const fromEnd = Math.min(1, Math.max(0, (segEnd - frame.t) / easeSeconds))
    const influence = Math.min(fromStart, fromEnd)

    if (eased.length === 0) {
      eased.push(frame)
      continue
    }

    const prev = eased[eased.length - 1]
    const x = Math.round(prev.x + (frame.x - prev.x) * influence)
    const y = Math.round(prev.y + (frame.y - prev.y) * influence)
    eased.push({ t: frame.t, x, y, w: frame.w, h: frame.h })
  }

  return eased
}

function dedupeByTime(kf: CropKF[], minDelta: number): CropKF[] {
  if (kf.length === 0) {
    return kf
  }

  const out: CropKF[] = [kf[0]]

  for (let i = 1; i < kf.length; i++) {
    if (kf[i].t - out[out.length - 1].t >= minDelta) {
      out.push(kf[i])
    }
  }

  return out
}

function stepToward(current: number, target: number, maxDelta: number): number {
  if (Math.abs(target - current) <= maxDelta) {
    return target
  }

  return target > current ? current + maxDelta : current - maxDelta
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) {
    return min
  }

  if (value > max) {
    return max
  }

  return value
}

export function buildPiecewiseExpr(kf: CropKF[], key: 'x' | 'y'): string {
  if (kf.length === 0) {
    return '0'
  }

  const parts: string[] = []
  const firstVal = key === 'x' ? kf[0].x : kf[0].y
  parts.push(`lt(t,${kf[0].t.toFixed(3)})*${firstVal.toFixed(0)}`)

  for (let i = 0; i < kf.length - 1; i++) {
    const a = kf[i]
    const b = kf[i + 1]
    const ta = a.t
    const tb = b.t
    const va = key === 'x' ? a.x : a.y
    const vb = key === 'x' ? b.x : b.y
    const slope = (vb - va) / Math.max(0.001, tb - ta)
    parts.push(
      `between(t,${ta.toFixed(3)},${tb.toFixed(3)})*(${va.toFixed(0)}+(${slope.toFixed(6)})*(t-${ta.toFixed(3)}))`,
    )
  }

  const lastVal = key === 'x' ? kf[kf.length - 1].x : kf[kf.length - 1].y
  parts.push(`gte(t,${kf[kf.length - 1].t.toFixed(3)})*${lastVal.toFixed(0)}`)

  return parts.join('+')
}

export const __testables = {
  buildFaceTracks,
  getBoxAtTime,
  computeGroupBounds,
  computeCropFromBounds,
  smoothKeyframes,
  applyPanLimits,
  dedupeByTime,
}
