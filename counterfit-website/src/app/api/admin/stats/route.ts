import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

// Function to fetch stats directly from Supabase as fallback
async function fetchStatsFromSupabase() {
  try {
    console.log('🔄 Fetching stats directly from Supabase...')
    
    // Get total orders
    const { count: totalOrders, error: ordersError } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true })

    if (ordersError) throw ordersError

    // Get total revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from('Order')
      .select('totalAmount')
      .eq('paymentStatus', 'paid')

    if (revenueError) throw revenueError
    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.totalAmount || 0), 0) || 0

    // Get total products
    const { count: totalProducts, error: productsError } = await supabase
      .from('Product')
      .select('*', { count: 'exact', head: true })

    if (productsError) throw productsError

    // Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })

    if (usersError) throw usersError

    // Get recent orders
    const { data: recentOrders, error: recentError } = await supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        totalAmount,
        status,
        paymentStatus,
        createdAt,
        userId
      `)
      .order('createdAt', { ascending: false })
      .limit(5)

    if (recentError) throw recentError

    console.log('✅ Supabase stats fetched')
    return {
      totalOrders: totalOrders || 0,
      totalRevenue,
      totalProducts: totalProducts || 0,
      totalUsers: totalUsers || 0,
      recentOrders: recentOrders || []
    }
  } catch (error) {
    console.error('❌ Failed to fetch stats from Supabase:', error)
    throw error
  }
}

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

    console.log('🔍 Admin fetching dashboard stats')

    // Try backend first, fallback to Supabase
    try {
      if (session.user?.accessToken) {
        console.log('🌐 Trying backend API first...')
        const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
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
          
          console.log('✅ Admin stats fetched from backend')
          
          // Transform backend data to expected format
          const stats = {
            totalOrders: data.data?.overview?.totalOrders || 0,
            totalRevenue: data.data?.overview?.totalRevenue || 0,
            totalProducts: data.data?.overview?.totalProducts || 0,
            totalUsers: data.data?.overview?.totalUsers || 0,
            recentOrders: data.data?.recentOrders || []
          }
          
          return NextResponse.json({
            success: true,
            stats,
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
        const stats = await fetchStatsFromSupabase()
        return NextResponse.json({
          success: true,
          stats,
          message: 'Stats loaded from database (backend unavailable)',
          source: 'supabase'
        })
      } catch (supabaseError) {
        console.error('❌ Both backend and Supabase failed:', supabaseError)
        return NextResponse.json({
          success: true,
          stats: {
            totalOrders: 0,
            totalRevenue: 0,
            totalProducts: 0,
            totalUsers: 0,
            recentOrders: []
          },
          message: 'Unable to load stats - both backend and database are unavailable',
          source: 'none'
        })
      }
    }

  } catch (error) {
    console.error('❌ Admin stats API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch stats' },
      { status: 500 }
    )
  }
}

