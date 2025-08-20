import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

// Function to fetch orders directly from Supabase as fallback
async function fetchOrdersFromSupabase() {
  try {
    console.log('🔄 Fetching orders directly from Supabase...')
    
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

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }

    console.log('✅ Supabase orders fetched:', orders?.length || 0)
    return orders || []
  } catch (error) {
    console.error('❌ Failed to fetch from Supabase:', error)
    throw error
  }
}

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

    console.log('🔍 Admin fetching all orders')

    // Try backend first, fallback to Supabase
    try {
      if (session.user?.accessToken) {
        console.log('🌐 Trying backend API first...')
        const response = await fetch(`${BACKEND_URL}/api/admin/orders`, {
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          let data
          try {
            data = await response.json()
          } catch (jsonError) {
            console.error('❌ Failed to parse backend response:', jsonError)
            throw new Error('Backend response parsing failed')
          }
          
          console.log('✅ Admin orders fetched from backend:', data.data?.length || 0, 'orders')
          return NextResponse.json({
            success: true,
            orders: data.data || [],
            source: 'backend'
          })
        } else {
          console.warn('⚠️ Backend returned error:', response.status, response.statusText)
          throw new Error(`Backend error: ${response.status}`)
        }
      } else {
        throw new Error('No access token available')
      }
    } catch (backendError) {
      console.warn('⚠️ Backend failed, falling back to Supabase:', backendError)
      
      // Fallback to Supabase
      try {
        const orders = await fetchOrdersFromSupabase()
        return NextResponse.json({
          success: true,
          orders: orders,
          message: 'Orders loaded from database (backend unavailable)',
          source: 'supabase'
        })
      } catch (supabaseError) {
        console.error('❌ Both backend and Supabase failed:', supabaseError)
        return NextResponse.json({
          success: true,
          orders: [],
          message: 'Unable to load orders - both backend and database are unavailable',
          source: 'none'
        })
      }
    }

  } catch (error) {
    console.error('❌ Admin orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch orders' },
      { status: 500 }
    )
  }
}
