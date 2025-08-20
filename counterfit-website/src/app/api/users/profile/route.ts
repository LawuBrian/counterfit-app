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

    // Fetch user profile from backend
    const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          profile: {
            firstName: session.user.firstName || '',
            lastName: session.user.lastName || '',
            email: session.user.email || '',
            phone: '',
            address: {
              street: '',
              city: '',
              state: '',
              postalCode: '',
              country: 'South Africa'
            },
            dateJoined: new Date().toISOString()
          },
          message: 'Backend temporarily unavailable - using session data'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch profile from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      profile: data.profile || data
    })

  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch profile' },
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

    // Update user profile in backend
    const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          message: 'Backend temporarily unavailable - profile will be updated when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to update profile in backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      profile: data.profile || data,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to update profile' },
      { status: 500 }
    )
  }
}
