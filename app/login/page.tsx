'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    try {
      const res = await fetch('/api/auth/status')
      const data = await res.json()
      setStatus(data)
      
      if (data.isAuthenticated)
      {
        router.push('/')
      }
    }
    catch (err) {
      console.error('Failed to check auth status:', err)
    }
  }

  async function handleLogin() {
    setLoading(true)
    setError('')
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST'
      })
      
      const data = await res.json()
      
      if (!res.ok)
      {
        throw new Error(data.error || 'Login failed')
      }
      
      router.push('/')
    }
    catch (err: any) {
      setError(err.message || 'Failed to login with YouTube')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-2">YT Shortsmith</h1>
        <p className="text-gray-400 mb-8">Sign in to continue</p>
        
        {status && !status.youtubeConnected && (
          <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200 text-sm">
              YouTube connector not set up. Please configure the YouTube integration in your Replit project settings.
            </p>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleLogin}
          disabled={loading || (status && !status.youtubeConnected)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            'Signing in...'
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Sign in with YouTube
            </>
          )}
        </button>
        
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h2 className="font-semibold mb-2">Privacy Notice</h2>
          <p className="text-sm text-gray-400 mb-3">
            This application uses YouTube OAuth 2.0 for secure authentication. We:
          </p>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Never ask for or store your Google password</li>
            <li>Only access YouTube data with your permission</li>
            <li>Store authentication tokens securely</li>
            <li>Use HTTPS for all communications</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
