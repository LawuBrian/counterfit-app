import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/admin/visitors/recent - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view recent visitors' },
        { status: 401 }
      )
    }

    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '20'

    console.log('🔍 Admin fetching recent visitors from backend...')

    // Fetch recent visitors from the backend
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    console.log('🔍 Backend URL:', backendUrl)
    console.log('🔍 Full URL:', `${backendUrl}/api/visitors/recent?limit=${limit}`)
    
    const response = await fetch(`${backendUrl}/api/visitors/recent?limit=${limit}`)
    
    console.log('🔍 Backend response status:', response.status)
    console.log('🔍 Backend response ok:', response.ok)

    if (!response.ok) {
      console.error('❌ Backend API error:', response.status, response.statusText)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch recent visitors from backend',
        details: `Backend returned ${response.status}: ${response.statusText}`
      }, { status: 500 })
    }

    const backendData = await response.json()
    console.log('🔍 Backend response data:', JSON.stringify(backendData, null, 2))
    
    if (!backendData.success) {
      console.error('❌ Backend returned error:', backendData)
      return NextResponse.json({
        success: false,
        error: 'Backend returned error',
        details: backendData.message || 'Unknown backend error'
      }, { status: 500 })
    }

    console.log('✅ Recent visitors fetched successfully from backend')

    return NextResponse.json({
      success: true,
      data: backendData.data,
      source: 'backend'
    })

  } catch (error) {
    console.error('❌ Admin recent visitors API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch recent visitors' },
      { status: 500 }
    )
  }
}
