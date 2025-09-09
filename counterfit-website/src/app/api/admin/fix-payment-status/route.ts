import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      )
    }

    const { orderId, paymentStatus = 'PAID', status = 'CONFIRMED' } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      )
    }

    // Update order payment status via backend
    const response = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentStatus,
        status,
        updatedAt: new Date().toISOString()
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json(
        { error: 'Failed to update order', details: errorData },
        { status: response.status }
      )
    }

    const updatedOrder = await response.json()

    return NextResponse.json({
      success: true,
      message: `Order payment status updated to ${paymentStatus}`,
      order: updatedOrder.data
    })

  } catch (error) {
    console.error('Fix payment status error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      )
    }

    // Get all orders to find ones that need payment status fixed
    const response = await fetch(`${BACKEND_URL}/api/admin/orders`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const orders = data.data || []

    // Find orders that might need payment status fixed
    const pendingPaymentOrders = orders.filter((order: any) => 
      order.paymentStatus === 'pending' || 
      order.paymentStatus === 'PENDING' || 
      !order.paymentStatus
    )

    return NextResponse.json({
      success: true,
      totalOrders: orders.length,
      pendingPaymentOrders: pendingPaymentOrders.length,
      orders: pendingPaymentOrders.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }))
    })

  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
