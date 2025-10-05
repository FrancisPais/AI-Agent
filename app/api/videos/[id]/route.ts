import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { getS3Url } from '@/src/services/s3'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        clips: {
          orderBy: { scoreOverall: 'desc' }
        }
      }
    })
    
    if (!video)
    {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }
    
    const clipsWithUrls = video.clips.map(clip => ({
      ...clip,
      videoUrl: getS3Url(clip.s3VideoKey),
      thumbUrl: getS3Url(clip.s3ThumbKey),
      srtUrl: getS3Url(clip.s3SrtKey)
    }))
    
    return NextResponse.json({
      ...video,
      clips: clipsWithUrls
    })
  }
  catch (error) {
    console.error('Error fetching video:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}
