import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

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

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    console.log('🔍 Admin fetching dashboard stats')

    // Try to fetch stats from backend, but provide fallbacks if backend is down
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${session.user.accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Admin stats fetched successfully from backend')
        return NextResponse.json(data)
      }
    } catch (backendError) {
      console.warn('⚠️ Backend unavailable, using fallback stats:', backendError)
    }

    // Fallback stats if backend is down
    console.log('📊 Using fallback admin stats')
    return NextResponse.json({
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
      recentOrders: [],
      topProducts: [],
      message: 'Backend temporarily unavailable - showing cached data'
    })

  } catch (error) {
    console.error('❌ Admin stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch stats' },
      { status: 500 }
    )
  }
}
