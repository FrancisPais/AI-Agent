import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'
import { requireAuth } from '@/src/lib/session'

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()
    
    if (!session.userId)
    {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 401 }
      )
    }
    
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20')))
    const sort = searchParams.get('sort') || 'createdAt'
    
    const where: any = { userId: session.userId }
    
    if (q)
    {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' as const } },
        { sourceUrl: { contains: q, mode: 'insensitive' as const } }
      ]
    }
    
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
  catch (error: any) {
    console.error('Error fetching videos:', error)
    
    if (error.message === 'Authentication required')
    {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
