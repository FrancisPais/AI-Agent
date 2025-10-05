import { spawn } from 'child_process'
import { promisify } from 'util'
import { exec } from 'child_process'
import { existsSync, writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

const execPromise = promisify(exec)

function getCookiesPath(): string | null {
  if (process.env.YOUTUBE_COOKIES)
  {
    const cookiesDir = join(tmpdir(), 'yt-cookies')
    
    if (!existsSync(cookiesDir))
    {
      mkdirSync(cookiesDir, { recursive: true })
    }
    
    const cookiesPath = join(cookiesDir, 'cookies.txt')
    writeFileSync(cookiesPath, process.env.YOUTUBE_COOKIES)
    return cookiesPath
  }
  return null
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

export async function getVideoMetadata(url: string): Promise<VideoMetadata> {
  const ytDlp = await findYtDlp()
  const cookiesPath = getCookiesPath()
  
  const strategies = [
    { client: 'ios', skipAvailabilityCheck: false, useBrowserCookies: false },
    { client: 'android', skipAvailabilityCheck: false, useBrowserCookies: false },
    { client: 'web', skipAvailabilityCheck: true, useBrowserCookies: false },
    { client: 'mweb', skipAvailabilityCheck: true, useBrowserCookies: false },
    { client: 'web', skipAvailabilityCheck: true, useBrowserCookies: true }
  ]
  
  let lastError: Error | null = null
  
  for (const strategy of strategies)
  {
    try {
      let cmd = `${ytDlp} --dump-json --no-download --extractor-args "youtube:player_client=${strategy.client}`
      
      if (strategy.skipAvailabilityCheck)
      {
        cmd += `;skip=authcheck`
      }
      
      cmd += `"`
      
      if (cookiesPath)
      {
        cmd += ` --cookies "${cookiesPath}"`
      }
      else if (strategy.useBrowserCookies)
      {
        cmd += ` --cookies-from-browser chrome`
      }
      
      cmd += ` "${url}"`
      
      const { stdout } = await execPromise(cmd)
      const data = JSON.parse(stdout)
      
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

export async function downloadVideo(url: string, outputPath: string): Promise<void> {
  const ytDlp = await findYtDlp()
  const cookiesPath = getCookiesPath()
  
  const strategies = [
    { client: 'ios', skipAvailabilityCheck: false, useBrowserCookies: false },
    { client: 'android', skipAvailabilityCheck: false, useBrowserCookies: false },
    { client: 'web', skipAvailabilityCheck: true, useBrowserCookies: false },
    { client: 'mweb', skipAvailabilityCheck: true, useBrowserCookies: false },
    { client: 'web', skipAvailabilityCheck: true, useBrowserCookies: true }
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
          '-f', 'best[ext=mp4]/bestvideo*+bestaudio/best',
          '--merge-output-format', 'mp4',
          '--extractor-args', extractorArgs
        ]
        
        if (cookiesPath)
        {
          args.push('--cookies', cookiesPath)
        }
        else if (strategy.useBrowserCookies)
        {
          args.push('--cookies-from-browser', 'chrome')
        }
        
        args.push('-o', outputPath, url)
        
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
