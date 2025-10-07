import { Worker, Job } from 'bullmq'
import { connection } from './lib/queue'
import { prisma } from './lib/prisma'
import { getVideoMetadata, downloadVideo, cleanupUserCookiesFile } from './services/youtube'
import { extractAudio, compressAudioForTranscription, renderVerticalClip, extractThumbnail, createSrtFile, detectScenes } from './services/ffmpeg'
import { transcribeAudio } from './services/openai'
import { scoreClip } from './services/openai'
import { detectSegments } from './services/segmentation'
import { uploadFile } from './services/s3'
import { join } from 'path'
import { mkdirSync, existsSync, rmSync } from 'fs'
import { tmpdir } from 'os'

interface VideoJob {
  videoId: string
  userId: string
}

async function processVideo(job: Job<VideoJob>) {
  const { videoId, userId } = job.data
  
  if (!userId)
  {
    throw new Error('User ID is required for video processing')
  }
  
  await prisma.video.update({
    where: { id: videoId },
    data: { status: 'processing' }
  })
  
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { user: true }
  })
  
  if (!video)
  {
    throw new Error(`Video ${videoId} not found`)
  }
  
  if (!video.user.youtubeCookies)
  {
    throw new Error('YouTube cookies not configured. Please upload your YouTube cookies.')
  }
  
  const workDir = join(tmpdir(), `video_${videoId}`)
  
  if (!existsSync(workDir))
  {
    mkdirSync(workDir, { recursive: true })
  }
  
  try {
    const videoPath = join(workDir, 'source.mp4')
    const audioPath = join(workDir, 'audio.m4a')
    const transcriptionAudioPath = join(workDir, 'audio_transcription.mp3')
    
    console.log(`Downloading video: ${video.sourceUrl}`)
    await downloadVideo(video.sourceUrl, videoPath, userId)
    
    console.log(`Extracting audio`)
    await extractAudio(videoPath, audioPath)
    
    console.log(`Compressing audio for transcription`)
    await compressAudioForTranscription(audioPath, transcriptionAudioPath)
    
    console.log(`Transcribing audio`)
    const transcript = await transcribeAudio(transcriptionAudioPath)
    
    await prisma.video.update({
      where: { id: videoId },
      data: { transcript: transcript as any }
    })
    
    console.log(`Detecting scene changes`)
    const sceneChanges = await detectScenes(videoPath)
    console.log(`Found ${sceneChanges.length} scene changes`)
    
    console.log(`Detecting segments`)
    const segments = detectSegments(transcript, sceneChanges)
    
    console.log(`Found ${segments.length} candidate segments`)
    
    const processSegment = async (segment: any, i: number) => {
      console.log(`Processing segment ${i + 1}/${segments.length}`)
      
      const clipId = `${videoId}_${i}`
      const clipDir = join(workDir, `clip_${i}`)
      
      if (!existsSync(clipDir))
      {
        mkdirSync(clipDir, { recursive: true })
      }
      
      const clipPath = join(clipDir, 'clip.mp4')
      const thumbPath = join(clipDir, 'thumb.jpg')
      const srtPath = join(clipDir, 'clip.srt')
      
      createSrtFile(segment.words, srtPath)
      
      await renderVerticalClip({
        inputPath: videoPath,
        outputPath: clipPath,
        startTime: segment.startSec,
        duration: segment.durationSec,
        srtPath,
        hookText: segment.hook
      })
      
      const [_, scores] = await Promise.all([
        extractThumbnail(clipPath, thumbPath, 1),
        scoreClip(video.title, segment.hook, segment.text)
      ])
      
      const s3VideoKey = `videos/${videoId}/clips/${clipId}/clip.mp4`
      const s3ThumbKey = `videos/${videoId}/clips/${clipId}/thumb.jpg`
      const s3SrtKey = `videos/${videoId}/clips/${clipId}/clip.srt`
      
      await Promise.all([
        uploadFile(s3VideoKey, clipPath, 'video/mp4'),
        uploadFile(s3ThumbKey, thumbPath, 'image/jpeg'),
        uploadFile(s3SrtKey, srtPath, 'text/plain')
      ])
      
      await prisma.clip.create({
        data: {
          id: clipId,
          videoId,
          startSec: Math.floor(segment.startSec),
          endSec: Math.floor(segment.endSec),
          durationSec: Math.floor(segment.durationSec),
          category: scores.category,
          tags: scores.tags,
          scoreHook: scores.scores.hook_strength,
          scoreRetention: scores.scores.retention_likelihood,
          scoreClarity: scores.scores.clarity,
          scoreShare: scores.scores.shareability,
          scoreOverall: scores.scores.overall,
          rationale: scores.rationale,
          s3VideoKey,
          s3ThumbKey,
          s3SrtKey
        }
      })
      
      console.log(`Segment ${i + 1} completed`)
    }
    
    const clipSuccesses: string[] = []
    const clipFailures: Array<{ index: number; error: any }> = []
    
    for (let i = 0; i < segments.length; i += 2)
    {
      const batch = segments.slice(i, i + 2)
      const results = await Promise.allSettled(
        batch.map((seg, idx) => processSegment(seg, i + idx))
      )
      
      for (let j = 0; j < results.length; j++)
      {
        const result = results[j]
        const clipIndex = i + j
        
        if (result.status === 'fulfilled')
        {
          clipSuccesses.push(`clip_${clipIndex}`)
        }
        else {
          console.error(`Clip ${clipIndex + 1} failed:`, result.reason)
          clipFailures.push({ index: clipIndex, error: result.reason })
        }
      }
    }
    
    const summary = {
      totalSegments: segments.length,
      successfulClips: clipSuccesses.length,
      failedClips: clipFailures.length,
      failures: clipFailures.map(f => ({ clip: `clip_${f.index}`, error: f.error?.message || String(f.error) }))
    }
    
    console.log('Processing summary:', JSON.stringify(summary, null, 2))
    
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'completed' }
    })
    
    console.log(`Video ${videoId} processing completed with ${clipSuccesses.length} successful clips and ${clipFailures.length} failures`)
  }
  catch (error) {
    console.error(`Error processing video ${videoId}:`, error)
    
    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'failed' }
    })
    
    throw error
  }
  finally {
    cleanupUserCookiesFile(userId)
    
    if (existsSync(workDir))
    {
      rmSync(workDir, { recursive: true, force: true })
    }
  }
}

const worker = new Worker<VideoJob>('video.process', processVideo, {
  connection,
  concurrency: 1
})

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})

console.log('Worker started')
