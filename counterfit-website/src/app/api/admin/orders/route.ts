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

    console.log('🔍 Admin fetching all orders')

    // Fetch all orders from backend (admin can see all orders)
    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('❌ Backend error:', response.status, response.statusText)
      
      // If backend is down, return empty orders with message
      if (response.status === 503 || response.status === 502) {
        console.warn('⚠️ Backend unavailable, returning empty orders')
        return NextResponse.json({
          success: true,
          orders: [],
          message: 'Backend temporarily unavailable - orders will appear when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch orders from backend' },
        { status: response.status }
      )
    }

    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error('❌ Failed to parse backend response:', jsonError)
      return NextResponse.json({
        success: true,
        orders: [],
        message: 'Backend response error - orders will appear when service is restored'
      })
    }
    console.log('✅ Admin orders fetched successfully:', data.orders?.length || 0, 'orders')

    return NextResponse.json({
      success: true,
      orders: data.orders || []
    })

  } catch (error) {
    console.error('❌ Admin orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch orders' },
      { status: 500 }
    )
  }
}
