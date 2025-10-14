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

export function createSrtFile(words: Array<{ word: string; start: number; end: number }>, outputPath: string): void {
  let srtContent = ''
  
  for (let i = 0; i < words.length; i++)
  {
    const word = words[i]
    const startTime = formatSrtTime(word.start)
    const endTime = formatSrtTime(word.end)
    
    srtContent += `${i + 1}\n`
    srtContent += `${startTime} --> ${endTime}\n`
    srtContent += `${word.word}\n\n`
  }
  
  writeFileSync(outputPath, srtContent)
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
