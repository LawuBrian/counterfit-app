import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { generateOrderNumber, generateTrackingNumber } from '@/lib/yoco'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(request: NextRequest) {
  try {
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to checkout' },
        { status: 401 }
      )
    }

    const { 
      items, 
      totalAmount, 
      shippingAddress, 
      billingAddress,
      paymentMethod = 'yoco',
      notes 
    } = await request.json()

    // Validate required fields
    if (!items || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: items, totalAmount, shippingAddress' },
        { status: 400 }
      )
    }

    // Generate order data
    const orderData = {
      userId: session.user.id,
      orderNumber: generateOrderNumber(),
      items,
      totalAmount: parseFloat(totalAmount),
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod,
      trackingNumber: generateTrackingNumber(),
      carrier: 'PostNet', // Default carrier
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes: notes || ''
    }

    // Create order in backend
    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      },
      body: JSON.stringify(orderData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to create order' },
        { status: response.status }
      )
    }

    const order = await response.json()

    // Return order data for Yoco payment
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.data.id,
        orderNumber: order.data.orderNumber,
        totalAmount: order.data.totalAmount,
        trackingNumber: order.data.trackingNumber
      }
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error during checkout' },
      { status: 500 }
    )
  }
}
