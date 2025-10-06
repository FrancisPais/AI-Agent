import { spawn } from 'child_process'
import { promisify } from 'util'
import { exec } from 'child_process'
import { existsSync, writeFileSync, mkdirSync, chmodSync, unlinkSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { prisma } from '@/src/lib/prisma'
import { decrypt } from '@/src/lib/encryption'

const execPromise = promisify(exec)

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
  
  writeFileSync(cookiesPath, decryptedCookies)
  chmodSync(cookiesPath, 0o600)
  
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

export interface VideoMetadata {
  title: string
  duration: number
  url: string
}

export async function getVideoMetadata(url: string, userId: string): Promise<VideoMetadata> {
  const ytDlp = await findYtDlp()
  const cookiesPath = await createUserCookiesFile(userId)
  
  if (!cookiesPath)
  {
    throw new Error('YouTube cookies not configured. Please upload your YouTube cookies.')
  }
  
  try {
    const strategies = [
      { client: 'ios', skipAvailabilityCheck: false },
      { client: 'android', skipAvailabilityCheck: false },
      { client: 'web', skipAvailabilityCheck: true },
      { client: 'mweb', skipAvailabilityCheck: true }
    ]
    
    let lastError: Error | null = null
    
    for (const strategy of strategies)
    {
      try {
        let extractorArgs = `youtube:player_client=${strategy.client}`
        
        if (strategy.skipAvailabilityCheck)
        {
          extractorArgs += `;skip=authcheck`
        }
        
        const args = [
          '--dump-json',
          '--no-download',
          '--force-ipv4',
          '--sleep-requests', '1',
          '--extractor-args', extractorArgs,
          '--cookies', cookiesPath,
          url
        ]
        
        const result = await new Promise<string>((resolve, reject) => {
          let stdout = ''
          let stderr = ''
          
          const process = spawn(ytDlp, args)
          
          process.stdout.on('data', (data) => {
            stdout += data.toString()
          })
          
          process.stderr.on('data', (data) => {
            stderr += data.toString()
          })
          
          process.on('close', (code) => {
            if (code === 0)
            {
              resolve(stdout)
            }
            else
            {
              reject(new Error(`yt-dlp exited with code ${code}: ${stderr}`))
            }
          })
          
          process.on('error', reject)
        })
        
        const data = JSON.parse(result)
        
        return {
          title: data.title,
          duration: Math.floor(data.duration),
          url: data.url
        }
      }
      catch (error: any) {
        lastError = error
        continue
      }
    }
    
    throw lastError || new Error('Failed to fetch video metadata')
  }
  finally {
    cleanupUserCookiesFile(userId)
  }
}

export async function downloadVideo(url: string, outputPath: string, userId: string): Promise<void> {
  const ytDlp = await findYtDlp()
  const cookiesPath = await createUserCookiesFile(userId)
  
  if (!cookiesPath)
  {
    throw new Error('YouTube cookies not configured. Please upload your YouTube cookies.')
  }
  
  try {
    const strategies = [
      { client: 'ios', skipAvailabilityCheck: false },
      { client: 'android', skipAvailabilityCheck: false },
      { client: 'web', skipAvailabilityCheck: true },
      { client: 'mweb', skipAvailabilityCheck: true }
    ]
    
    let lastError: Error | null = null
    
    for (const strategy of strategies) {
      try {
        await new Promise<void>((resolve, reject) => {
          let errorOutput = ''
          
          let extractorArgs = `youtube:player_client=${strategy.client}`
          
          if (strategy.skipAvailabilityCheck)
          {
            extractorArgs += `;skip=authcheck`
          }
          
          const args = [
            '-f', "bv*[height<=1080][fps<=60][vcodec~='(avc1|h264)']+ba[acodec~='(m4a|aac)']/b[ext=mp4]",
            '--merge-output-format', 'mp4',
            '--force-ipv4',
            '--sleep-requests', '1',
            '--min-sleep-interval', '1',
            '--max-sleep-interval', '5',
            '--extractor-args', extractorArgs,
            '--cookies', cookiesPath,
            '-o', outputPath,
            url
          ]
          
          const process = spawn(ytDlp, args)
          
          process.stderr.on('data', (data) => {
            errorOutput += data.toString()
          })
          
          process.stdout.on('data', (data) => {
            console.log(data.toString())
          })
          
          process.on('close', (code) => {
            if (code === 0)
            {
              resolve()
            }
            else
            {
              reject(new Error(`yt-dlp exited with code ${code}: ${errorOutput}`))
            }
          })
          
          process.on('error', reject)
        })
        
        return
      }
      catch (error: any) {
        lastError = error
        console.log(`Failed with client ${strategy.client}, trying next...`)
        continue
      }
    }
    
    throw lastError || new Error('Failed to download video with all player clients')
  }
  finally {
    cleanupUserCookiesFile(userId)
  }
}
