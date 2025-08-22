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
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
    console.log('🔍 Backend URL:', backendUrl)
    console.log('🔍 Full URL:', `${backendUrl}/api/admin/public-stats`)
    
    if (!backendUrl) {
      console.error('❌ No backend URL configured')
      return NextResponse.json({
        success: false,
        error: 'Backend URL not configured',
        details: 'NEXT_PUBLIC_BACKEND_URL environment variable is missing'
      }, { status: 500 })
    }
    
    const response = await fetch(`${backendUrl}/api/admin/public-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout for production environments
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })
    
    console.log('🔍 Backend response status:', response.status)
    console.log('🔍 Backend response ok:', response.ok)

    if (!response.ok) {
      console.error('❌ Backend API error:', response.status, response.statusText)
      
      // Return fallback stats instead of error to prevent dashboard from breaking
      console.log('⚠️ Returning fallback stats due to backend error')
      return NextResponse.json({
        success: true,
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        source: 'fallback',
        warning: 'Backend temporarily unavailable, showing fallback data'
      })
    }

    let backendData
    try {
      backendData = await response.json()
      console.log('🔍 Backend response data:', JSON.stringify(backendData, null, 2))
    } catch (parseError) {
      console.error('❌ Failed to parse backend response:', parseError)
      return NextResponse.json({
        success: true,
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        source: 'fallback',
        warning: 'Backend response could not be parsed, showing fallback data'
      })
    }
    
    if (!backendData.success) {
      console.error('❌ Backend returned error:', backendData)
      return NextResponse.json({
        success: true,
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
        source: 'fallback',
        warning: 'Backend returned error, showing fallback data'
      })
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
      ...stats,
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

