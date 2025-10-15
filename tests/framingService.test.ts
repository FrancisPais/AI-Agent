import { strict as assert } from 'assert'
import { buildKeyframes, Constraints } from '../src/services/framingService'

type FaceBox = { t: number; x: number; y: number; w: number; h: number; landmarks?: number[][] }

type FaceTrack = { id: string; boxes: FaceBox[] }

type MappingEntry = { start: number; end: number; trackId: string }

const baseW = 1920
const baseH = 1080
const targetW = Math.floor(baseH * 9 / 16)

const constraints: Constraints = {
  margin: 0.1,
  maxPan: 1000,
  easeMs: 0,
  centerBiasY: 0,
  safeTop: 0,
  safeBottom: 0,
}

function buildMapping(trackId: string): MappingEntry[] {
  return [{ start: 0, end: 1, trackId }]
}

function assertMargins(x: number, cx: number, marginPx: number): void {
  const left = cx - x
  const right = x + targetW - cx

  assert.ok(left >= marginPx - 1, `Expected left margin >= ${marginPx}, got ${left}`)
  assert.ok(right >= marginPx - 1, `Expected right margin >= ${marginPx}, got ${right}`)
}

// Face-driven centering near the left edge
{
  const faceTrack: FaceTrack = {
    id: 'face-left',
    boxes: [{ t: 0.5, x: 40, y: 20, w: 80, h: 100 }],
  }

  const mapping = buildMapping(faceTrack.id)
  const keyframes = buildKeyframes(mapping, [faceTrack], baseW, baseH, constraints)

  assert.equal(keyframes.length, 1)

  const kf = keyframes[0]
  const marginPx = targetW * constraints.margin
  const cx = faceTrack.boxes[0].x + faceTrack.boxes[0].w / 2

  assert.ok(kf.x >= 0)
  assert.ok(kf.x <= baseW - targetW)
  assertMargins(kf.x, cx, marginPx)
}

// Body-driven centering near the right edge
{
  const centerX = baseW - 140
  const chinY = 200
  const browY = 120

  const landmarks: number[][] = Array.from({ length: 68 }, () => [centerX, browY])
  landmarks[8] = [centerX, chinY]
  landmarks[19] = [centerX - 20, browY]
  landmarks[24] = [centerX + 20, browY]
  landmarks[0] = [centerX - 80, chinY]
  landmarks[16] = [centerX + 80, chinY]

  const faceTrack: FaceTrack = {
    id: 'body-right',
    boxes: [
      {
        t: 0.5,
        x: centerX - 90,
        y: browY - 60,
        w: 180,
        h: 180,
        landmarks,
      },
    ],
  }

  const mapping = buildMapping(faceTrack.id)
  const keyframes = buildKeyframes(mapping, [faceTrack], baseW, baseH, constraints)

  assert.equal(keyframes.length, 1)

  const kf = keyframes[0]
  const marginPx = targetW * constraints.margin
  const bodyCx = centerX

  assert.ok(kf.x >= 0)
  assert.ok(kf.x <= baseW - targetW)
  assertMargins(kf.x, bodyCx, marginPx)
}

console.log('framingService margin tests passed')
