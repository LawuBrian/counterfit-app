"use client"

import { useSession } from 'next-auth/react'
import { useState } from 'react'

export default function AuthDebug() {
  const { data: session, status } = useSession()
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testBackendConnection = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test/supabase')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const testToken = async () => {
    if (!session?.user?.accessToken) {
      setTestResult({ error: 'No access token found' })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/test/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: session.user.accessToken })
      })
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  if (process.env.NODE_ENV === 'production') {
    return null // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg max-w-md z-50">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      
      <div className="text-xs space-y-2 mb-3">
        <div>Status: {status}</div>
        <div>Has Session: {!!session}</div>
        <div>User Role: {session?.user?.role}</div>
        <div>Has Token: {!!session?.user?.accessToken}</div>
        {session?.user?.accessToken && (
          <div>Token: {session.user.accessToken.substring(0, 20)}...</div>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="bg-blue-600 px-2 py-1 rounded text-xs disabled:opacity-50"
        >
          Test Backend
        </button>
        
        <button
          onClick={testToken}
          disabled={isLoading || !session?.user?.accessToken}
          className="bg-green-600 px-2 py-1 rounded text-xs disabled:opacity-50 ml-2"
        >
          Test Token
        </button>
      </div>

      {testResult && (
        <div className="mt-3 p-2 bg-gray-800 rounded text-xs">
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
