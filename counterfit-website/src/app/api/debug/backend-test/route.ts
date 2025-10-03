import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 Debug - Session exists:', !!session)
    console.log('🔍 Debug - User ID:', session?.user?.id)
    console.log('🔍 Debug - Access Token exists:', !!session?.user?.accessToken)
    console.log('🔍 Debug - Backend URL:', BACKEND_URL)

    if (!session) {
      return NextResponse.json({
        error: 'No session found',
        sessionExists: false
      })
    }

    if (!session.user?.accessToken) {
      return NextResponse.json({
        error: 'No access token found',
        sessionExists: true,
        tokenExists: false
      })
    }

    // Test backend connectivity
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('🌐 Backend response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          message: 'Backend is reachable and authentication works',
          backendResponse: data,
          sessionExists: true,
          tokenExists: true,
          backendStatus: response.status
        })
      } else {
        const errorText = await response.text()
        console.error('❌ Backend error:', errorText)
        return NextResponse.json({
          error: 'Backend returned error',
          backendStatus: response.status,
          backendError: errorText,
          sessionExists: true,
          tokenExists: true
        })
      }
    } catch (fetchError: any) {
      console.error('❌ Fetch error:', fetchError.message)
      return NextResponse.json({
        error: 'Failed to connect to backend',
        fetchError: fetchError.message,
        sessionExists: true,
        tokenExists: true,
        backendUrl: BACKEND_URL
      })
    }

  } catch (error: any) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}


