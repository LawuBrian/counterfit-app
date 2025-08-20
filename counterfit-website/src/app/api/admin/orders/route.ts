import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

    console.log('🔍 Admin fetching all orders from Supabase...')

    // Get limit from query params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    const { data: orders, error } = await supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        totalAmount,
        status,
        paymentStatus,
        paymentMethod,
        trackingNumber,
        carrier,
        estimatedDelivery,
        createdAt,
        updatedAt,
        userId,
        notes
      `)
      .order('createdAt', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch orders',
        details: error.message
      }, { status: 500 })
    }

    console.log('✅ Orders fetched successfully:', orders?.length || 0, 'orders')

    return NextResponse.json({
      success: true,
      orders: orders || [],
      source: 'supabase'
    })

  } catch (error) {
    console.error('❌ Admin orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch orders' },
      { status: 500 }
    )
  }
}
