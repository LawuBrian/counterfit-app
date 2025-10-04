import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { config } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { success: false, message: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    // Forward the request to the backend with collections category AND auth token
    const backendResponse = await fetch(`${config.apiUrl}/api/upload/product-image?category=collections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
      },
      body: formData,
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Collection upload proxy error:', error)
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    )
  }
}

// Configure the route to handle larger files
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds timeout
