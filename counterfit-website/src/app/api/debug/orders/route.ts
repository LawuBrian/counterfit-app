import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all orders for debugging
    const { data: allOrders, error: ordersError } = await supabase
      .from('Order')
      .select('*')
      .order('createdAt', { ascending: false })
      .limit(10)

    if (ordersError) {
      return NextResponse.json(
        { error: 'Failed to fetch orders', details: ordersError },
        { status: 500 }
      )
    }

    // Get all users for debugging
    const { data: allUsers, error: usersError } = await supabase
      .from('User')
      .select('id, email, firstName, lastName, role')
      .limit(10)

    if (usersError) {
      return NextResponse.json(
        { error: 'Failed to fetch users', details: usersError },
        { status: 500 }
      )
    }

    // Calculate revenue
    const paidOrders = allOrders?.filter(order => order.paymentStatus === 'paid') || []
    const totalRevenue = paidOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0)

    return NextResponse.json({
      success: true,
      debug: {
        currentUser: {
          id: session.user.id,
          email: session.user.email,
          role: session.user.role
        },
        orders: {
          total: allOrders?.length || 0,
          paid: paidOrders.length,
          details: allOrders?.map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            userId: order.userId,
            status: order.status,
            paymentStatus: order.paymentStatus,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt
          }))
        },
        users: {
          total: allUsers?.length || 0,
          details: allUsers?.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }))
        },
        revenue: {
          totalRevenue,
          paidOrdersCount: paidOrders.length
        }
      }
    })

  } catch (error) {
    console.error('Debug orders API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { action, orderId } = await request.json()

    if (action === 'mark_paid' && orderId) {
      // Mark order as paid for testing
      const { data: updatedOrder, error } = await supabase
        .from('Order')
        .update({ 
          paymentStatus: 'paid',
          status: 'confirmed',
          updatedAt: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update order', details: error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Order marked as paid',
        order: updatedOrder
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Debug orders POST API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}
