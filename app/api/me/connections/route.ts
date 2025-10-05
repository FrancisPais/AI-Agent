import { NextResponse } from 'next/server'
import { requireAuth } from '@/src/lib/session'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  try {
    const session = await requireAuth()
    
    if (!session.userId)
    {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 401 }
      )
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        googleAccountId: true,
        googleTokenExpiresAt: true,
        youtubeCookies: true,
        youtubeCookiesLastUsedAt: true
      }
    })
    
    if (!user)
    {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      hasOAuth: !!user.googleAccountId,
      oauthExpired: user.googleTokenExpiresAt ? user.googleTokenExpiresAt < new Date() : true,
      hasCookies: !!user.youtubeCookies,
      cookiesLastUsedAt: user.youtubeCookiesLastUsedAt
    })
  }
  catch (error: any) {
    console.error('Error fetching connections:', error)
    
    if (error.message === 'Authentication required')
    {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch connections' },
      { status: 500 }
    )
  }
}
