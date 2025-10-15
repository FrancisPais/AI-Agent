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
  coherenceScore: number
  closureScore: number
  arcScore: number
  semanticDensity: number
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
    const span = Math.max(0, c.endSec - c.startSec)
    const step = Math.max(40, Math.floor(span * 0.12))
    let t = c.startSec
    const chapterWindows: Array<{ start: number; end: number; chapterTitle: string }> = []

    while (t + 25 <= c.endSec) {
      const end = Math.min(c.endSec, t + 82)
      chapterWindows.push({
        start: t,
        end,
        chapterTitle: c.title
      })
      t += step
    }

    if (chapterWindows.length === 0) {
      chapterWindows.push({
        start: c.startSec,
        end: Math.min(c.endSec, c.startSec + Math.min(82, span || 82)),
        chapterTitle: c.title
      })
    } else {
      const last = chapterWindows[chapterWindows.length - 1]
      if (last.end < c.endSec - 8) {
        const tailStart = Math.max(c.startSec, c.endSec - 82)
        if (chapterWindows[chapterWindows.length - 1].start !== tailStart) {
          chapterWindows.push({
            start: tailStart,
            end: c.endSec,
            chapterTitle: c.title
          })
        }
      }
    }

    ws.push(...chapterWindows)
  }

  return ws
}

function generateFullCoverageWindows(
  allWords: TranscriptWord[],
  videoDuration: number
): Array<{ start: number; end: number; chapterTitle: string }> {
  const lastWordEnd = allWords.length > 0 ? allWords[allWords.length - 1].end : 0
  const coverageEnd = Math.max(videoDuration, lastWordEnd)

  if (coverageEnd <= 0) {
    return []
  }

  const windows: Array<{ start: number; end: number; chapterTitle: string }> = []
  const stride = coverageEnd > 1200 ? 75 : 55
  const windowLength = coverageEnd > 900 ? 95 : 82

  for (let start = 0; start < coverageEnd; start += stride) {
    const end = Math.min(coverageEnd, start + windowLength)
    windows.push({ start, end, chapterTitle: 'Full Video' })
  }

  if (windows.length === 0) {
    windows.push({ start: 0, end: coverageEnd, chapterTitle: 'Full Video' })
  } else {
    const last = windows[windows.length - 1]
    if (last.end < coverageEnd - 5) {
      const tailStart = Math.max(0, coverageEnd - windowLength)
      if (windows[windows.length - 1].start !== tailStart) {
        windows.push({ start: tailStart, end: coverageEnd, chapterTitle: 'Full Video' })
      } else {
        windows[windows.length - 1] = { start: tailStart, end: coverageEnd, chapterTitle: 'Full Video' }
      }
    }
  }

  return windows
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

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't", 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'could', "couldn't",
  'did', "didn't", 'do', 'does', "doesn't", 'doing', "don't", 'down', 'during',
  'each', 'few', 'for', 'from', 'further',
  'had', "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's",
  'hers', 'herself', 'him', 'himself', 'his', 'how', "how's",
  'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself',
  "let's",
  'me', 'more', 'most', "mustn't", 'my', 'myself',
  'no', 'nor', 'not',
  'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
  'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so', 'some', 'such',
  'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', "there's", 'these', 'they',
  "they'd", "they'll", "they're", "they've", 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up',
  'very',
  'was', "wasn't", 'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where',
  "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would', "wouldn't",
  'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves'
])

function calculateSegmentFeatures(
  words: TranscriptWord[],
  startSec: number,
  endSec: number,
  sceneChanges: SceneChange[],
  hotspots: number[]
): SegmentFeatures {
  const text = words.map(w => w.word).join(' ')
  const hook = words.filter(w => w.start - startSec < 3).map(w => w.word).join(' ').trim()

  const lowerWords = words.map(w => w.word.toLowerCase())
  const cleanedWords = lowerWords.map(w => w.replace(/[^a-z0-9']/gi, ''))
  const contentWords = cleanedWords.filter(w => w.length > 2 && !STOP_WORDS.has(w))
  const semanticDensity = Math.min(1, contentWords.length / Math.max(1, words.length))

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
  const fillerRatio = fillerWords / Math.max(1, words.length)
  const clarityScore = Math.max(0, 1 - fillerRatio * 2)

  const visualScore = sceneChangesInSegment >= 1 && sceneChangesInSegment <= 6 ? 0.8 : 0.5

  const noveltyScore = 0.6

  const nearHotspot = hotspots.some(h => Math.abs(h - startSec) < 30)
  const engagementScore = nearHotspot ? 0.8 : 0.4

  const profanityPattern = /\b(fuck|shit|damn|hell|ass|bitch)\b/i
  const safetyScore = profanityPattern.test(text) ? 0.3 : 0.9

  const sentenceEnders = text.match(/[.!?]/g)?.length ?? 0
  const sentences = Math.max(1, sentenceEnders || Math.ceil((endSec - startSec) / 7))
  const avgWordsPerSentence = words.length / sentences

  let coherenceScore = 0.55
  if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 28) {
    coherenceScore += 0.2
  }
  if (semanticDensity > 0.55) {
    coherenceScore += 0.15
  }
  if (fillerRatio < 0.12) {
    coherenceScore += 0.1
  }
  if (clarityScore > 0.75) {
    coherenceScore += 0.05
  }
  coherenceScore = Math.min(1, Math.max(0.3, coherenceScore))

  const closingWindow = words.filter(w => endSec - w.end < 4)
  const closingText = closingWindow.map(w => w.word.toLowerCase()).join(' ')
  const lastWord = closingWindow[closingWindow.length - 1]?.word ?? words[words.length - 1]?.word ?? ''
  const hasHardStop = /[.!?…]$/.test(lastWord?.trim?.() || '')
  const closurePhrases = ['that\'s why', 'so you can', 'and that\'s', 'that\'s how', 'in the end', 'the point is']
  const trailingFiller = /(um|uh|like)$/i.test(lastWord?.trim?.() || '')

  let closureScore = 0.45
  if (hasHardStop) {
    closureScore += 0.25
  }
  if (closurePhrases.some(p => closingText.includes(p))) {
    closureScore += 0.15
  }
  if (closingWindow.length > 0 && closingWindow.some(w => /\bso\b|\btherefore\b|\bmeaning\b/i.test(w.word))) {
    closureScore += 0.1
  }
  if (trailingFiller) {
    closureScore -= 0.15
  }
  closureScore = Math.min(1, Math.max(0.2, closureScore))

  const resolutionKeywords = ['because', 'so', "that\'s why", "that means", "which means", 'therefore', 'result', 'here\'s']
  const payoffKeywords = ['so you can', 'that\'s how', 'in the end', 'the reason', 'the secret', 'so the', 'what happens']
  const lowerText = text.toLowerCase()
  const hasResolutionKeyword = resolutionKeywords.some(kw => lowerText.includes(kw))
  const hasPayoff = payoffKeywords.some(kw => lowerText.includes(kw))
  const earlyQuestion = words.filter(w => w.start - startSec < 6).some(w => /\?$/.test(w.word) || /^(how|why|what|when|where|who|can|should|would)\b/i.test(w.word))

  let arcScore = 0.45
  if (hasQuestion || earlyQuestion) {
    arcScore += 0.2
  }
  if (hasResolutionKeyword) {
    arcScore += 0.2
  }
  if (hasPayoff) {
    arcScore += 0.1
  }
  if (closureScore > 0.7) {
    arcScore += 0.05
  }
  arcScore = Math.min(1, Math.max(0.25, arcScore))

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
    wordCount: words.length,
    coherenceScore,
    closureScore,
    arcScore,
    semanticDensity
  }
}

function scoreSegment(features: SegmentFeatures): number {
  return (
    0.24 * features.hookScore +
    0.18 * features.retentionScore +
    0.12 * features.clarityScore +
    0.10 * features.coherenceScore +
    0.10 * features.closureScore +
    0.08 * features.arcScore +
    0.08 * features.engagementScore +
    0.05 * features.noveltyScore +
    0.03 * features.visualScore +
    0.02 * features.safetyScore
  )
}

function chooseDuration(
  features: SegmentFeatures,
  candidateDuration: number
): { targetDuration: number; choice: 'short30' | 'mid45' | 'long60' } {
  let prefer = Math.min(80, Math.max(24, Math.round(candidateDuration / 5) * 5))
  let choice: 'short30' | 'mid45' | 'long60' = 'short30'

  const longFormSignals =
    (features.retentionScore + features.closureScore + features.arcScore) / 3 > 0.66 &&
    features.coherenceScore > 0.63 &&
    features.semanticDensity > 0.55

  if (candidateDuration >= 65 && longFormSignals) {
    prefer = Math.min(candidateDuration, 80)
    choice = 'long60'
  } else if (
    candidateDuration >= 45 &&
    (features.retentionScore > 0.62 || features.arcScore > 0.6) &&
    features.clarityScore > 0.55
  ) {
    prefer = Math.min(55, candidateDuration)
    choice = 'mid45'
  } else if (features.coherenceScore < 0.55 || features.closureScore < 0.5) {
    prefer = Math.min(32, Math.max(24, candidateDuration - 3))
    choice = 'short30'
  } else if (features.engagementScore > 0.7 && candidateDuration > 40) {
    prefer = Math.min(50, candidateDuration)
    choice = 'mid45'
  }

  const minDuration = features.clarityScore > 0.7 && features.coherenceScore > 0.65 ? 28 : 20
  const target = Math.max(minDuration, Math.min(prefer, candidateDuration))

  if (target >= 70) {
    choice = 'long60'
  } else if (target >= 42 && choice === 'short30') {
    choice = 'mid45'
  }

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
  if (features.coherenceScore > 0.7) {
    reasons.push({ text: 'coherent storytelling', value: features.coherenceScore })
  }
  if (features.closureScore > 0.65) {
    reasons.push({ text: 'satisfying payoff', value: features.closureScore })
  }
  if (features.arcScore > 0.65) {
    reasons.push({ text: 'clear question→answer arc', value: features.arcScore })
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

function adjustSegmentToNarrativeBoundary(
  words: TranscriptWord[],
  startSec: number,
  hardEndSec: number,
  targetDuration: number
): { words: TranscriptWord[]; endSec: number } {
  if (words.length === 0) {
    return { words, endSec: startSec }
  }

  const maxEnd = Math.min(hardEndSec, startSec + 82)
  const minEnd = Math.min(maxEnd, startSec + Math.max(18, targetDuration - 4))
  const desiredEnd = Math.min(maxEnd, startSec + targetDuration)
  const searchEnd = Math.min(maxEnd, startSec + targetDuration + 6)

  let cutoffIndex = words.findIndex(w => w.end >= desiredEnd)
  if (cutoffIndex === -1) {
    cutoffIndex = words.length - 1
  }

  let chosenIndex = cutoffIndex

  for (let i = cutoffIndex; i < words.length; i++) {
    const w = words[i]
    if (w.end > searchEnd) {
      break
    }
    const trimmed = w.word.trim()
    if (/[.!?…]$/.test(trimmed) || /--$/.test(trimmed)) {
      chosenIndex = i
      break
    }
    const next = words[i + 1]
    if (next) {
      const gap = next.start - w.end
      if (gap >= 0.8 && w.end >= minEnd) {
        chosenIndex = i
        break
      }
    }
  }

  if (words[chosenIndex].end - startSec < 18 && words[words.length - 1].end - startSec >= 18) {
    while (chosenIndex < words.length - 1 && words[chosenIndex].end - startSec < 18) {
      chosenIndex += 1
    }
  }

  const endSec = Math.min(maxEnd, words[chosenIndex].end)
  const adjustedWords = words.filter(w => w.end <= endSec + 1e-3)

  return { words: adjustedWords, endSec }
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
  
  let windows = chapters.length > 0
    ? generateChapterWindows(chapters, introIdx)
    : generateFullCoverageWindows(allWords, videoDuration)

  if (chapters.length > 0) {
    const fallbackWindows = generateFullCoverageWindows(allWords, videoDuration)
    const maxExistingEnd = windows.reduce((max, w) => Math.max(max, w.end), 0)
    const coverageEnd = fallbackWindows.length > 0 ? fallbackWindows[fallbackWindows.length - 1].end : maxExistingEnd

    if (coverageEnd > maxExistingEnd + 5) {
      windows = windows.concat(
        fallbackWindows.filter(w => w.start >= maxExistingEnd - 60)
      )
    }
  }

  windows = windows
    .sort((a, b) => a.start - b.start)
    .filter((w, idx, arr) => idx === 0 || w.start !== arr[idx - 1].start || w.end !== arr[idx - 1].end)
  
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

        if (duration < 20 || duration > 82)
        {
          continue
        }
        
        const initialFeatures = calculateSegmentFeatures(segWords, startSec, endSec, sceneChanges, commentHotspots)
        const initialScore = scoreSegment(initialFeatures)

        if (initialScore < 0.5)
        {
          continue
        }

        const { targetDuration, choice } = chooseDuration(initialFeatures, duration)
        const { words: adjustedWords, endSec: adjustedEndSec } = adjustSegmentToNarrativeBoundary(
          segWords,
          startSec,
          endSec,
          targetDuration
        )

        if (adjustedWords.length < 8)
        {
          continue
        }

        const finalFeatures = calculateSegmentFeatures(adjustedWords, startSec, adjustedEndSec, sceneChanges, commentHotspots)
        const finalScore = scoreSegment(finalFeatures)

        if (finalScore < 0.52)
        {
          continue
        }

        const text = adjustedWords.map(w => w.word).join(' ')
        const hook = adjustedWords.filter(w => w.start - startSec < 3).map(w => w.word).join(' ').trim()
        const rationale = generateRationale(finalFeatures, finalScore)

        candidates.push({
          startSec,
          endSec: adjustedEndSec,
          durationSec: adjustedEndSec - startSec,
          words: adjustedWords,
          text,
          hook: hook || text.substring(0, 50),
          score: finalScore,
          features: finalFeatures,
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

    if (seg.features.coherenceScore < 0.45)
    {
      return false
    }

    if (seg.features.closureScore < 0.4)
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
