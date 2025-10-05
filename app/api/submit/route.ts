import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { videoQueue } from '@/src/lib/queue'
import { getVideoMetadata } from '@/src/services/youtube'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body
    
    if (!url)
    {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    const metadata = await getVideoMetadata(url)
    
    const video = await prisma.video.create({
      data: {
        sourceUrl: url,
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
  catch (error) {
    console.error('Error submitting video:', error)
    
    return NextResponse.json(
      { error: 'Failed to submit video' },
      { status: 500 }
    )
  }
}
