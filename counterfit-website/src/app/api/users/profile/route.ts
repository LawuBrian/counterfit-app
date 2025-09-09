import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view profile' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    // Try to fetch user profile from backend first
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      console.log('⚠️ Backend unavailable, using session data fallback:', backendError.message)
    }

    // Fallback: Use session data if backend is unavailable
    const fallbackProfile = {
      id: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName || '',
      lastName: session.user.lastName || '',
      phone: '',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: fallbackProfile,
      profile: fallbackProfile,
      message: 'Using cached profile data (backend unavailable)'
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to update profile' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('🔄 Profile update request body:', body)

    // Forward request to backend (where users are actually stored)
    const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    console.log('🌐 Backend response status:', response.status)

    if (!response.ok) {
      if (response.status === 503) {
        return NextResponse.json(
          { error: 'Backend service temporarily unavailable. Please try again later.' },
          { status: 503 }
        )
      }
      
      const errorData = await response.json()
      console.error('❌ Backend error response:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to update profile' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Profile update API error:', error)
    console.error('Error details:', error.message)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}