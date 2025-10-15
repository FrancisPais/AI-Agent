import assert from 'node:assert/strict'
import type { Constraints } from '../framingService'
import { __testables } from '../framingService'

type FaceBox = { t: number; x: number; y: number; w: number; h: number; landmarks?: number[][] }

type FaceTrack = { id: string; boxes: FaceBox[] }

type SpeakerWindow = { start: number; end: number; speakerId: string }

const { mapSpeakersToTracks, buildKeyframes } = __testables

function makeTrack(id: string, centers: Array<{ t: number; cx: number }>): FaceTrack {
  const boxes: FaceBox[] = centers.map(({ t, cx }) => ({
    t,
    x: cx - 120,
    y: 200,
    w: 240,
    h: 240
  }))

  return { id, boxes }
}

function runMappingAssignmentTest(): void {
  const speakerWindows: SpeakerWindow[] = [
    { start: 0, end: 1.1, speakerId: 'host' },
    { start: 1.1, end: 2.4, speakerId: 'guest' }
  ]

  const trackA = makeTrack('track_left', [
    { t: 0, cx: 360 },
    { t: 0.4, cx: 360 },
    { t: 0.8, cx: 360 },
    { t: 1.2, cx: 360 }
  ])

  const trackB = makeTrack('track_right', [
    { t: 1.2, cx: 1560 },
    { t: 1.6, cx: 1560 },
    { t: 2.0, cx: 1560 },
    { t: 2.4, cx: 1560 }
  ])

  const mapping = mapSpeakersToTracks(speakerWindows, [trackA, trackB])

  assert.equal(mapping.length, 2)
  assert.equal(mapping[0]?.trackId, 'track_left')
  assert.equal(mapping[1]?.trackId, 'track_right')
}

function runMarginRespectTest(): void {
  const baseW = 1920
  const baseH = 1080
  const constraints: Constraints = {
    margin: 0.12,
    maxPan: 800,
    easeMs: 200,
    centerBiasY: 0.05,
    safeTop: 0.08,
    safeBottom: 0.12
  }

  const speakerWindows: SpeakerWindow[] = [
    { start: 1.1, end: 2.5, speakerId: 'guest' }
  ]

  const track = makeTrack('track_right', [
    { t: 1.1, cx: 1620 },
    { t: 1.5, cx: 1620 },
    { t: 1.9, cx: 1620 },
    { t: 2.3, cx: 1620 }
  ])

  const mapping = mapSpeakersToTracks(speakerWindows, [track])
  const keyframes = buildKeyframes(mapping, [track], baseW, baseH, constraints)

  const targetW = Math.floor(baseH * 9 / 16)
  const marginPx = Math.round(targetW * constraints.margin)
  const centers = new Map(track.boxes.map(box => [box.t.toFixed(3), box.x + box.w / 2]))

  assert.ok(keyframes.length > 0)

  for (const kf of keyframes)
  {
    const key = kf.t.toFixed(3)
    if (!centers.has(key))
    {
      continue
    }

    const cx = centers.get(key) ?? 0
    const offset = cx - kf.x

    assert.ok(
      offset >= marginPx - 2,
      `expected at least ${marginPx}px margin on left, got ${offset}`
    )
    assert.ok(
      offset <= targetW - marginPx + 2,
      `expected at least ${marginPx}px margin on right, got ${targetW - offset}`
    )
  }
}

export function run(): void {
  runMappingAssignmentTest()
  runMarginRespectTest()
  console.log('framingService tests passed')
}

if (require.main === module)
{
  run()
}
