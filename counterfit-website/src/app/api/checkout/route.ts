import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { generateOrderNumber, generateTrackingNumber } from '@/lib/yoco'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/checkout - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    console.log('🔍 Session object:', JSON.stringify(session, null, 2))
    console.log('🔍 Session user:', session?.user)
    
    if (!session) {
      console.log('❌ No session found')
      return NextResponse.json(
        { error: 'Unauthorized - Please login to checkout' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      console.log('❌ No access token found in session')
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    const requestBody = await request.json()
    console.log('📦 Request body:', JSON.stringify(requestBody, null, 2))
    
    const { 
      items, 
      totalAmount, 
      shippingAddress, 
      billingAddress,
      paymentMethod = 'yoco',
      notes 
    } = requestBody

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('❌ Invalid or missing items:', items)
      return NextResponse.json(
        { error: 'Missing or invalid items array' },
        { status: 400 }
      )
    }

    if (!totalAmount || isNaN(parseFloat(totalAmount))) {
      console.log('❌ Invalid totalAmount:', totalAmount)
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      )
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      console.log('❌ Invalid shippingAddress:', shippingAddress)
      return NextResponse.json(
        { error: 'Invalid shipping address' },
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

    console.log('📋 Generated order data:', JSON.stringify(orderData, null, 2))
    console.log('🌐 Calling backend API:', `${BACKEND_URL}/api/orders`)
    console.log('🔑 Authorization header:', `Bearer ${session.user.accessToken ? 'TOKEN_PRESENT' : 'NO_TOKEN'}`)

    // Create order in backend
    const response = await fetch(`${BACKEND_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      },
      body: JSON.stringify(orderData)
    })

    console.log('📥 Backend response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to create order' },
        { status: response.status }
      )
    }

    const order = await response.json()
    console.log('✅ Order created successfully:', JSON.stringify(order, null, 2))

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
    console.error('❌ Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error during checkout' },
      { status: 500 }
    )
  }
}
