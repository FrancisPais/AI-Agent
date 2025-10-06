import OpenAI from 'openai'
import { createReadStream, statSync } from 'fs'
import { getFileSizeBytes, getDurationSeconds } from './ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import { join } from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 600000,
  maxRetries: 3
})

export interface TranscriptWord {
  word: string
  start: number
  end: number
}

export interface TranscriptSegment {
  text: string
  start: number
  end: number
  words: TranscriptWord[]
}

const TARGET_MB = parseFloat(process.env.OPENAI_CHUNK_TARGET_MB || '24.5')
const TARGET_BYTES = Math.floor(TARGET_MB * 1024 * 1024)
const MAX_RETRIES = parseInt(process.env.OPENAI_MAX_RETRIES || '2', 10)

export async function withRetries<T>(fn: () => Promise<T>): Promise<T> {
  let attempt = 0
  let delay = 1000
  
  for (;;)
  {
    try {
      const res = await fn()
      return res
    }
    catch (err: any) {
      attempt = attempt + 1
      const code = err?.status || err?.code || 0
      const transient = code === 429 || code === 408 || code === 500 || code === 502 || code === 503 || code === 504
      
      if (attempt > MAX_RETRIES)
      {
        throw err
      }
      
      if (!transient)
      {
        throw err
      }
      
      await new Promise(r => {
        setTimeout(r, delay)
      })
      delay = delay * 2
    }
  }
}

export async function planAudioChunksBySize(inputPath: string, durationSec: number): Promise<{ start: number; duration: number }[]> {
  const sizeBytes = getFileSizeBytes(inputPath)
  let chunks = Math.ceil(sizeBytes / TARGET_BYTES)
  
  if (chunks < 1)
  {
    chunks = 1
  }
  
  const base = Math.floor(durationSec / chunks)
  const rem = durationSec - base * chunks
  const plan: { start: number; duration: number }[] = []
  let cursor = 0
  
  for (let i = 0; i < chunks; i++)
  {
    let d = base
    
    if (i < rem)
    {
      d = d + 1
    }
    
    plan.push({ start: cursor, duration: d })
    cursor = cursor + d
  }
  
  return plan
}

async function extractAudioChunk(inputPath: string, outputPath: string, start: number, duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start)
      .duration(duration)
      .outputOptions(['-c:a', 'copy'])
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', reject)
      .run()
  })
}

async function transcribeAudioFile(audioPath: string, timeOffset: number = 0, retries = 5): Promise<TranscriptWord[]> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= retries; attempt++)
  {
    try {
      const response = await openai.audio.transcriptions.create({
        file: createReadStream(audioPath),
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['word']
      })

      const words: TranscriptWord[] = []
      
      if (response.words)
      {
        for (const word of response.words)
        {
          words.push({
            word: word.word,
            start: word.start + timeOffset,
            end: word.end + timeOffset
          })
        }
      }
      
      return words
    }
    catch (error: any) {
      lastError = error
      
      if (error.code === 'ECONNRESET' || error.cause?.code === 'ECONNRESET' || error.status === 500 || error.status === 503)
      {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000)
        console.log(`Transcription attempt ${attempt}/${retries} failed with network error. Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      throw error
    }
  }
  
  throw lastError || new Error('Failed to transcribe audio after retries')
}

export async function transcribeAudio(audioPath: string): Promise<TranscriptSegment[]> {
  const fileSize = getFileSizeBytes(audioPath)
  const duration = await getDurationSeconds(audioPath)
  const introSkip = parseInt(process.env.INTRO_SKIP_SECONDS || '180', 10)
  
  let effectiveStart = 0
  
  if (duration > introSkip)
  {
    effectiveStart = introSkip
    console.log(`Skipping first ${introSkip}s of audio (intro skip)`)
  }
  
  const effectiveDuration = duration - effectiveStart
  let allWords: TranscriptWord[] = []
  
  if (fileSize > TARGET_BYTES)
  {
    console.log(`Audio file is ${(fileSize / 1024 / 1024).toFixed(1)}MB, splitting into chunks...`)
    const planned = await planAudioChunksBySize(audioPath, effectiveDuration)
    const shifted = planned.map((p) => {
      return { start: p.start + effectiveStart, duration: p.duration }
    })
    
    console.log(`Transcribing ${shifted.length} chunks in parallel (max 3 concurrent)...`)
    
    const audioDir = audioPath.substring(0, audioPath.lastIndexOf('/'))
    const audioExt = audioPath.substring(audioPath.lastIndexOf('.'))
    
    const transcribeChunk = async (plan: { start: number; duration: number }, index: number) => {
      console.log(`Transcribing chunk ${index + 1}/${shifted.length}`)
      const chunkPath = join(audioDir, `chunk_${index}${audioExt}`)
      await extractAudioChunk(audioPath, chunkPath, plan.start, plan.duration)
      return await transcribeAudioFile(chunkPath, plan.start)
    }
    
    const chunkResults: TranscriptWord[][] = []
    const chunkErrors: Array<{ index: number; error: any }> = []
    
    for (let i = 0; i < shifted.length; i += 3)
    {
      const batch = shifted.slice(i, i + 3)
      const batchResults = await Promise.allSettled(
        batch.map((plan, idx) => transcribeChunk(plan, i + idx))
      )
      
      for (let j = 0; j < batchResults.length; j++)
      {
        const result = batchResults[j]
        
        if (result.status === 'fulfilled')
        {
          chunkResults.push(result.value)
        }
        else {
          const chunkIndex = i + j
          console.error(`Chunk ${chunkIndex + 1} failed to transcribe:`, result.reason)
          chunkErrors.push({ index: chunkIndex, error: result.reason })
        }
      }
    }
    
    if (chunkErrors.length > 0 && chunkResults.length === 0)
    {
      throw new Error(`All chunks failed to transcribe. Errors: ${JSON.stringify(chunkErrors)}`)
    }
    
    allWords = chunkResults.flat()
  }
  else {
    if (effectiveStart > 0)
    {
      const audioDir = audioPath.substring(0, audioPath.lastIndexOf('/'))
      const audioExt = audioPath.substring(audioPath.lastIndexOf('.'))
      const skippedPath = join(audioDir, `skipped${audioExt}`)
      await extractAudioChunk(audioPath, skippedPath, effectiveStart, effectiveDuration)
      allWords = await transcribeAudioFile(skippedPath, effectiveStart)
    }
    else {
      allWords = await transcribeAudioFile(audioPath)
    }
  }

  const segments: TranscriptSegment[] = []
  let currentSegment: TranscriptWord[] = []
  let segmentStart = 0
  let segmentText = ''
  
  for (let i = 0; i < allWords.length; i++)
  {
    const word = allWords[i]
    
    if (currentSegment.length === 0)
    {
      segmentStart = word.start
    }
    
    currentSegment.push(word)
    segmentText += word.word + ' '
    
    if (i < allWords.length - 1)
    {
      const gap = allWords[i + 1].start - word.end
      
      if (gap > 0.9 || currentSegment.length >= 50)
      {
        segments.push({
          text: segmentText.trim(),
          start: segmentStart,
          end: word.end,
          words: currentSegment
        })
        
        currentSegment = []
        segmentText = ''
      }
    }
  }
  
  if (currentSegment.length > 0)
  {
    segments.push({
      text: segmentText.trim(),
      start: segmentStart,
      end: currentSegment[currentSegment.length - 1].end,
      words: currentSegment
    })
  }
  
  return segments
}

export interface ScoreResult {
  category: string
  tags: string[]
  scores: {
    hook_strength: number
    retention_likelihood: number
    clarity: number
    shareability: number
    overall: number
  }
  rationale: string
}

export async function scoreClip(title: string, hook: string, transcript: string): Promise<ScoreResult> {
  return withRetries(async () => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You score short-form video clips for viral potential.'
        },
        {
          role: 'user',
          content: `Given the transcript segment, the first-3-second hook text, and context title, return a JSON object with:
category in [Education, Motivation, Humor, Commentary, Tech, Lifestyle, News, Finance, Health, Sports, Gaming, Other]
tags as an array of 3–7 short tags
scores as integers: hook_strength 0–10, retention_likelihood 0–10, clarity 0–10, shareability 0–10, overall 0–100
rationale as one sentence
Ensure the hook is compelling for a cold audience.

input:
title: ${title}
hook: ${hook}
transcript: ${transcript}

JSON only.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
    
    const content = response.choices[0].message.content || '{}'
    return JSON.parse(content) as ScoreResult
  })
}
