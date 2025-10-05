import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { getSignedUrlForKey } from '@/src/services/s3'
import { requireAuth } from '@/src/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    
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
    
    const clipsWithUrls = await Promise.all(
      video.clips.map(async (clip) => ({
        ...clip,
        videoUrl: await getSignedUrlForKey(clip.s3VideoKey, 7200),
        thumbUrl: await getSignedUrlForKey(clip.s3ThumbKey, 7200),
        srtUrl: await getSignedUrlForKey(clip.s3SrtKey, 7200)
      }))
    )
    
    return NextResponse.json({
      ...video,
      clips: clipsWithUrls
    })
  }
  catch (error: any) {
    console.error('Error fetching video:', error)
    
    if (error.message === 'Authentication required')
    {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}
