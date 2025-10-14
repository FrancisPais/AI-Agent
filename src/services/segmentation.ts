import { TranscriptSegment, TranscriptWord } from './openai'
import { SceneChange } from './ffmpeg'
import { Chapter } from './youtube'

function isIntroChapter(title: string, detectedLanguage?: string): boolean {
  const titleLower = title.toLowerCase().trim()
  
  const introKeywords: Record<string, string[]> = {
    'en': ['intro', 'introduction', 'opening', 'welcome', 'trailer', 'credits'],
    'es': ['intro', 'introduccion', 'introducción', 'apertura', 'inicio', 'inicio del video', 'inicio del vídeo', 'bienvenida'],
    'pt': ['intro', 'introducao', 'introduçao', 'introdução', 'apresentacao', 'apresentação', 'abertura', 'boas-vindas'],
    'fr': ['intro', 'introduction', 'ouverture', 'bienvenue'],
    'de': ['intro', 'einführung', 'einleitung', 'eröffnung', 'willkommen'],
    'it': ['intro', 'introduzione', 'apertura', 'benvenuto'],
    'ja': ['イントロ', '紹介', 'オープニング'],
    'ko': ['인트로', '소개', '오프닝'],
    'zh': ['介绍', '简介', '开场'],
    'ru': ['вступление', 'введение', 'открытие']
  }
  
  let keywordsToCheck = introKeywords['en'] || []
  
  if (detectedLanguage && introKeywords[detectedLanguage])
  {
    keywordsToCheck = [...introKeywords[detectedLanguage], ...introKeywords['en']]
  }
  else {
    keywordsToCheck = Object.values(introKeywords).flat()
  }
  
  for (const keyword of keywordsToCheck)
  {
    if (titleLower.includes(keyword))
    {
      return true
    }
  }
  
  if (titleLower.length < 20 && (titleLower.match(/^(chapter|capítulo|part|parte|section|secção|seção|episode|episódio)\s*[0-9]+/)))
  {
    return false
  }
  
  return false
}

export interface Segment {
  startSec: number
  endSec: number
  durationSec: number
  words: TranscriptWord[]
  text: string
  hook: string
  score: number
  chapterTitle?: string
}

function hasOverlap(seg1: Segment, seg2: Segment): boolean {
  return !(seg1.endSec <= seg2.startSec || seg2.endSec <= seg1.startSec)
}

function removeOverlaps(segments: Segment[]): Segment[] {
  if (segments.length === 0) return []
  
  const sorted = [...segments].sort((a, b) => b.score - a.score)
  const selected: Segment[] = []
  
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

export function detectSegments(
  transcript: TranscriptSegment[], 
  sceneChanges: SceneChange[], 
  chapters: Chapter[] = [], 
  videoDuration: number = 0
): Segment[] {
  const allWords: TranscriptWord[] = []
  
  for (const segment of transcript) {
    for (const word of segment.words) {
      allWords.push(word)
    }
  }
  
  if (allWords.length === 0) {
    return []
  }
  
  let chaptersToAnalyze: Chapter[] = []
  const detectedLanguage = transcript[0]?.language
  
  if (chapters.length > 0) {
    const firstChapter = chapters[0]
    const isIntro = isIntroChapter(firstChapter.title, detectedLanguage)
    
    if (isIntro)
    {
      console.log(`First chapter "${firstChapter.title}" detected as intro, analyzing remaining chapters`)
      chaptersToAnalyze = chapters.slice(1)
    }
    else {
      console.log(`First chapter "${firstChapter.title}" not detected as intro, analyzing all chapters`)
      chaptersToAnalyze = chapters
    }
  } else {
    const introSkip = parseInt(process.env.INTRO_SKIP_SECONDS || '180', 10)
    console.log(`No chapters found. Using fallback: skipping first ${introSkip} seconds`)
    chaptersToAnalyze = [{
      title: 'Main Content',
      startSec: introSkip,
      endSec: videoDuration || Math.max(...allWords.map(w => w.end))
    }]
  }
  
  if (chaptersToAnalyze.length === 0) {
    console.log('No chapters to analyze after skipping intro')
    return []
  }
  
  const allCandidates: Segment[] = []
  
  for (const chapter of chaptersToAnalyze) {
    console.log(`Analyzing chapter: "${chapter.title}" (${chapter.startSec}s - ${chapter.endSec}s)`)
    
    const chapterWords = allWords.filter(w => 
      w.start >= chapter.startSec && w.start < chapter.endSec
    )
    
    if (chapterWords.length === 0) {
      console.log(`  No words found in chapter "${chapter.title}"`)
      continue
    }
    
    const pauseBoundaries: number[] = []
    
    for (let i = 0; i < chapterWords.length - 1; i++) {
      const gap = chapterWords[i + 1].start - chapterWords[i].end
      
      if (gap >= 0.35 && gap <= 0.9) {
        pauseBoundaries.push(i + 1)
      }
    }
    
    const chapterCandidates: Segment[] = []
    
    for (let i = 0; i < pauseBoundaries.length; i++) {
      const startIdx = pauseBoundaries[i]
      
      for (let j = i + 1; j < pauseBoundaries.length; j++) {
        const endIdx = pauseBoundaries[j]
        const segmentWords = chapterWords.slice(startIdx, endIdx)
        
        if (segmentWords.length === 0) continue
        
        const startSec = segmentWords[0].start
        const endSec = segmentWords[segmentWords.length - 1].end
        const duration = endSec - startSec
        
        if (duration >= 20 && duration <= 60) {
          const speechDuration = segmentWords.reduce((sum, w) => sum + (w.end - w.start), 0)
          
          if (speechDuration >= 8) {
            const text = segmentWords.map(w => w.word).join(' ')
            const hookWords = segmentWords.filter(w => w.start - startSec < 3)
            const hook = hookWords.map(w => w.word).join(' ').trim()
            
            const wordsPerSec = segmentWords.length / duration
            const pauseDensity = (duration - speechDuration) / duration
            const highEnergyWords = segmentWords.filter(w => 
              w.word.length > 6 || /[!?]/.test(w.word)
            ).length
            
            const sceneChangesInSegment = sceneChanges.filter(scene => 
              scene.timeSec >= startSec && scene.timeSec <= endSec
            ).length
            
            const startsNearScene = sceneChanges.some(scene =>
              Math.abs(scene.timeSec - startSec) <= 1.0
            )
            
            const endsNearScene = sceneChanges.some(scene =>
              Math.abs(scene.timeSec - endSec) <= 1.0
            )
            
            let sceneBonus = 0
            
            if (startsNearScene) sceneBonus += 5
            if (endsNearScene) sceneBonus += 5
            if (sceneChangesInSegment > 2) sceneBonus += sceneChangesInSegment * 2
            
            const score = wordsPerSec * 10 + pauseDensity * 5 + highEnergyWords + sceneBonus
            
            chapterCandidates.push({
              startSec,
              endSec,
              durationSec: duration,
              words: segmentWords,
              text,
              hook: hook || text.substring(0, 50),
              score,
              chapterTitle: chapter.title
            })
          }
        }
      }
    }
    
    const nonOverlappingInChapter = removeOverlaps(chapterCandidates)
    console.log(`  Found ${nonOverlappingInChapter.length} non-overlapping segments in chapter "${chapter.title}"`)
    allCandidates.push(...nonOverlappingInChapter)
  }
  
  allCandidates.sort((a, b) => b.score - a.score)
  
  const preferredCandidates = allCandidates.filter(c => c.durationSec >= 25 && c.durationSec <= 45)
  
  if (preferredCandidates.length > 0) {
    return preferredCandidates.slice(0, 12)
  }
  
  return allCandidates.slice(0, 12)
}
