'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupCookiesPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [cookiesText, setCookiesText] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'paste' | 'file'>('paste')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/status')
      const data = await res.json()
      
      if (!data.isAuthenticated)
      {
        router.push('/login')
        return
      }
    }
    catch (err) {
      console.error('Failed to check auth:', err)
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    }
    catch (err) {
      console.error('Failed to logout:', err)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try {
      const res = await fetch('/api/youtube/cookies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cookies: cookiesText })
      })
      
      const data = await res.json()
      
      if (!res.ok)
      {
        throw new Error(data.error || 'Failed to save cookies')
      }
      
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    catch (err: any) {
      setError(err.message || 'Failed to upload cookies')
    }
    finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    
    if (!file)
    {
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess(false)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/api/youtube/cookies', {
        method: 'POST',
        body: formData
      })
      
      const data = await res.json()
      
      if (!res.ok)
      {
        throw new Error(data.error || 'Failed to upload cookies')
      }
      
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/')
      }, 2000)
    }
    catch (err: any) {
      setError(err.message || 'Failed to upload cookies')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-3xl mx-auto pt-12">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2">YouTube Cookies Setup</h1>
          <p className="text-gray-400 mb-8">
            To download YouTube videos, we need your YouTube cookies. This allows the app to access videos as if you were signed in.
          </p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-200 text-sm mb-2">{error}</p>
              {
                error.includes('sign in again') && (
                  <button
                    onClick={handleLogout}
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Sign in again
                  </button>
                )
              }
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg">
              <p className="text-green-200 text-sm">Cookies uploaded successfully! Redirecting...</p>
            </div>
          )}
          
          <div className="mb-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setUploadMethod('paste')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${uploadMethod === 'paste' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Paste Cookies
              </button>
              <button
                onClick={() => setUploadMethod('file')}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors ${uploadMethod === 'file' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Upload File
              </button>
            </div>
            
            {uploadMethod === 'paste' ? (
              <form onSubmit={handleSubmit}>
                <textarea
                  value={cookiesText}
                  onChange={(e) => setCookiesText(e.target.value)}
                  placeholder="Paste your YouTube cookies in Netscape format here..."
                  className="w-full h-64 bg-gray-900 text-white border border-gray-700 rounded-lg p-4 font-mono text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !cookiesText.trim()}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Uploading...' : 'Save Cookies'}
                </button>
              </form>
            ) : (
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="cookie-file"
                  disabled={loading}
                />
                <label
                  htmlFor="cookie-file"
                  className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  {loading ? 'Uploading...' : 'Choose cookies.txt File'}
                </label>
                <p className="text-gray-400 text-sm mt-4">
                  Select your cookies.txt file exported from your browser
                </p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-lg">How to export YouTube cookies:</h2>
            
            <div className="space-y-3 text-sm text-gray-300">
              <div>
                <h3 className="font-semibold text-white mb-1">Using Browser Extension:</h3>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Install a cookie export extension for your browser</li>
                  <li>Go to youtube.com and sign in</li>
                  <li>Export cookies in Netscape format</li>
                  <li>Paste or upload the cookies.txt file here</li>
                </ol>
              </div>
              
              <div className="pt-3 border-t border-gray-700">
                <h3 className="font-semibold text-white mb-1">Required cookies:</h3>
                <p className="text-gray-400">
                  Your cookies must include: <span className="font-mono text-blue-400">SAPISID</span>, <span className="font-mono text-blue-400">HSID</span>, and <span className="font-mono text-blue-400">SSID</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
