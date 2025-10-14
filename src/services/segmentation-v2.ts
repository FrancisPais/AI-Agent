import { TranscriptSegment, TranscriptWord } from './openai'
import { SceneChange } from './ffmpeg'
import { Chapter } from './youtube'

export interface EnhancedSegment {
  startSec: number
  endSec: number
  durationSec: number
  words: TranscriptWord[]
  text: string
  hook: string
  score: number
  features: SegmentFeatures
  rationaleShort: string
  durationChoice: 'short30' | 'mid45' | 'long60'
  chapterTitle?: string
}

export interface SegmentFeatures {
  hookScore: number
  retentionScore: number
  clarityScore: number
  visualScore: number
  noveltyScore: number
  engagementScore: number
  safetyScore: number
  speechRate: number
  pauseDensity: number
  energyLevel: number
  hasQuestion: boolean
  hasBoldClaim: boolean
  hasNumbers: boolean
  sceneChangeCount: number
  wordCount: number
}

export interface CommentHotspot {
  timeSec: number
  density: number
}

export function mineTimestampsFromComments(comments: { text: string }[]): number[] {
  const tsRe = /(?<!\d)(\d{1,2}):(\d{2})(?::(\d{2}))?(?!\d)/g
  const marks: number[] = []
  
  for (const c of comments) {
    const matches = c.text.matchAll(tsRe)
    for (const m of matches) {
      const h = m[3] ? parseInt(m[1], 10) : 0
      const mm = m[3] ? parseInt(m[2], 10) : parseInt(m[1], 10)
      const ss = m[3] ? parseInt(m[3], 10) : parseInt(m[2], 10)
      const sec = h * 3600 + mm * 60 + ss
      marks.push(sec)
    }
  }
  
  return clusterPeaks(marks, 30)
}

function clusterPeaks(xs: number[], windowSec: number): number[] {
  if (xs.length === 0)
  {
    return []
  }
  
  const s = [...xs].sort((a, b) => a - b)
  const peaks: number[] = []
  let acc: number[] = []
  
  for (const x of s) {
    if (acc.length === 0) {
      acc.push(x)
    } else {
      const last = acc[acc.length - 1]
      if (x - last <= windowSec) {
        acc.push(x)
      } else {
        peaks.push(median(acc))
        acc = [x]
      }
    }
  }
  
  if (acc.length > 0) {
    peaks.push(median(acc))
  }
  
  return peaks
}

function median(xs: number[]): number {
  if (xs.length === 0)
  {
    return 0
  }
  
  const sorted = [...xs].sort((a, b) => a - b)
  const m = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[m] : Math.floor((sorted[m - 1] + sorted[m]) / 2)
}

export function generateChapterWindows(chapters: Chapter[], introIdx: number | null): Array<{ start: number; end: number; chapterTitle: string }> {
  const ws: Array<{ start: number; end: number; chapterTitle: string }> = []
  
  for (let i = 0; i < chapters.length; i++) {
    if (introIdx !== null && i === introIdx) {
      continue
    }
    
    const c = chapters[i]
    const span = c.endSec - c.startSec
    const step = Math.max(45, Math.floor(span * 0.1))
    let t = c.startSec
    
    while (t + 25 <= c.endSec) {
      ws.push({ 
        start: t, 
        end: Math.min(c.endSec, t + 75),
        chapterTitle: c.title
      })
      t += step
    }
  }
  
  return ws
}

function detectHookPatterns(text: string): { hasQuestion: boolean; hasBoldClaim: boolean; hasNumbers: boolean } {
  const hasQuestion = /^(how|what|why|when|where|who|can|will|should|is|are|do|does|did)\s/i.test(text) || /\?/.test(text)
  
  const boldClaimPatterns = [
    /^(this is|here's|the best|the worst|never|always|you need|you must|don't|stop)/i,
    /^(secret|truth|fact|proven|guaranteed|ultimate|perfect)/i,
    /(vs\.|versus|vs|compared to)/i,
    /^(shocking|amazing|incredible|unbelievable)/i
  ]
  
  const hasBoldClaim = boldClaimPatterns.some(p => p.test(text))
  const hasNumbers = /\b\d+\b/.test(text)
  
  return { hasQuestion, hasBoldClaim, hasNumbers }
}

function analyzeSpeechDynamics(words: TranscriptWord[], startSec: number): { rate: number; pauseDensity: number; energy: number } {
  if (words.length === 0)
  {
    return { rate: 0, pauseDensity: 1, energy: 0 }
  }
  
  const first5sWords = words.filter(w => w.start - startSec < 5)
  
  if (first5sWords.length === 0)
  {
    return { rate: 0, pauseDensity: 1, energy: 0 }
  }
  
  const duration = Math.max(0.1, first5sWords[first5sWords.length - 1].end - first5sWords[0].start)
  const rate = first5sWords.length / duration
  
  let totalGap = 0
  for (let i = 0; i < first5sWords.length - 1; i++) {
    totalGap += Math.max(0, first5sWords[i + 1].start - first5sWords[i].end)
  }
  const pauseDensity = totalGap / duration
  
  const energyWords = first5sWords.filter(w => 
    /[A-Z]{2,}/.test(w.word) || /[!?]/.test(w.word) || w.word.length > 8
  ).length
  const energy = energyWords / first5sWords.length
  
  return { rate, pauseDensity, energy }
}

function calculateSegmentFeatures(
  words: TranscriptWord[], 
  startSec: number, 
  endSec: number,
  sceneChanges: SceneChange[],
  hotspots: number[]
): SegmentFeatures {
  const text = words.map(w => w.word).join(' ')
  const hook = words.filter(w => w.start - startSec < 3).map(w => w.word).join(' ').trim()
  
  const { hasQuestion, hasBoldClaim, hasNumbers } = detectHookPatterns(hook || text.substring(0, 100))
  const dynamics = analyzeSpeechDynamics(words, startSec)
  
  const sceneChangesInSegment = sceneChanges.filter(s => s.timeSec >= startSec && s.timeSec <= endSec).length
  
  let hookScore = 0.5
  if (hasQuestion) hookScore += 0.2
  if (hasBoldClaim) hookScore += 0.2
  if (hasNumbers) hookScore += 0.1
  if (dynamics.energy > 0.3) hookScore += 0.15
  if (dynamics.rate > 2.5) hookScore += 0.1
  hookScore = Math.min(1, hookScore)
  
  let retentionScore = 0.5
  if (dynamics.rate > 2) retentionScore += 0.2
  if (dynamics.pauseDensity < 0.2) retentionScore += 0.15
  if (sceneChangesInSegment >= 2 && sceneChangesInSegment <= 4) retentionScore += 0.15
  retentionScore = Math.min(1, retentionScore)
  
  const fillerWords = words.filter(w => /^(um|uh|like|you know|sort of|kind of)$/i.test(w.word.trim())).length
  const clarityScore = Math.max(0, 1 - (fillerWords / Math.max(1, words.length)) * 2)
  
  const visualScore = sceneChangesInSegment >= 1 && sceneChangesInSegment <= 6 ? 0.8 : 0.5
  
  const noveltyScore = 0.6
  
  const nearHotspot = hotspots.some(h => Math.abs(h - startSec) < 30)
  const engagementScore = nearHotspot ? 0.8 : 0.4
  
  const profanityPattern = /\b(fuck|shit|damn|hell|ass|bitch)\b/i
  const safetyScore = profanityPattern.test(text) ? 0.3 : 0.9
  
  return {
    hookScore,
    retentionScore,
    clarityScore,
    visualScore,
    noveltyScore,
    engagementScore,
    safetyScore,
    speechRate: dynamics.rate,
    pauseDensity: dynamics.pauseDensity,
    energyLevel: dynamics.energy,
    hasQuestion,
    hasBoldClaim,
    hasNumbers,
    sceneChangeCount: sceneChangesInSegment,
    wordCount: words.length
  }
}

function scoreSegment(features: SegmentFeatures): number {
  return (
    0.28 * features.hookScore +
    0.18 * features.retentionScore +
    0.16 * features.clarityScore +
    0.12 * features.visualScore +
    0.10 * features.noveltyScore +
    0.10 * features.engagementScore +
    0.06 * features.safetyScore
  )
}

function chooseDuration(features: SegmentFeatures, candidateDuration: number): { targetDuration: number; choice: 'short30' | 'mid45' | 'long60' } {
  let prefer = 30
  let choice: 'short30' | 'mid45' | 'long60' = 'short30'
  
  if (features.retentionScore > 0.7 && features.hookScore > 0.6) {
    prefer = 45
    choice = 'mid45'
  }
  
  if (features.hookScore > 0.8 && features.retentionScore > 0.8) {
    prefer = 60
    choice = 'long60'
  }
  
  if (features.engagementScore > 0.75 && features.hookScore > 0.7) {
    prefer = 60
    choice = 'long60'
  }
  
  if (features.clarityScore < 0.5) {
    prefer = Math.min(prefer, 35)
  }
  
  const target = Math.min(Math.max(20, prefer), candidateDuration)
  
  return { targetDuration: target, choice }
}

function generateRationale(features: SegmentFeatures, score: number): string {
  const reasons: Array<{ text: string; value: number }> = []
  
  if (features.hookScore > 0.7) {
    reasons.push({ text: 'strong hook', value: features.hookScore })
  }
  if (features.retentionScore > 0.7) {
    reasons.push({ text: 'high retention potential', value: features.retentionScore })
  }
  if (features.clarityScore > 0.8) {
    reasons.push({ text: 'clear message', value: features.clarityScore })
  }
  if (features.engagementScore > 0.7) {
    reasons.push({ text: 'audience engagement hotspot', value: features.engagementScore })
  }
  if (features.hasQuestion) {
    reasons.push({ text: 'question hook', value: 0.8 })
  }
  if (features.hasBoldClaim) {
    reasons.push({ text: 'bold claim', value: 0.75 })
  }
  if (features.sceneChangeCount >= 2 && features.sceneChangeCount <= 4) {
    reasons.push({ text: 'good visual pacing', value: 0.7 })
  }
  
  const top3 = reasons.sort((a, b) => b.value - a.value).slice(0, 3).map(r => r.text)
  
  if (top3.length === 0)
  {
    return `Segment scored ${(score * 100).toFixed(0)}/100`
  }
  
  return `Strong because: ${top3.join(', ')}`
}

export function detectEnhancedSegments(
  transcript: TranscriptSegment[],
  sceneChanges: SceneChange[],
  chapters: Chapter[],
  videoDuration: number,
  commentHotspots: number[] = []
): EnhancedSegment[] {
  const allWords: TranscriptWord[] = []
  
  for (const segment of transcript) {
    for (const word of segment.words) {
      allWords.push(word)
    }
  }
  
  if (allWords.length === 0) {
    return []
  }
  
  const detectedLanguage = transcript[0]?.language
  const introIdx = findIntroChapterIndex(chapters, detectedLanguage)
  
  const windows = chapters.length > 0 
    ? generateChapterWindows(chapters, introIdx)
    : [{ start: 180, end: videoDuration || allWords[allWords.length - 1].end, chapterTitle: 'Main Content' }]
  
  const candidates: EnhancedSegment[] = []
  
  for (const window of windows) {
    const windowWords = allWords.filter(w => w.start >= window.start && w.start < window.end)
    
    if (windowWords.length < 10)
    {
      continue
    }
    
    const pauseBoundaries: number[] = [0]
    
    for (let i = 0; i < windowWords.length - 1; i++) {
      const gap = windowWords[i + 1].start - windowWords[i].end
      
      if (gap >= 0.35 && gap <= 1.2) {
        pauseBoundaries.push(i + 1)
      }
    }
    
    pauseBoundaries.push(windowWords.length)
    
    for (let i = 0; i < pauseBoundaries.length - 1; i++) {
      for (let j = i + 1; j < pauseBoundaries.length; j++) {
        const segWords = windowWords.slice(pauseBoundaries[i], pauseBoundaries[j])
        
        if (segWords.length < 8)
        {
          continue
        }
        
        const startSec = segWords[0].start
        const endSec = segWords[segWords.length - 1].end
        const duration = endSec - startSec
        
        if (duration < 20 || duration > 75)
        {
          continue
        }
        
        const features = calculateSegmentFeatures(segWords, startSec, endSec, sceneChanges, commentHotspots)
        const score = scoreSegment(features)
        
        if (score < 0.5)
        {
          continue
        }
        
        const { targetDuration, choice } = chooseDuration(features, duration)
        const adjustedEndSec = Math.min(endSec, startSec + targetDuration)
        const adjustedWords = segWords.filter(w => w.end <= adjustedEndSec)
        
        if (adjustedWords.length < 8)
        {
          continue
        }
        
        const text = adjustedWords.map(w => w.word).join(' ')
        const hook = adjustedWords.filter(w => w.start - startSec < 3).map(w => w.word).join(' ').trim()
        const rationale = generateRationale(features, score)
        
        candidates.push({
          startSec,
          endSec: adjustedEndSec,
          durationSec: adjustedEndSec - startSec,
          words: adjustedWords,
          text,
          hook: hook || text.substring(0, 50),
          score,
          features,
          rationaleShort: rationale,
          durationChoice: choice,
          chapterTitle: window.chapterTitle
        })
      }
    }
  }
  
  const qualityFiltered = applyQualityGuards(candidates)
  const diversified = applyDiversityFilter(qualityFiltered, 0.7)
  const nonOverlapping = removeOverlaps(diversified)
  
  return nonOverlapping.slice(0, 12)
}

function findIntroChapterIndex(chapters: Chapter[], detectedLanguage?: string): number | null {
  if (chapters.length === 0)
  {
    return null
  }
  
  const introKeywords: Record<string, string[]> = {
    'en': ['intro', 'introduction', 'opening', 'welcome'],
    'es': ['intro', 'introduccion', 'introducción', 'apertura', 'inicio'],
    'pt': ['intro', 'introducao', 'introdução', 'apresentação', 'abertura'],
    'fr': ['intro', 'introduction', 'ouverture'],
    'de': ['intro', 'einführung', 'einleitung'],
  }
  
  const keywordsToCheck = detectedLanguage && introKeywords[detectedLanguage] 
    ? introKeywords[detectedLanguage] 
    : Object.values(introKeywords).flat()
  
  const firstTitle = chapters[0].title.toLowerCase()
  
  for (const kw of keywordsToCheck) {
    if (firstTitle.includes(kw))
    {
      return 0
    }
  }
  
  return null
}

function applyQualityGuards(segments: EnhancedSegment[]): EnhancedSegment[] {
  return segments.filter(seg => {
    const first3sWords = seg.words.filter(w => w.start - seg.startSec < 3)
    
    if (first3sWords.length < 3)
    {
      return false
    }
    
    if (seg.features.safetyScore < 0.5)
    {
      return false
    }
    
    if (seg.features.clarityScore < 0.3)
    {
      return false
    }
    
    return true
  })
}

function applyDiversityFilter(segments: EnhancedSegment[], threshold: number): EnhancedSegment[] {
  if (segments.length === 0)
  {
    return []
  }
  
  const sorted = [...segments].sort((a, b) => b.score - a.score)
  const selected: EnhancedSegment[] = [sorted[0]]
  
  for (let i = 1; i < sorted.length; i++) {
    let tooSimilar = false
    
    for (const existing of selected) {
      const similarity = textSimilarity(sorted[i].text, existing.text)
      
      if (similarity > threshold) {
        tooSimilar = true
        break
      }
    }
    
    if (!tooSimilar) {
      selected.push(sorted[i])
    }
  }
  
  return selected
}

function textSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/))
  const wordsB = new Set(b.toLowerCase().split(/\s+/))
  
  let intersection = 0
  for (const word of wordsA) {
    if (wordsB.has(word)) {
      intersection++
    }
  }
  
  const union = wordsA.size + wordsB.size - intersection
  
  if (union === 0)
  {
    return 0
  }
  
  return intersection / union
}

function hasOverlap(seg1: EnhancedSegment, seg2: EnhancedSegment): boolean {
  return !(seg1.endSec <= seg2.startSec || seg2.endSec <= seg1.startSec)
}

function removeOverlaps(segments: EnhancedSegment[]): EnhancedSegment[] {
  if (segments.length === 0)
  {
    return []
  }
  
  const sorted = [...segments].sort((a, b) => b.score - a.score)
  const selected: EnhancedSegment[] = []
  
  for (const segment of sorted) {
    let overlaps = false
    
    for (const existing of selected) {
      if (hasOverlap(segment, existing)) {
        overlaps = true
        break
      }
    }
    
    if (!overlaps) {
      selected.push(segment)
    }
  }
  
  return selected.sort((a, b) => a.startSec - b.startSec)
}
