import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { videoQueue } from '@/src/lib/queue'
import { getVideoMetadata } from '@/src/services/youtube'
import { requireAuth } from '@/src/lib/session'

function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i
  
  if (!urlPattern.test(trimmed))
  {
    throw new Error('Invalid YouTube URL')
  }
  
  return trimmed
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const body = await request.json()
    const { url } = body
    
    if (!url)
    {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    const sanitizedUrl = sanitizeUrl(url)
    
    const metadata = await getVideoMetadata(sanitizedUrl)
    
    const video = await prisma.video.create({
      data: {
        sourceUrl: sanitizedUrl,
        title: metadata.title,
        durationSec: metadata.duration,
        status: 'queued'
      }
    })
    
    await videoQueue.add('process', {
      videoId: video.id
    })
    
    return NextResponse.json({
      videoId: video.id,
      status: 'queued'
    })
  }
  catch (error: any) {
    console.error('Error submitting video:', error)
    
    if (error.message === 'Authentication required')
    {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    if (error.message === 'Invalid YouTube URL')
    {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to submit video' },
      { status: 500 }
    )
  }
}
