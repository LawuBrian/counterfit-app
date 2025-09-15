import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { orderEmailService, OrderEmailData } from '@/lib/order-emails'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { oldStatus, newStatus } = await request.json()
    const orderId = params.id

    // Get full order details from backend
    const orderResponse = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!orderResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch order details' },
        { status: orderResponse.status }
      )
    }

    const orderData = await orderResponse.json()
    const order = orderData.data

    // Get user details
    const userResponse = await fetch(`${BACKEND_URL}/api/users/${order.userId}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    let user = null
    if (userResponse.ok) {
      const userData = await userResponse.json()
      user = userData.data
    }

    // Transform order data for email template
    const emailData: OrderEmailData = {
      orderNumber: order.orderNumber,
      customerName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Customer',
      customerEmail: user?.email || order.User?.email || 'customer@example.com',
      items: order.items || [],
      totalAmount: parseFloat(order.totalAmount),
      status: newStatus,
      paymentStatus: order.paymentStatus,
      shippingAddress: order.shippingAddress || {
        firstName: user?.firstName || 'Customer',
        lastName: user?.lastName || '',
        address1: 'Address not provided',
        city: 'City',
        province: 'Province',
        postalCode: '0000',
        country: 'South Africa'
      },
      trackingNumber: order.trackingNumber,
      carrier: order.carrier,
      estimatedDelivery: order.estimatedDelivery,
      orderDate: order.createdAt
    }

    // Send appropriate email based on status change
    await orderEmailService.sendStatusChangeEmail(emailData, oldStatus, newStatus)

    return NextResponse.json({
      success: true,
      message: `Email sent for status change: ${oldStatus} → ${newStatus}`,
      emailSent: true
    })

  } catch (error) {
    console.error('Send order email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

