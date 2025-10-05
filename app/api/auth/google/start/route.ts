import { NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'

const getOAuthClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/api/auth/google/callback`
  
  if (!clientId || !clientSecret)
  {
    throw new Error('Google OAuth credentials not configured')
  }
  
  return new OAuth2Client(clientId, clientSecret, redirectUri)
}

export async function GET() {
  try {
    const oauth2Client = getOAuthClient()
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid'
      ],
      prompt: 'consent'
    })
    
    return NextResponse.json({ authUrl })
  }
  catch (error: any) {
    console.error('Error generating OAuth URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate OAuth URL' },
      { status: 500 }
    )
  }
}
