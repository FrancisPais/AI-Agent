import OpenAI from 'openai'
import { createReadStream } from 'fs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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

export async function transcribeAudio(audioPath: string): Promise<TranscriptSegment[]> {
  const response = await openai.audio.transcriptions.create({
    file: createReadStream(audioPath),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word']
  })

  const segments: TranscriptSegment[] = []
  
  if (response.words)
  {
    let currentSegment: TranscriptWord[] = []
    let segmentStart = 0
    let segmentText = ''
    
    for (let i = 0; i < response.words.length; i++)
    {
      const word = response.words[i]
      
      if (currentSegment.length === 0)
      {
        segmentStart = word.start
      }
      
      currentSegment.push({
        word: word.word,
        start: word.start,
        end: word.end
      })
      
      segmentText += word.word + ' '
      
      if (i < response.words.length - 1)
      {
        const gap = response.words[i + 1].start - word.end
        
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
