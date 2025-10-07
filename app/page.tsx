'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Video {
  id: string
  title: string
  sourceUrl: string
  status: string
  durationSec: number
  createdAt: string
  _count: {
    clips: number
  }
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState<Video[]>([])
  const [error, setError] = useState('')
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [connections, setConnections] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/status')
      const data = await res.json()
      setAuthStatus(data)
      
      if (!data.isAuthenticated)
      {
        router.push('/login')
        return
      }
      
      const connectionsRes = await fetch('/api/me/connections')
      const connectionsData = await connectionsRes.json()
      setConnections(connectionsData)
      
      if (!connectionsData.hasCookies)
      {
        router.push('/setup-cookies')
        return
      }
      
      fetchVideos()
    }
    catch (err) {
      console.error('Failed to check auth:', err)
      router.push('/login')
    }
  }

  async function fetchVideos() {
    try {
      const response = await fetch('/api/videos')
      const data = await response.json()
      
      if (response.ok) {
        setVideos(data.videos)
      }
    }
    catch (err) {
      console.error('Error fetching videos:', err)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })

      const data = await response.json()

      if (response.ok) {
        setUrl('')
        fetchVideos()
      }
      else {
        setError(data.error || 'Failed to submit video')
      }
    }
    catch (err) {
      setError('Failed to submit video')
    }
    finally {
      setLoading(false)
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

  if (!authStatus || !connections)
  {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">YT Shortsmith</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connections.hasCookies ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">
                {connections.hasCookies ? 'YouTube Connected' : 'No Cookies'}
              </span>
            </div>
            {connections.hasCookies && connections.cookiesLastUsedAt && (
              <span className="text-xs text-gray-500">
                Last used: {new Date(connections.cookiesLastUsedAt).toLocaleDateString()}
              </span>
            )}
            <Link
              href="/setup-cookies"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Update Cookies
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
        
        {!connections.hasCookies && (
          <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
            <p className="text-yellow-200 text-sm">
              YouTube cookies not configured. Please <Link href="/setup-cookies" className="underline">upload your cookies</Link> to submit videos.
            </p>
          </div>
        )}
        
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Submit YouTube Video</h2>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter YouTube URL"
              className="flex-1 px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              disabled={loading || !connections.hasCookies}
            />
            <button
              type="submit"
              disabled={loading || !url || !connections.hasCookies}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded font-semibold"
            >
              {
                loading ? 'Submitting...' : 'Submit'
              }
            </button>
          </form>
          {
            error && (
              <p className="text-red-500 mt-2">{error}</p>
            )
          }
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Videos</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-4">Title</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Clips</th>
                  <th className="text-left py-2 px-4">Duration</th>
                  <th className="text-left py-2 px-4">Created</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  videos.map((video) => (
                    <tr key={video.id} className="border-b border-gray-700">
                      <td className="py-3 px-4">{video.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          video.status === 'completed' ? 'bg-green-600' :
                          video.status === 'processing' ? 'bg-blue-600' :
                          video.status === 'failed' ? 'bg-red-600' :
                          'bg-gray-600'
                        }`}>
                          {video.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{video._count.clips}</td>
                      <td className="py-3 px-4">{Math.floor(video.durationSec / 60)}m</td>
                      <td className="py-3 px-4">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/videos/${video.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            {
              videos.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No videos yet. Submit a YouTube URL to get started.
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
