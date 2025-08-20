import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/admin/stats - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view stats' },
        { status: 401 }
      )
    }

    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

    console.log('🔍 Admin fetching dashboard stats from backend...')

    // Fetch stats from the backend's public stats endpoint
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    console.log('🔍 Backend URL:', backendUrl)
    console.log('🔍 Full URL:', `${backendUrl}/api/admin/public-stats`)
    
    const response = await fetch(`${backendUrl}/api/admin/public-stats`)
    
    console.log('🔍 Backend response status:', response.status)
    console.log('🔍 Backend response ok:', response.ok)

    if (!response.ok) {
      console.error('❌ Backend API error:', response.status, response.statusText)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch stats from backend',
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

    // Transform backend data to match frontend expectations
    const stats = {
      totalOrders: backendData.data.overview.totalOrders || 0,
      totalRevenue: backendData.data.overview.totalRevenue || 0,
      totalProducts: backendData.data.overview.totalProducts || 0,
      totalUsers: backendData.data.overview.totalUsers || 0,
      recentOrders: [] // Backend public endpoint doesn't return recent orders
    }

    console.log('✅ Stats fetched successfully from backend:', stats)

    return NextResponse.json({
      success: true,
      stats,
      source: 'backend'
    })

  } catch (error) {
    console.error('❌ Admin stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch stats' },
      { status: 500 }
    )
  }
}

