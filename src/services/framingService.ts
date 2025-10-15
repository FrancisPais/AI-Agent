import * as tf from '@tensorflow/tfjs-node'
import * as faceapi from '@vladmandic/face-api/dist/face-api.node.js'
import * as path from 'path'
import * as fs from 'fs'
import { execFile } from 'child_process'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

type TranscriptWord = { t: number; end: number; text: string; speaker?: string }
type SpeakerWindow = { start: number; end: number; speakerId: string }
type FaceBox = { t: number; x: number; y: number; w: number; h: number; landmarks?: number[][] }
type BodyBox = { x: number; y: number; w: number; h: number; cx: number; cy: number }
type FaceTrack = { id: string; boxes: FaceBox[] }
type CropKF = { t: number; x: number; y: number; w: number; h: number }

let modelsLoaded = false

async function ensureModelsLoaded(): Promise<void> {
  if (modelsLoaded)
  {
    return
  }
  
  await tf.setBackend('tensorflow')
  await tf.enableProdMode()
  await tf.ready()
  
  const modelPath = path.join(process.cwd(), 'models')
  
  if (!fs.existsSync(modelPath))
  {
    throw new Error(`Face detection models not found at ${modelPath}`)
  }
  
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath)
  
  modelsLoaded = true
  console.log('Face detection models loaded successfully')
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

export async function computeCropMap(input: ComputeInput, c: Constraints): Promise<CropKF[] | null> {
  const speaker = buildSpeakerTimeline(input.transcript, input.segStart, input.segEnd)
  
  if (speaker.length === 0)
  {
    return null
  }
  
  const faces = await detectAndTrackFaces(input.videoPath, input.segStart, input.segEnd, input.baseW, input.baseH)
  
  if (faces.length === 0)
  {
    return null
  }
  
  const mapping = mapSpeakersToTracks(speaker, faces)
  
  if (mapping.length === 0)
  {
    return null
  }
  
  const raw = buildKeyframes(mapping, faces, input.baseW, input.baseH, c)
  const smoothed = smoothAndConstrain(raw, input.baseW, input.baseH, input.segStart, input.segEnd, c)
  
  if (smoothed.length === 0)
  {
    return null
  }
  
  return smoothed
}

function buildSpeakerTimeline(words: TranscriptWord[], segStart: number, segEnd: number): SpeakerWindow[] {
  const win: SpeakerWindow[] = []
  let cur = null as SpeakerWindow | null
  
  for (const w of words)
  {
    if (w.t < segStart)
    {
      continue
    }
    
    if (w.t > segEnd)
    {
      break
    }
    
    const sp = w.speaker ?? 'spk'
    
    if (!cur)
    {
      cur = { start: Math.max(w.t, segStart), end: Math.min(w.end, segEnd), speakerId: sp }
      continue
    }
    
    if (cur.speakerId === sp)
    {
      cur.end = Math.min(w.end, segEnd)
    }
    else
    {
      if (cur.end - cur.start > 0)
      {
        win.push(cur)
      }
      cur = { start: Math.max(w.t, segStart), end: Math.min(w.end, segEnd), speakerId: sp }
    }
  }
  
  if (cur && cur.end - cur.start > 0)
  {
    win.push(cur)
  }
  
  return mergeShortWindows(win)
}

function mergeShortWindows(w: SpeakerWindow[]): SpeakerWindow[] {
  if (w.length === 0)
  {
    return w
  }
  
  const minHold = Number(process.env.FRAMING_MIN_SPEAKER_HOLD_MS || 600) / 1000
  const out: SpeakerWindow[] = []
  let cur = w[0]
  
  for (let i = 1; i < w.length; i++)
  {
    const nxt = w[i]
    
    if (nxt.start - cur.end < minHold && nxt.speakerId === cur.speakerId)
    {
      cur.end = nxt.end
    }
    else
    {
      out.push(cur)
      cur = nxt
    }
  }
  
  out.push(cur)
  
  return out.filter(s => s.end - s.start >= minHold)
}

async function detectAndTrackFaces(videoPath: string, segStart: number, segEnd: number, origW: number, origH: number): Promise<FaceTrack[]> {
  try
  {
    await ensureModelsLoaded()
    
    const sampleFps = Number(process.env.FRAMING_SAMPLE_FPS || 3)
    const duration = segEnd - segStart
    const frameInterval = 1 / sampleFps
    const frameCount = Math.ceil(duration * sampleFps)
    const sampledFrameWidth = 640
    
    const frames: Array<{ t: number; tensor: tf.Tensor3D }> = []
    const tempDir = path.join(process.cwd(), 'tmp', `frames_${Date.now()}`)
    fs.mkdirSync(tempDir, { recursive: true })
    
    try
    {
      await extractFrames(videoPath, segStart, segEnd, sampleFps, tempDir)
      
      const frameFiles = fs.readdirSync(tempDir).filter(f => f.endsWith('.jpg')).sort()
      
      for (let i = 0; i < frameFiles.length && i < frameCount; i++)
      {
        const framePath = path.join(tempDir, frameFiles[i])
        const imageBuffer = fs.readFileSync(framePath)
        const decoded = tf.node.decodeImage(imageBuffer, 3) as tf.Tensor3D
        const t = segStart + i * frameInterval
        frames.push({ t, tensor: decoded })
      }
      
      const detections: Array<{ t: number; faces: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>[] }> = []
      const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.6 })
      
      for (const frame of frames)
      {
        const result = await faceapi.detectAllFaces(frame.tensor as any, options).withFaceLandmarks()
        detections.push({ t: frame.t, faces: result })
      }
      
      const sampledHeight = frames.length > 0 ? frames[0].tensor.shape[0] : origH
      const sampledWidth = frames.length > 0 ? frames[0].tensor.shape[1] : origW
      
      frames.forEach(f => f.tensor.dispose())
      
      const scaleX = origW / sampledWidth
      const scaleY = origH / sampledHeight
      
      const tracks = buildFaceTracks(detections, scaleX, scaleY)
      return tracks
    }
    finally
    {
      if (fs.existsSync(tempDir))
      {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    }
  }
  catch (error)
  {
    console.error('Face detection failed:', error)
    return []
  }
}

async function extractFrames(videoPath: string, segStart: number, segEnd: number, fps: number, outputDir: string): Promise<void> {
  const duration = segEnd - segStart
  const ffmpegPath = require('ffmpeg-static')
  
  await execFileAsync(ffmpegPath, [
    '-ss', segStart.toFixed(3),
    '-i', videoPath,
    '-t', duration.toFixed(3),
    '-vf', `fps=${fps},scale=640:-1`,
    '-q:v', '2',
    path.join(outputDir, 'frame_%04d.jpg')
  ])
}

function buildFaceTracks(detections: Array<{ t: number; faces: faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }>[] }>, scaleX: number, scaleY: number): FaceTrack[] {
  const tracks: FaceTrack[] = []
  const maxDistance = 150 * scaleX
  
  for (const det of detections)
  {
    for (const face of det.faces)
    {
      const box = face.detection.box
      const scaledBox = {
        x: box.x * scaleX,
        y: box.y * scaleY,
        width: box.width * scaleX,
        height: box.height * scaleY
      }
      const center = { x: scaledBox.x + scaledBox.width / 2, y: scaledBox.y + scaledBox.height / 2 }
      
      const landmarks = face.landmarks.positions.map(p => [p.x * scaleX, p.y * scaleY])
      
      let matched = false
      
      for (const track of tracks)
      {
        if (track.boxes.length === 0)
        {
          continue
        }
        
        const lastBox = track.boxes[track.boxes.length - 1]
        const lastCenter = { x: lastBox.x + lastBox.w / 2, y: lastBox.y + lastBox.h / 2 }
        const dist = Math.sqrt(Math.pow(center.x - lastCenter.x, 2) + Math.pow(center.y - lastCenter.y, 2))
        
        if (dist < maxDistance)
        {
          track.boxes.push({
            t: det.t,
            x: Math.round(scaledBox.x),
            y: Math.round(scaledBox.y),
            w: Math.round(scaledBox.width),
            h: Math.round(scaledBox.height),
            landmarks
          })
          matched = true
          break
        }
      }
      
      if (!matched)
      {
        tracks.push({
          id: `track_${tracks.length}`,
          boxes: [{
            t: det.t,
            x: Math.round(scaledBox.x),
            y: Math.round(scaledBox.y),
            w: Math.round(scaledBox.width),
            h: Math.round(scaledBox.height),
            landmarks
          }]
        })
      }
    }
  }
  
  return tracks.filter(t => t.boxes.length >= 2)
}

function mapSpeakersToTracks(s: SpeakerWindow[], tracks: FaceTrack[]): Array<{ start: number; end: number; trackId: string }> {
  if (s.length === 0 || tracks.length === 0)
  {
    return []
  }

  const trackIndex = new Map(tracks.map(t => [t.id, t]))
  const speakerWindows = new Map<string, SpeakerWindow[]>()
  const speakerDurations = new Map<string, number>()
  const windowCoverageCache = new Map<string, number>()

  for (const sw of s)
  {
    if (sw.end <= sw.start)
    {
      continue
    }

    if (!speakerWindows.has(sw.speakerId))
    {
      speakerWindows.set(sw.speakerId, [])
      speakerDurations.set(sw.speakerId, 0)
    }

    speakerWindows.get(sw.speakerId)!.push(sw)
    speakerDurations.set(sw.speakerId, (speakerDurations.get(sw.speakerId) ?? 0) + (sw.end - sw.start))
  }

  const coverageBySpeaker = new Map<string, Map<string, number>>()

  for (const [speakerId, windows] of speakerWindows)
  {
    const totals = new Map<string, number>()

    for (const sw of windows)
    {
      for (const track of tracks)
      {
        const coverage = getTrackCoverageForWindow(track, sw.start, sw.end, windowCoverageCache)

        if (coverage > 0)
        {
          totals.set(track.id, (totals.get(track.id) ?? 0) + coverage)
        }
      }
    }

    coverageBySpeaker.set(speakerId, totals)
  }

  const speakerOrder = Array.from(speakerWindows.keys()).sort((a, b) => {
    const da = speakerDurations.get(a) ?? 0
    const db = speakerDurations.get(b) ?? 0

    if (db !== da)
    {
      return db - da
    }

    return a.localeCompare(b)
  })

  const assignment = new Map<string, string>()
  const usedTracks = new Set<string>()

  for (const speakerId of speakerOrder)
  {
    const totals = coverageBySpeaker.get(speakerId) ?? new Map<string, number>()
    const candidates = tracks
      .map(track => ({ id: track.id, coverage: totals.get(track.id) ?? 0 }))
      .sort((a, b) => {
        if (b.coverage !== a.coverage)
        {
          return b.coverage - a.coverage
        }

        return a.id.localeCompare(b.id)
      })

    let chosen = candidates.find(c => !usedTracks.has(c.id) && c.coverage > 0)

    if (!chosen)
    {
      chosen = candidates.find(c => !usedTracks.has(c.id) && c.coverage >= 0)
    }

    if (!chosen)
    {
      chosen = candidates[0]
    }

    if (chosen && chosen.coverage > 0)
    {
      assignment.set(speakerId, chosen.id)
      usedTracks.add(chosen.id)
    }
  }

  const out: Array<{ start: number; end: number; trackId: string }> = []

  for (const sw of s)
  {
    if (sw.end <= sw.start)
    {
      continue
    }

    let trackId = assignment.get(sw.speakerId)

    if (trackId)
    {
      const track = trackIndex.get(trackId)

      if (!track)
      {
        trackId = undefined
      }
      else
      {
        const coverage = getTrackCoverageForWindow(track, sw.start, sw.end, windowCoverageCache)

        if (coverage <= 0)
        {
          trackId = undefined
        }
      }
    }

    if (!trackId)
    {
      const best = tracks
        .map(track => ({ id: track.id, coverage: getTrackCoverageForWindow(track, sw.start, sw.end, windowCoverageCache) }))
        .filter(item => item.coverage > 0)
        .sort((a, b) => {
          if (b.coverage !== a.coverage)
          {
            return b.coverage - a.coverage
          }

          return a.id.localeCompare(b.id)
        })[0]

      if (best)
      {
        trackId = best.id
      }
    }

    if (trackId)
    {
      out.push({ start: sw.start, end: sw.end, trackId })
    }
  }

  return out
}

function getTrackCoverageForWindow(track: FaceTrack, start: number, end: number, cache: Map<string, number>): number {
  const key = `${track.id}:${start.toFixed(3)}:${end.toFixed(3)}`

  if (cache.has(key))
  {
    return cache.get(key) ?? 0
  }

  const coverage = computeTrackCoverage(track, start, end)
  cache.set(key, coverage)

  return coverage
}

function computeTrackCoverage(track: FaceTrack, start: number, end: number): number {
  if (track.boxes.length === 0 || end <= start)
  {
    return 0
  }

  const fallbackStep = getSampleStepSeconds()
  let avgDelta = fallbackStep

  if (track.boxes.length > 1)
  {
    const totalSpan = track.boxes[track.boxes.length - 1].t - track.boxes[0].t

    if (isFinite(totalSpan) && totalSpan > 0)
    {
      avgDelta = totalSpan / (track.boxes.length - 1)
    }
  }

  let covered = 0

  for (let i = 0; i < track.boxes.length; i++)
  {
    const box = track.boxes[i]
    const segStart = Math.max(start, box.t)
    let segEnd = end

    if (i < track.boxes.length - 1)
    {
      segEnd = Math.min(end, track.boxes[i + 1].t)
    }
    else
    {
      segEnd = Math.min(end, box.t + avgDelta)
    }

    if (segEnd > segStart)
    {
      covered += segEnd - segStart
    }
  }

  return covered
}

let cachedSampleStep: number | null = null

function getSampleStepSeconds(): number {
  if (cachedSampleStep === null)
  {
    const fps = Number(process.env.FRAMING_SAMPLE_FPS || 3)

    if (!isFinite(fps) || fps <= 0)
    {
      cachedSampleStep = 1 / 3
    }
    else
    {
      cachedSampleStep = 1 / fps
    }
  }

  return cachedSampleStep
}

let cachedTorsoMultiplier: number | null = null

function getTorsoMultiplier(): number {
  if (cachedTorsoMultiplier === null)
  {
    const val = parseFloat(process.env.FRAMING_TORSO_MULTIPLIER || '2.7')
    cachedTorsoMultiplier = isNaN(val) || val <= 0 ? 2.7 : val
  }
  
  return cachedTorsoMultiplier
}

function estimateBodyBox(faceBox: FaceBox, baseW: number, baseH: number): BodyBox | null {
  if (!faceBox.landmarks || faceBox.landmarks.length < 68)
  {
    return null
  }
  
  const lm = faceBox.landmarks
  
  const chinY = lm[8][1]
  const eyebrowTopY = Math.min(lm[19][1], lm[24][1])
  const headHeight = chinY - eyebrowTopY
  
  if (headHeight <= 0 || !isFinite(headHeight))
  {
    return null
  }
  
  const jawLeft = lm[0]
  const jawRight = lm[16]
  const shoulderWidth = Math.abs(jawRight[0] - jawLeft[0]) * 1.8
  
  if (!isFinite(shoulderWidth) || shoulderWidth <= 0)
  {
    return null
  }
  
  const torsoMultiplier = getTorsoMultiplier()
  const torsoHeight = headHeight * torsoMultiplier
  
  const estimatedTopY = eyebrowTopY - headHeight * 0.2
  const estimatedBottomY = Math.min(chinY + torsoHeight, baseH)
  
  const bodyHeight = estimatedBottomY - estimatedTopY
  const centerX = (jawLeft[0] + jawRight[0]) / 2
  const centerY = estimatedTopY + bodyHeight * 0.4
  
  if (!isFinite(centerX) || !isFinite(centerY))
  {
    return null
  }
  
  const bodyLeft = Math.max(0, centerX - shoulderWidth / 2)
  const bodyRight = Math.min(baseW, centerX + shoulderWidth / 2)
  const bodyWidth = bodyRight - bodyLeft
  
  return {
    x: bodyLeft,
    y: estimatedTopY,
    w: bodyWidth,
    h: bodyHeight,
    cx: centerX,
    cy: centerY
  }
}

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

function clamp(value: number, min: number, max: number): number {
  if (value < min)
  {
    return min
  }

  if (value > max)
  {
    return max
  }

  return value
}

function enforceGroupBounds(
  desiredX: number,
  targetW: number,
  baseW: number,
  bounds: { minX: number; maxX: number } | null,
): number {
  const minCropX = 0
  const maxCropX = Math.max(0, baseW - targetW)
  const normalize = (value: number) => {
    const clamped = clamp(value, minCropX, maxCropX)

    if (Number.isInteger(desiredX))
    {
      return Math.round(clamped)
    }

    return clamped
  }

  if (!bounds)
  {
    return normalize(desiredX)
  }

  const span = bounds.maxX - bounds.minX

  if (span <= 0)
  {
    return normalize(desiredX)
  }

  if (span >= targetW)
  {
    const centered = bounds.minX + span / 2 - targetW / 2
    return normalize(centered)
  }

  const minAllowed = clamp(bounds.maxX - targetW, minCropX, maxCropX)
  const maxAllowed = clamp(bounds.minX, minCropX, maxCropX)

  if (minAllowed <= maxAllowed)
  {
    if (desiredX < minAllowed)
    {
      return normalize(minAllowed)
    }

    if (desiredX > maxAllowed)
    {
      return normalize(maxAllowed)
    }

    return normalize(desiredX)
  }

  const fallback = bounds.minX + span / 2 - targetW / 2
  return normalize(fallback)
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

  for (const m of mapping)
  {
    const tr = tracks.find(t => t.id === m.trackId)
    
    if (!tr)
    {
      continue
    }
    
    for (const b of tr.boxes)
    {
      if (b.t < m.start)
      {
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

      if (marginPx > 0)
      {
        const allowedMin = Math.max(minCropX, Math.ceil(cx - targetW + marginPx))
        const allowedMax = Math.min(maxCropX, Math.floor(cx - marginPx))

        if (allowedMin <= allowedMax)
        {
          if (x < allowedMin)
          {
            x = allowedMin
          }
          else if (x > allowedMax)
          {
            x = allowedMax
          }
        }
      }

      x = enforceGroupBounds(x, targetW, baseW, groupBounds)
      x = Math.max(minCropX, Math.min(x, maxCropX))

      let y = Math.round(cy - targetH / 2)

      const safeTop = Math.round(targetH * c.safeTop)
      const safeBottom = Math.round(targetH * c.safeBottom)

      y = Math.max(-safeTop, Math.min(y, baseH - targetH + safeBottom))
      
      out.push({ t: b.t, x, y, w: targetW, h: targetH })
    }
  }
  
  return dedupeByTime(out, 0.1)
}

function applyHorizontalMargin(cx: number, targetW: number, baseW: number, marginRatio: number): number {
  const raw = cx - targetW / 2
  const clampedRaw = Math.max(0, Math.min(raw, baseW - targetW))

  if (marginRatio <= 0)
  {
    return Math.round(clampedRaw)
  }

  const marginPx = Math.max(0, Math.min(Math.round(targetW * marginRatio), Math.floor(targetW / 2)))

  if (marginPx === 0)
  {
    return Math.round(clampedRaw)
  }

  const feasibleMin = cx - (targetW - marginPx)
  const feasibleMax = cx - marginPx
  const clipMin = Math.max(0, Math.ceil(feasibleMin))
  const clipMax = Math.min(baseW - targetW, Math.floor(feasibleMax))

  if (clipMin <= clipMax)
  {
    const desired = Math.round(raw)

    if (desired < clipMin)
    {
      return clipMin
    }

    if (desired > clipMax)
    {
      return clipMax
    }

    return desired
  }

  return Math.round(clampedRaw)
}

function dedupeByTime(kf: CropKF[], minDelta: number): CropKF[] {
  if (kf.length === 0)
  {
    return kf
  }
  
  const out: CropKF[] = [kf[0]]
  
  for (let i = 1; i < kf.length; i++)
  {
    if (kf[i].t - out[out.length - 1].t >= minDelta)
    {
      out.push(kf[i])
    }
  }
  
  return out
}

function smoothAndConstrain(kf: CropKF[], baseW: number, baseH: number, segStart: number, segEnd: number, c: Constraints): CropKF[] {
  if (kf.length === 0)
  {
    return kf
  }
  
  const win = 3
  const sm: CropKF[] = []
  
  for (let i = 0; i < kf.length; i++)
  {
    let sx = 0
    let sy = 0
    let n = 0
    
    for (let j = Math.max(0, i - win); j <= Math.min(kf.length - 1, i + win); j++)
    {
      sx += kf[j].x
      sy += kf[j].y
      n += 1
    }
    
    const x = Math.round(sx / n)
    const y = Math.round(sy / n)
    sm.push({ t: kf[i].t, x, y, w: kf[i].w, h: kf[i].h })
  }
  
  const out: CropKF[] = [sm[0]]
  
  for (let i = 1; i < sm.length; i++)
  {
    const dt = Math.max(0.001, sm[i].t - sm[i - 1].t)
    const dx = sm[i].x - out[out.length - 1].x
    const dy = sm[i].y - out[out.length - 1].y
    const maxStep = Math.round(c.maxPan * dt)
    const nx = stepLimit(out[out.length - 1].x, sm[i].x, maxStep)
    const ny = stepLimit(out[out.length - 1].y, sm[i].y, maxStep)
    out.push({ t: sm[i].t, x: nx, y: ny, w: sm[i].w, h: sm[i].h })
  }
  
  return easeSpeakerEdges(out, segStart, segEnd, c.easeMs / 1000)
}

function stepLimit(a: number, b: number, m: number): number {
  if (Math.abs(b - a) <= m)
  {
    return b
  }
  
  if (b > a)
  {
    return a + m
  }
  
  return a - m
}

function easeSpeakerEdges(kf: CropKF[], segStart: number, segEnd: number, easeS: number): CropKF[] {
  if (kf.length < 2)
  {
    return kf
  }
  
  const out: CropKF[] = [kf[0]]
  
  for (let i = 1; i < kf.length; i++)
  {
    const t = kf[i].t
    const p = out[out.length - 1]
    const fromStart = Math.min(1, Math.max(0, (t - segStart) / easeS))
    const fromEnd = Math.min(1, Math.max(0, (segEnd - t) / easeS))
    const alpha = Math.min(fromStart, fromEnd)
    const x = Math.round(p.x + (kf[i].x - p.x) * alpha)
    const y = Math.round(p.y + (kf[i].y - p.y) * alpha)
    out.push({ t, x, y, w: kf[i].w, h: kf[i].h })
  }
  
  return out
}

export function buildPiecewiseExpr(kf: CropKF[], key: 'x' | 'y'): string {
  if (kf.length === 0)
  {
    return '0'
  }
  
  const parts: string[] = []
  
  const firstVal = key === 'x' ? kf[0].x : kf[0].y
  parts.push(`lt(t,${kf[0].t.toFixed(3)})*${firstVal.toFixed(0)}`)
  
  for (let i = 0; i < kf.length - 1; i++)
  {
    const a = kf[i]
    const b = kf[i + 1]
    const ta = a.t
    const tb = b.t
    const va = key === 'x' ? a.x : a.y
    const vb = key === 'x' ? b.x : b.y
    const slope = (vb - va) / Math.max(0.001, tb - ta)
    const expr = `between(t,${ta.toFixed(3)},${tb.toFixed(3)})*(${va.toFixed(0)}+(${slope.toFixed(6)})*(t-${ta.toFixed(3)}))`
    parts.push(expr)
  }
  
  const last = key === 'x' ? kf[kf.length - 1].x : kf[kf.length - 1].y
  parts.push(`gte(t,${kf[kf.length - 1].t.toFixed(3)})*${last.toFixed(0)}`)
  
  return parts.join('+')
}

export const __testables = {
  mapSpeakersToTracks,
  buildKeyframes,
  applyHorizontalMargin,
  getTrackCoverageForWindow,
  computeTrackCoverage
}
