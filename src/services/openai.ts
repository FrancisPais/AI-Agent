import OpenAI from 'openai'
import { createReadStream, statSync } from 'fs'
import { splitAudioIntoChunks } from './ffmpeg'

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

const MAX_FILE_SIZE = 20 * 1024 * 1024

async function transcribeAudioFile(audioPath: string, timeOffset: number = 0): Promise<TranscriptWord[]> {
  const response = await openai.audio.transcriptions.create({
    file: createReadStream(audioPath),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word']
  })

  const words: TranscriptWord[] = []
  
  if (response.words) {
    for (const word of response.words) {
      words.push({
        word: word.word,
        start: word.start + timeOffset,
        end: word.end + timeOffset
      })
    }
  }
  
  return words
}

export async function transcribeAudio(audioPath: string): Promise<TranscriptSegment[]> {
  const fileSize = statSync(audioPath).size
  let allWords: TranscriptWord[] = []
  
  if (fileSize > MAX_FILE_SIZE) {
    console.log(`Audio file is ${(fileSize / 1024 / 1024).toFixed(1)}MB, splitting into chunks...`)
    const chunkDuration = 600
    const chunks = await splitAudioIntoChunks(audioPath, chunkDuration)
    
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Transcribing chunk ${i + 1}/${chunks.length}`)
      const chunkWords = await transcribeAudioFile(chunks[i], i * chunkDuration)
      allWords = allWords.concat(chunkWords)
    }
  } else {
    allWords = await transcribeAudioFile(audioPath)
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
}
