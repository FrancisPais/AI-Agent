import { TranscriptSegment, TranscriptWord } from './openai'
import { SceneChange } from './ffmpeg'

export interface Segment {
  startSec: number
  endSec: number
  durationSec: number
  words: TranscriptWord[]
  text: string
  hook: string
  score: number
}

export function detectSegments(transcript: TranscriptSegment[], sceneChanges: SceneChange[]): Segment[] {
  const allWords: TranscriptWord[] = []
  
  for (const segment of transcript)
  {
    for (const word of segment.words)
    {
      allWords.push(word)
    }
  }
  
  if (allWords.length === 0)
  {
    return []
  }
  
  const pauseBoundaries: number[] = []
  
  for (let i = 0; i < allWords.length - 1; i++)
  {
    const gap = allWords[i + 1].start - allWords[i].end
    
    if (gap >= 0.35 && gap <= 0.9)
    {
      pauseBoundaries.push(i + 1)
    }
  }
  
  const candidates: Segment[] = []
  
  for (let i = 0; i < pauseBoundaries.length; i++)
  {
    const startIdx = pauseBoundaries[i]
    
    for (let j = i + 1; j < pauseBoundaries.length; j++)
    {
      const endIdx = pauseBoundaries[j]
      const segmentWords = allWords.slice(startIdx, endIdx)
      
      if (segmentWords.length === 0)
      {
        continue
      }
      
      const startSec = segmentWords[0].start
      const endSec = segmentWords[segmentWords.length - 1].end
      const duration = endSec - startSec
      
      if (duration >= 20 && duration <= 60)
      {
        const speechDuration = segmentWords.reduce((sum, w) => sum + (w.end - w.start), 0)
        
        if (speechDuration >= 8)
        {
          const text = segmentWords.map(w => w.word).join(' ')
          const hookWords = segmentWords.filter(w => w.start - startSec < 3)
          const hook = hookWords.map(w => w.word).join(' ').trim()
          
          const wordsPerSec = segmentWords.length / duration
          const pauseDensity = (duration - speechDuration) / duration
          const highEnergyWords = segmentWords.filter(w => 
            w.word.length > 6 || /[!?]/.test(w.word)
          ).length
          
          const sceneChangesInSegment = sceneChanges.filter(scene => 
            scene.time >= startSec && scene.time <= endSec
          ).length
          
          const startsNearScene = sceneChanges.some(scene =>
            Math.abs(scene.time - startSec) <= 1.0
          )
          
          const endsNearScene = sceneChanges.some(scene =>
            Math.abs(scene.time - endSec) <= 1.0
          )
          
          let sceneBonus = 0
          
          if (startsNearScene)
          {
            sceneBonus += 5
          }
          
          if (endsNearScene)
          {
            sceneBonus += 5
          }
          
          if (sceneChangesInSegment > 2)
          {
            sceneBonus += sceneChangesInSegment * 2
          }
          
          const score = wordsPerSec * 10 + pauseDensity * 5 + highEnergyWords + sceneBonus
          
          candidates.push({
            startSec,
            endSec,
            durationSec: duration,
            words: segmentWords,
            text,
            hook: hook || text.substring(0, 50),
            score
          })
        }
      }
    }
  }
  
  candidates.sort((a, b) => b.score - a.score)
  
  const preferredCandidates = candidates.filter(c => c.durationSec >= 25 && c.durationSec <= 45)
  
  if (preferredCandidates.length > 0)
  {
    return preferredCandidates.slice(0, 12)
  }
  
  return candidates.slice(0, 12)
}
