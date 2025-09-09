import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function GET(request: NextRequest) {
  try {
    console.log('📋 GET /api/admin/orders - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view orders' },
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

    console.log('🔍 Admin fetching all orders from backend...')

    // Get limit from query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // Fetch orders from backend (same source as stats)
    const response = await fetch(`${BACKEND_URL}/api/admin/orders?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('❌ Backend error:', response.status, response.statusText)
      
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          orders: [],
          message: 'Backend temporarily unavailable - orders will appear when service is restored'
        })
      }
      
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch orders from backend',
        details: `Backend returned ${response.status}`
      }, { status: response.status })
    }

    const data = await response.json()
    console.log('✅ Orders fetched successfully:', data.data?.length || 0, 'orders')

    return NextResponse.json({
      success: true,
      orders: data.data || [],
      source: 'backend'
    })

  } catch (error) {
    console.error('❌ Admin orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch orders' },
      { status: 500 }
    )
  }
}
