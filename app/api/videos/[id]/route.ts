import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { getSignedUrlForKey, getS3Url } from '@/src/services/s3'
import { requireAuth } from '@/src/lib/session'

async function getUrlForKey(key: string): Promise<string> {
  try {
    return await getSignedUrlForKey(key, 7200)
  }
  catch (error: any) {
    if (error.name === 'CredentialsProviderError')
    {
      console.warn('S3 credentials not configured, using direct URLs')
    }
    else
    {
      console.warn('Failed to generate signed URL, falling back to direct URL:', error)
    }
    return getS3Url(key)
  }
}

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
        videoUrl: await getUrlForKey(clip.s3VideoKey),
        thumbUrl: await getUrlForKey(clip.s3ThumbKey),
        srtUrl: await getUrlForKey(clip.s3SrtKey)
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
