import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/admin/collections - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    const collectionData = await request.json()
    console.log('Collection data received:', collectionData)
    
    // Call the backend API to create the collection
    const response = await fetch(`${BACKEND_URL}/api/admin/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}` // Adjust based on your auth setup
      },
      body: JSON.stringify(collectionData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to create collection' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    console.log('Collection created successfully:', result)
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Create collection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/admin/collections - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    // Call the backend API to get collections
    const response = await fetch(`${BACKEND_URL}/api/admin/collections${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}` // Adjust based on your auth setup
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch collections' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Get collections error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
