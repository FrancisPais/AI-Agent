import { spawn } from 'child_process'
import { promisify } from 'util'
import { exec } from 'child_process'
import { existsSync, writeFileSync, mkdirSync, chmodSync, unlinkSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { prisma } from '@/src/lib/prisma'
import { decrypt } from '@/src/lib/encryption'

const execPromise = promisify(exec)

type DownloadInfo = {
  file: string
  height: number
  fps: number
  tbr: number
  vcodec: string
  acodec: string
}

function run(cmd: string, args: string[]): Promise<{ stdout: string, stderr: string }> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
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
        reject(new Error(err || `exit ${code}`))
      }
    })
  })
}

export async function downloadBest(url: string, cookiesPath?: string): Promise<DownloadInfo> {
  const outDir = tmpdir()
  const outTpl = join(outDir, '%(id)s.%(ext)s')
  const ytdlp = await findYtDlp()
  const args = [
    '-j',
    '--no-simulate',
    '-f', 'bv*[height<=2160][ext=mp4]+ba[ext=m4a]/bv*[height<=2160]+ba/b',
    '-S', 'res,fps,br,codec:h264:av01:vp9',
    '--merge-output-format', 'mp4',
    '--verbose',
    '-o', outTpl,
    url
  ]
  if (cookiesPath && cookiesPath.length > 0)
  {
    args.splice(1, 0, '--cookies', cookiesPath)
  }
  console.log('yt-dlp command:', ytdlp, args.join(' '))
  const { stdout, stderr } = await run(ytdlp, args)
  if (stderr && stderr.length > 0)
  {
    console.log('yt-dlp stderr:', stderr.substring(0, 2000))
  }
  const lines = stdout.trim().split('\n')
  const last = JSON.parse(lines[lines.length - 1])
  const file = last['_filename']
  const rf = (last['requested_formats'] && last['requested_formats'][0]) || last
  const height = Number(rf['height'] || 0)
  const fps = Number(rf['fps'] || 0)
  const tbr = Number(rf['tbr'] || 0)
  const vcodec = String(rf['vcodec'] || '')
  const acodec = String(rf['acodec'] || '')
  console.log(`Downloaded: ${height}p ${fps}fps ${vcodec} @ ${tbr}kbps`)
  return { file, height, fps, tbr, vcodec, acodec }
}

export async function createUserCookiesFile(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { youtubeCookies: true }
  })
  
  if (!user || !user.youtubeCookies)
  {
    return null
  }
  
  const cookiesDir = join(tmpdir(), 'yt-cookies')
  
  if (!existsSync(cookiesDir))
  {
    mkdirSync(cookiesDir, { recursive: true })
  }
  
  const cookiesPath = join(cookiesDir, `${userId}.txt`)
  const decryptedCookies = decrypt(user.youtubeCookies)
  
  try {
    writeFileSync(cookiesPath, decryptedCookies)
    chmodSync(cookiesPath, 0o600)
  }
  catch (error: any) {
    if (error?.errno === -122)
    {
      throw new Error('Temporary storage is full. Please try again in a few moments.')
    }
    throw error
  }
  
  await prisma.user.update({
    where: { id: userId },
    data: { youtubeCookiesLastUsedAt: new Date() }
  })
  
  return cookiesPath
}

export function cleanupUserCookiesFile(userId: string): void {
  const cookiesPath = join(tmpdir(), 'yt-cookies', `${userId}.txt`)
  
  try {
    if (existsSync(cookiesPath))
    {
      unlinkSync(cookiesPath)
    }
  }
  catch (error) {
    console.error('Failed to cleanup cookies file:', error)
  }
}

async function findYtDlp(): Promise<string> {
  if (process.env.YT_DLP_PATH && existsSync(process.env.YT_DLP_PATH))
  {
    return process.env.YT_DLP_PATH
  }
  
  try {
    await execPromise('which yt-dlp')
    return 'yt-dlp'
  }
  catch {
    try {
      await execPromise('which youtube-dl')
      return 'youtube-dl'
    }
    catch {
      throw new Error('yt-dlp or youtube-dl not found in PATH')
    }
  }
}

export interface Chapter {
  title: string
  start_time?: number
  end_time?: number
  startSec: number
  endSec: number
}

interface VideoMetadata {
  id: string
  title: string
  duration: number
  chapters: Chapter[]
}

export async function getVideoMetadata(url: string, userId: string): Promise<VideoMetadata> {
  const ytdlp = await findYtDlp()
  const cookiesPath = await createUserCookiesFile(userId)
  const args = [
    '--dump-json',
    '--no-playlist',
    url
  ]
  
  if (cookiesPath)
  {
    args.splice(0, 0, '--cookies', cookiesPath)
  }
  
  const { stdout } = await run(ytdlp, args)
  const metadata = JSON.parse(stdout)
  
  const chapters = (metadata.chapters || []).map((ch: any) => ({
    title: ch.title,
    start_time: ch.start_time,
    end_time: ch.end_time,
    startSec: ch.start_time,
    endSec: ch.end_time
  }))
  
  return {
    id: metadata.id || '',
    title: metadata.title || 'Unknown',
    duration: metadata.duration || 0,
    chapters
  }
}

export async function downloadVideo(url: string, outputPath: string, userId: string): Promise<DownloadInfo> {
  const cookiesPath = await createUserCookiesFile(userId)
  let info: DownloadInfo | null = null
  let videoId: string | null = null
  
  try {
    const metadata = await getVideoMetadata(url, userId)
    videoId = metadata.id
    
    info = await downloadBest(url, cookiesPath || undefined)
    
    if (info.file.length === 0)
    {
      throw new Error('no file downloaded')
    }
    
    const { rename } = await import('fs/promises')
    await rename(info.file, outputPath)
    return info
  }
  finally {
    if (videoId)
    {
      cleanupYtDlpTempFiles(videoId)
    }
  }
}

function cleanupYtDlpTempFiles(videoId: string): void {
  const { readdirSync, rmSync } = require('fs')
  const tmp = tmpdir()
  
  try {
    const files = readdirSync(tmp)
    let cleaned = 0
    
    for (const file of files)
    {
      if (file.startsWith(videoId) && file.match(/\.(webm|mp4|m4a|part)$/))
      {
        try {
          rmSync(join(tmp, file), { force: true })
          cleaned++
        }
        catch (err) {
          console.error(`Failed to cleanup temp file ${file}:`, err)
        }
      }
    }
    
    if (cleaned > 0)
    {
      console.log(`Cleaned up ${cleaned} temp files for video ${videoId}`)
    }
  }
  catch (err) {
    console.error('Failed to cleanup yt-dlp temp files:', err)
  }
}
