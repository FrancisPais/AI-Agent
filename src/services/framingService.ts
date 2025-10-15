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

  const rawKeyframes = buildCropKeyframes(
    detections,
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
  baseW: number,
  baseH: number,
  constraints: Constraints,
): CropKF[] {
  const targetW = Math.floor((baseH * 9) / 16)
  const targetH = baseH
  const out: CropKF[] = []

  for (const snap of detections) {
    const bounds = computeGroupBounds(snap.boxes)

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

  const feasibleMinX = Math.max(0, paddedMaxX - targetW)
  const feasibleMaxX = Math.min(baseW - targetW, paddedMinX)

  let x: number

  if (feasibleMinX <= feasibleMaxX) {
    const ideal = desiredCenterX - targetW / 2
    x = clamp(ideal, feasibleMinX, feasibleMaxX)
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

function findBoxNearTime(boxes: FaceBox[], time: number, tolerance: number): FaceBox | null {
  let best: FaceBox | null = null
  let bestDelta = Infinity

  for (const box of boxes)
  {
    const delta = Math.abs(box.t - time)

    if (delta <= tolerance && delta < bestDelta)
    {
      best = box
      bestDelta = delta
    }
  }

  return best
}

function computeGroupBounds(
  tracks: FaceTrack[],
  time: number,
  baseW: number,
  baseH: number,
): { minX: number; maxX: number } | null {
  const tolerance = Math.max(0.1, getSampleStepSeconds())
  let minX = Infinity
  let maxX = -Infinity
  let count = 0

  for (const track of tracks)
  {
    const candidate = findBoxNearTime(track.boxes, time, tolerance)

    if (!candidate)
    {
      continue
    }

    const body = estimateBodyBox(candidate, baseW, baseH)
    const left = body ? body.x : candidate.x
    const right = body ? body.x + body.w : candidate.x + candidate.w

    minX = Math.min(minX, left)
    maxX = Math.max(maxX, right)
    count += 1
  }

  if (!isFinite(minX) || !isFinite(maxX) || count <= 1)
  {
    return null
  }

  minX = Math.max(0, minX)
  maxX = Math.min(baseW, maxX)

  if (maxX <= minX)
  {
    return null
  }

  return { minX, maxX }
}

export function buildKeyframes(mapping: Array<{ start: number; end: number; trackId: string }>, tracks: FaceTrack[], baseW: number, baseH: number, c: Constraints): CropKF[] {
  const out: CropKF[] = []
  const targetW = Math.floor(baseH * 9 / 16)
  const targetH = baseH

    for (let j = i - windowSize; j <= i + windowSize; j++) {
      if (j < 0 || j >= kf.length) {
        continue
      }
      
      if (b.t > m.end)
      {
        break
      }
      
      const bodyBox = estimateBodyBox(b, baseW, baseH)
      
      let cx: number
      let cy: number
      
      if (bodyBox)
      {
        cx = bodyBox.cx
        cy = bodyBox.cy - targetH * c.centerBiasY
      }
      else
      {
        cx = b.x + b.w / 2
        cy = b.y + b.h * (0.5 - c.centerBiasY)
      }
      
      const marginPx = Math.max(0, c.margin) * targetW
      const minCropX = 0
      const maxCropX = Math.max(0, baseW - targetW)

      let idealX = cx - targetW / 2

      const groupBounds = computeGroupBounds(tracks, b.t, baseW, baseH)

      if (groupBounds)
      {
        const span = groupBounds.maxX - groupBounds.minX
        const groupCenter = groupBounds.minX + span / 2
        let groupX = groupCenter - targetW / 2

        if (span <= targetW)
        {
          const minGroupX = Math.max(minCropX, Math.ceil(groupBounds.maxX - targetW))
          const maxGroupX = Math.min(maxCropX, Math.floor(groupBounds.minX))

          if (minGroupX <= maxGroupX)
          {
            groupX = Math.min(Math.max(groupX, minGroupX), maxGroupX)
          }
        }

        idealX = Math.max(minCropX, Math.min(groupX, maxCropX))
      }

      if (marginPx > 0)
      {
        const marginMin = cx - targetW + marginPx
        const marginMax = cx - marginPx
        const allowedMin = Math.max(minCropX, marginMin)
        const allowedMax = Math.min(maxCropX, marginMax)

        if (allowedMin <= allowedMax)
        {
          if (idealX < allowedMin)
          {
            idealX = allowedMin
          }
          else if (idealX > allowedMax)
          {
            idealX = allowedMax
          }
        }
        else if (cx < marginPx)
        {
          idealX = minCropX
        }
        else if (baseW - cx < marginPx)
        {
          idealX = maxCropX
        }
      }

      idealX = enforceGroupBounds(idealX, targetW, baseW, groupBounds)

      let x = Math.round(idealX)

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

      x = enforceGroupBounds(x, targetW, baseW, groupBounds)
      x = Math.max(minCropX, Math.min(x, maxCropX))

      if (groupBounds)
      {
        const span = groupBounds.maxX - groupBounds.minX

        if (span <= targetW)
        {
          const minGroupX = Math.max(minCropX, Math.ceil(groupBounds.maxX - targetW))
          const maxGroupX = Math.min(maxCropX, Math.floor(groupBounds.minX))

          if (minGroupX <= maxGroupX)
          {
            if (x < minGroupX)
            {
              x = minGroupX
            }
            else if (x > maxGroupX)
            {
              x = maxGroupX
            }
          }
        }
        else
        {
          const centerX = groupBounds.minX + span / 2
          const centered = Math.round(centerX - targetW / 2)
          x = Math.max(minCropX, Math.min(centered, maxCropX))
        }
      }

      let y = Math.round(cy - targetH / 2)

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
  computeGroupBounds,
  computeCropFromBounds,
  smoothKeyframes,
  applyPanLimits,
  dedupeByTime,
}
