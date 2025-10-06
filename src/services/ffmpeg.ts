import ffmpeg from 'fluent-ffmpeg'
import ffmpegStatic from 'ffmpeg-static'
import { promisify } from 'util'
import { exec } from 'child_process'
import { writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

const execPromise = promisify(exec)

if (ffmpegStatic)
{
  ffmpeg.setFfmpegPath(ffmpegStatic)
}

export interface SceneChange {
  time: number
  score: number
}

export async function detectScenes(videoPath: string): Promise<SceneChange[]> {
  try {
    const ffmpegPath = ffmpegStatic || 'ffmpeg'
    const cmd = `${ffmpegPath} -i "${videoPath}" -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep showinfo`
    const { stdout } = await execPromise(cmd)
    
    const scenes: SceneChange[] = []
    const lines = stdout.split('\n')
    
    for (const line of lines)
    {
      const timeMatch = line.match(/pts_time:([\d.]+)/)
      
      if (timeMatch)
      {
        scenes.push({
          time: parseFloat(timeMatch[1]),
          score: 0.4
        })
      }
    }
    
    return scenes
  }
  catch (error) {
    return []
  }
}

export async function extractAudio(videoPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputPath)
      .outputOptions(['-vn', '-c:a', 'copy'])
      .on('end', () => resolve())
      .on('error', reject)
      .run()
  })
}

export async function compressAudioForTranscription(inputPath: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .outputOptions([
        '-vn',
        '-c:a', 'libmp3lame',
        '-b:a', '64k',
        '-ac', '1',
        '-ar', '16000'
      ])
      .on('end', () => resolve())
      .on('error', reject)
      .run()
  })
}

export async function splitAudioIntoChunks(audioPath: string, chunkDurationSeconds: number): Promise<string[]> {
  const chunks: string[] = []
  const audioDir = audioPath.substring(0, audioPath.lastIndexOf('/'))
  const audioExt = audioPath.substring(audioPath.lastIndexOf('.'))
  
  const ffmpegPath = ffmpegStatic || 'ffmpeg'
  const getDurationCmd = `${ffmpegPath} -i "${audioPath}" 2>&1 | grep "Duration" | cut -d ' ' -f 4 | sed s/,//`
  
  try {
    const { stdout: durationStr } = await execPromise(getDurationCmd)
    const [hours, minutes, seconds] = durationStr.trim().split(':').map(parseFloat)
    const totalDuration = hours * 3600 + minutes * 60 + seconds
    
    const numChunks = Math.ceil(totalDuration / chunkDurationSeconds)
    
    for (let i = 0; i < numChunks; i++) {
      const startTime = i * chunkDurationSeconds
      const chunkPath = join(audioDir, `chunk_${i}${audioExt}`)
      
      await new Promise<void>((resolve, reject) => {
        ffmpeg(audioPath)
          .setStartTime(startTime)
          .duration(chunkDurationSeconds)
          .outputOptions(['-c:a', 'copy'])
          .output(chunkPath)
          .on('end', () => resolve())
          .on('error', reject)
          .run()
      })
      
      chunks.push(chunkPath)
    }
    
    return chunks
  } catch (error) {
    throw new Error(`Failed to split audio: ${error}`)
  }
}

export interface RenderOptions {
  inputPath: string
  outputPath: string
  startTime: number
  duration: number
  srtPath: string
  hookText: string
}

export async function renderVerticalClip(options: RenderOptions): Promise<void> {
  const { inputPath, outputPath, startTime, duration, srtPath, hookText } = options
  
  const escapedSrtPath = srtPath.replace(/\\/g, '/').replace(/:/g, '\\:')
  const escapedHookText = hookText
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/:/g, '\\:')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
  
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startTime)
      .duration(duration)
      .videoCodec('libx264')
      .outputOptions([
        '-preset', 'medium',
        '-crf', '20',
        '-pix_fmt', 'yuv420p',
        '-vf', `crop=ih*9/16:ih,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black,format=yuv420p,subtitles=${escapedSrtPath}:force_style='Fontsize=24,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,BorderStyle=3,Outline=2,Shadow=0,MarginV=80',drawtext=text='${escapedHookText}':fontsize=32:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=72`,
        '-movflags', '+faststart'
      ])
      .audioCodec('aac')
      .audioBitrate('192k')
      .audioFrequency(44100)
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', reject)
      .run()
  })
}

export async function extractThumbnail(videoPath: string, outputPath: string, timestamp: number): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: [timestamp],
        filename: outputPath.split('/').pop()!,
        folder: outputPath.substring(0, outputPath.lastIndexOf('/')),
        size: '1080x1920'
      })
      .on('end', () => resolve())
      .on('error', reject)
  })
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
  const millis = Math.floor((seconds % 1) * 1000)
  
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(millis, 3)}`
}

function pad(num: number, size: number = 2): string {
  let s = num.toString()
  while (s.length < size)
  {
    s = '0' + s
  }
  return s
}
