import ffmpegStatic from 'ffmpeg-static'
import ffprobeStatic from 'ffprobe-static'
import { spawn } from 'child_process'
import { writeFileSync } from 'fs'
import * as fs from 'fs/promises'

const ffmpegPath = ffmpegStatic
const ffprobePath = ffprobeStatic.path

interface Probe {
  width: number
  height: number
  fps: number
}

function run(bin: string, args: string[]): Promise<{ stdout: string, stderr: string }> {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    p.stdout.on('data', d => out += d.toString())
    p.stderr.on('data', d => err += d.toString())
    p.on('close', code => {
      if (code === 0)
      {
        resolve({ stdout: out, stderr: err })
      }
      else
      {
        reject(new Error(err || out))
      }
    })
  })
}

export async function probeVideo(file: string): Promise<Probe> {
  const args = [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,avg_frame_rate',
    '-of', 'json',
    file
  ]
  const { stdout } = await run(ffprobePath, args)
  const j = JSON.parse(stdout)
  const s = j.streams[0]
  const fpsParts = String(s.avg_frame_rate || '0/1').split('/')
  const fps = Number(fpsParts[1] === '0' ? 0 : Number(fpsParts[0]) / Number(fpsParts[1]))
  return { width: Number(s.width), height: Number(s.height), fps }
}

function even(n: number): number {
  if (n % 2 === 0)
  {
    return n
  }
  return n - 1
}

function escapeDrawtext(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
}

function chooseTargetSize(srcW: number, srcH: number): { w: number, h: number } {
  let h = srcH
  if (h > 1920)
  {
    h = 1920
  }
  const w = even(Math.round(h * 9 / 16))
  return { w, h: even(h) }
}

function buildFilters(targetW: number, targetH: number): string {
  const scaleW = "'if(gt(iw/ih,0.5625),-2," + targetW + ")'"
  const scaleH = "'if(gt(iw/ih,0.5625)," + targetH + ",-2)'"
  const chain = [
    'scale=' + scaleW + ':' + scaleH,
    'crop=' + targetW + ':' + targetH + ':(in_w-out_w)/2:(in_h-out_h)/2',
    'format=yuv420p'
  ]
  return chain.join(',')
}

export async function renderClip(input: string, startSec: number, endSec: number, srtPath: string | null, outFile: string): Promise<void> {
  const p = await probeVideo(input)
  const tgt = chooseTargetSize(p.width, p.height)
  const filters = buildFilters(tgt.w, tgt.h)
  const vf = srtPath && srtPath.length > 0 ? filters + ',subtitles=\'' + srtPath.replace(/'/g, '\\\'') + '\'' : filters
  const dur = Math.max(0, endSec - startSec)
  const args = [
    '-y',
    '-ss', String(startSec),
    '-t', String(dur),
    '-i', input,
    '-vf', vf,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-preset', 'slow',
    '-crf', '16',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    outFile
  ]
  await run(ffmpegPath!, args)
  await fs.stat(outFile)
}

export async function probeBitrate(file: string): Promise<{ size: number, seconds: number, kbps: number }> {
  const { stdout } = await run(ffprobePath as string, [
    '-v', 'error',
    '-show_entries', 'format=duration,size',
    '-of', 'json',
    file
  ])
  const j = JSON.parse(stdout)
  const size = Number(j.format.size || 0)
  const seconds = Number(j.format.duration || 0)
  const kbps = seconds > 0 ? (size * 8) / seconds / 1000 : 0
  return { size, seconds, kbps }
}

export function getFileSizeBytes(path: string): number {
  const stat = require('fs').statSync(path)
  return stat.size
}

export async function getDurationSeconds(inputPath: string): Promise<number> {
  const { stdout } = await run(ffprobePath as string, [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'json',
    inputPath
  ])
  const j = JSON.parse(stdout)
  return Number(j.format.duration || 0)
}

export interface SceneChange {
  timeSec: number
}

export async function detectScenes(inputPath: string, threshold = 0.3): Promise<SceneChange[]> {
  const args = [
    '-i', inputPath,
    '-vf', `select='gt(scene,${threshold})',showinfo`,
    '-f', 'null',
    '-'
  ]
  const { stderr } = await run(ffmpegPath!, args)
  const lines = stderr.split('\n')
  const changes: SceneChange[] = []
  for (const line of lines)
  {
    const match = line.match(/pts_time:([\d.]+)/)
    if (match)
    {
      changes.push({ timeSec: parseFloat(match[1]) })
    }
  }
  return changes
}

export async function extractAudio(inputPath: string, outputPath: string): Promise<void> {
  await run(ffmpegPath!, [
    '-y',
    '-i', inputPath,
    '-vn',
    '-acodec', 'copy',
    outputPath
  ])
}

export async function compressAudioForTranscription(inputPath: string, outputPath: string): Promise<void> {
  await run(ffmpegPath!, [
    '-y',
    '-i', inputPath,
    '-ar', '16000',
    '-ac', '1',
    '-c:a', 'libmp3lame',
    '-b:a', '64k',
    outputPath
  ])
}

export async function extractThumbnail(videoPath: string, outputPath: string, timeSec: number): Promise<void> {
  await run(ffmpegPath!, [
    '-y',
    '-ss', String(timeSec),
    '-i', videoPath,
    '-vframes', '1',
    '-q:v', '2',
    outputPath
  ])
}

const MAX_CUE_DURATION = 4.5
const MAX_CUE_GAP = 0.8
const MAX_TOTAL_CHARACTERS = 84
const MAX_LINE_LENGTH = 42
const MAX_LINES_PER_CUE = 2
const IDEAL_CHAR_BREAK = 28
const SENTENCE_ENDING = /[.!?…]/
const CLAUSE_ENDING = /[,;:\u2014\u2013]/

interface TimedWord {
  word: string
  start: number
  end: number
}

export function createSrtFile(words: Array<TimedWord>, outputPath: string): void {
  const sanitizedWords = words
    .map((w) => ({ ...w, word: sanitizeWord(w.word) }))
    .filter((w) => w.word.length > 0)

  if (sanitizedWords.length === 0)
  {
    writeFileSync(outputPath, '')
    return
  }

  const cues: string[] = []
  let currentCue: TimedWord[] = []
  let cueStart = sanitizedWords[0].start

  const flushCue = () => {
    if (currentCue.length === 0)
    {
      return
    }

    const startTime = formatSrtTime(cueStart)
    const endTime = formatSrtTime(currentCue[currentCue.length - 1].end)
    const lines = formatCueLines(currentCue)

    cues.push([
      String(cues.length + 1),
      `${startTime} --> ${endTime}`,
      ...lines
    ].join('\n'))

    currentCue = []
  }

  sanitizedWords.forEach((word, index) => {
    const previousWord = currentCue[currentCue.length - 1]
    if (previousWord)
    {
      const gap = word.start - previousWord.end
      if (gap >= MAX_CUE_GAP)
      {
        flushCue()
      }
    }

    if (currentCue.length === 0)
    {
      cueStart = word.start
    }

    const candidateCue = [...currentCue, word]
    const candidateDuration = word.end - cueStart
    const candidateChars = measureCueCharacters(candidateCue)

    if (currentCue.length > 0 && (candidateDuration > MAX_CUE_DURATION || candidateChars > MAX_TOTAL_CHARACTERS))
    {
      flushCue()
      cueStart = word.start
    }

    currentCue.push(word)

    const currentDuration = currentCue[currentCue.length - 1].end - cueStart
    const currentChars = measureCueCharacters(currentCue)
    const nextWord = sanitizedWords[index + 1]
    const endsSentence = endsWithRegex(word.word, SENTENCE_ENDING)
    const endsClause = endsWithRegex(word.word, CLAUSE_ENDING)

    if (endsSentence)
    {
      flushCue()
      return
    }

    if (endsClause && (currentChars >= IDEAL_CHAR_BREAK || currentDuration >= MAX_CUE_DURATION / 2))
    {
      flushCue()
      return
    }

    if (!nextWord)
    {
      flushCue()
      return
    }

    const gapToNext = nextWord.start - word.end
    if (gapToNext >= MAX_CUE_GAP)
    {
      flushCue()
      return
    }

    if (currentDuration >= MAX_CUE_DURATION || currentChars >= MAX_TOTAL_CHARACTERS)
    {
      flushCue()
    }
  })

  flushCue()

  const srtContent = cues.join('\n\n') + '\n'
  writeFileSync(outputPath, srtContent)
}

function sanitizeWord(word: string): string {
  return word.replace(/\s+/g, ' ').trim()
}

function measureCueCharacters(words: TimedWord[]): number {
  return buildCueText(words).length
}

function buildCueText(words: TimedWord[]): string {
  const joined = words.map((w) => w.word).join(' ')
  return joined
    .replace(/\s+([,.;!?…:\u2014\u2013])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatCueLines(words: TimedWord[]): string[] {
  const text = buildCueText(words)
  if (text.length === 0)
  {
    return ['']
  }

  let lines = wrapText(text, MAX_LINE_LENGTH)
  if (lines.length > MAX_LINES_PER_CUE)
  {
    lines = rebalanceLines(words)
  }
  return lines
}

function wrapText(text: string, maxLen: number): string[] {
  const tokens = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ''

  for (const token of tokens)
  {
    const candidate = current.length > 0 ? `${current} ${token}` : token
    if (candidate.length <= maxLen || current.length === 0)
    {
      current = candidate
    }
    else
    {
      lines.push(current)
      current = token
    }
  }

  if (current.length > 0)
  {
    lines.push(current)
  }

  return lines
}

function rebalanceLines(words: TimedWord[]): string[] {
  const tokens = buildCueText(words).split(/\s+/).filter(Boolean)
  if (tokens.length === 0)
  {
    return ['']
  }

  let bestSplit = Math.ceil(tokens.length / 2)
  let bestLines = [
    tokens.slice(0, bestSplit).join(' '),
    tokens.slice(bestSplit).join(' ')
  ]
  let bestScore = Math.max(...bestLines.map((l) => l.length))

  for (let i = 1; i < tokens.length; i++)
  {
    const left = tokens.slice(0, i).join(' ')
    const right = tokens.slice(i).join(' ')
    const leftLength = left.length
    const rightLength = right.length
    const score = Math.max(leftLength, rightLength)
    if (leftLength <= MAX_LINE_LENGTH && rightLength <= MAX_LINE_LENGTH && score < bestScore)
    {
      bestLines = [left, right]
      bestScore = score
    }
  }

  if (bestLines[0].length <= MAX_LINE_LENGTH && bestLines[1].length <= MAX_LINE_LENGTH)
  {
    return bestLines
  }

  const wrapped = wrapText(tokens.join(' '), MAX_LINE_LENGTH)
  if (wrapped.length <= MAX_LINES_PER_CUE)
  {
    return wrapped
  }

  const firstLines = wrapped.slice(0, MAX_LINES_PER_CUE - 1)
  const remaining = wrapped.slice(MAX_LINES_PER_CUE - 1).join(' ')
  return [...firstLines, remaining.trim()].filter((line) => line.length > 0)
}

function endsWithRegex(text: string, regex: RegExp): boolean {
  return regex.test(text.slice(-1))
}

function formatSrtTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)
  
  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(ms, 3)}`
}

function pad(num: number, size: number): string {
  let s = num.toString()
  while (s.length < size)
  {
    s = '0' + s
  }
  return s
}

interface RenderVerticalClipOptions {
  inputPath: string
  outputPath: string
  startTime: number
  duration: number
  srtPath: string
  hookText: string
}

export async function renderVerticalClip(options: RenderVerticalClipOptions): Promise<void> {
  const p = await probeVideo(options.inputPath)
  const tgt = chooseTargetSize(p.width, p.height)
  const filters = buildFilters(tgt.w, tgt.h)
  
  let vf = filters
  
  if (options.srtPath && options.srtPath.length > 0)
  {
    vf = vf + ',subtitles=\'' + options.srtPath.replace(/'/g, '\\\'') + '\''
  }
  
  if (options.hookText && options.hookText.length > 0)
  {
    const hookEscaped = escapeDrawtext(options.hookText)
    const hookFilter = 'drawtext=text=\'' + hookEscaped + '\':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=52:fontcolor=white:borderw=4:bordercolor=black:x=(w-text_w)/2:y=120'
    vf = vf + ',' + hookFilter
  }
  
  const dur = Math.max(0, options.duration)
  const args = [
    '-y',
    '-ss', String(options.startTime),
    '-t', String(dur),
    '-i', options.inputPath,
    '-vf', vf,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-preset', 'slow',
    '-crf', '16',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    options.outputPath
  ]
  await run(ffmpegPath!, args)
  await fs.stat(options.outputPath)
}

interface RenderSmartFramedClipOptions {
  inputPath: string
  outputPath: string
  startTime: number
  duration: number
  srtPath: string
  hookText: string
  cropMapExprX: string
  cropMapExprY: string
  cropW: number
  cropH: number
}

export async function renderSmartFramedClip(options: RenderSmartFramedClipOptions): Promise<void> {
  const cropFilter = `crop=${options.cropW}:${options.cropH}:'${options.cropMapExprX}':'${options.cropMapExprY}'`
  let vf = cropFilter + ',scale=1080:1920,format=yuv420p'
  
  if (options.srtPath && options.srtPath.length > 0)
  {
    vf = vf + ',subtitles=\'' + options.srtPath.replace(/'/g, '\\\'') + '\''
  }
  
  if (options.hookText && options.hookText.length > 0)
  {
    const hookEscaped = escapeDrawtext(options.hookText)
    const hookFilter = 'drawtext=text=\'' + hookEscaped + '\':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=52:fontcolor=white:borderw=4:bordercolor=black:x=(w-text_w)/2:y=120'
    vf = vf + ',' + hookFilter
  }
  
  const dur = Math.max(0, options.duration)
  const args = [
    '-y',
    '-ss', String(options.startTime),
    '-t', String(dur),
    '-i', options.inputPath,
    '-vf', vf,
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-preset', 'slow',
    '-crf', '16',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    options.outputPath
  ]
  await run(ffmpegPath!, args)
  await fs.stat(options.outputPath)
}
