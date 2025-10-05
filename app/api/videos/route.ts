import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const sort = searchParams.get('sort') || 'createdAt'
    
    const where = q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { sourceUrl: { contains: q, mode: 'insensitive' as const } }
      ]
    } : {}
    
    const orderBy = sort === 'createdAt' ? { createdAt: 'desc' as const } : { updatedAt: 'desc' as const }
    
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: { clips: true }
          }
        }
      }),
      prisma.video.count({ where })
    ])
    
    return NextResponse.json({
      videos,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    })
  }
  catch (error) {
    console.error('Error fetching videos:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
