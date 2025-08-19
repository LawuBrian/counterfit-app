import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createYocoCheckout } from '@/lib/yoco'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/checkout/create-yoco - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    console.log('🔍 Session object:', JSON.stringify(session, null, 2))
    
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
      orderId,
      amount, 
      currency = 'ZAR',
      customerEmail,
      customerName,
      successUrl,
      cancelUrl
    } = requestBody

    // Validate required fields
    if (!orderId) {
      console.log('❌ Missing orderId')
      return NextResponse.json(
        { error: 'Missing order ID' },
        { status: 400 }
      )
    }

    if (!amount || isNaN(parseFloat(amount))) {
      console.log('❌ Invalid amount:', amount)
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    if (!customerEmail) {
      console.log('❌ Missing customer email')
      return NextResponse.json(
        { error: 'Missing customer email' },
        { status: 400 }
      )
    }

    // Get order details from backend to verify
    console.log('🔍 Fetching order details from backend:', orderId)
    const orderResponse = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!orderResponse.ok) {
      console.error('❌ Failed to fetch order details:', orderResponse.status)
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      )
    }

    const order = await orderResponse.json()
    console.log('✅ Order details fetched:', order)

    // Verify order belongs to user
    if (order.data.userId !== session.user.id) {
      console.log('❌ Order does not belong to user')
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 403 }
      )
    }

    // Create YOCO checkout
    // Convert amount from Rands to cents (Yoco expects smallest currency unit)
    const amountInCents = Math.round(parseFloat(amount) * 100)
    
    const checkoutData = {
      amount: amountInCents,
      currency,
      metadata: {
        orderId: orderId,
        orderNumber: order.data.orderNumber,
        customerEmail: customerEmail,
        customerName: customerName || session.user.name || 'Customer'
      },
      successUrl: successUrl || `${process.env.NEXTAUTH_URL}/checkout/success?orderId=${orderId}`,
      cancelUrl: cancelUrl || `${process.env.NEXTAUTH_URL}/checkout?orderId=${orderId}`
    }

    console.log('💳 Creating YOCO checkout with data:', checkoutData)
    
    const yocoCheckout = await createYocoCheckout(checkoutData)
    console.log('✅ YOCO checkout created:', yocoCheckout)

    // Update order with checkout ID
    const updateResponse = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checkoutId: yocoCheckout.id,
        status: 'pending_payment'
      })
    })

    if (!updateResponse.ok) {
      console.warn('⚠️ Failed to update order with checkout ID, but checkout was created')
    } else {
      console.log('✅ Order updated with checkout ID')
    }

    // Return checkout data for frontend
    return NextResponse.json({
      success: true,
      message: 'YOCO checkout created successfully',
      checkout: {
        id: yocoCheckout.id,
        redirectUrl: yocoCheckout.redirectUrl,
        amount: yocoCheckout.amount,
        currency: yocoCheckout.currency,
        status: yocoCheckout.status
      }
    })

  } catch (error) {
    console.error('❌ YOCO checkout creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create YOCO checkout' },
      { status: 500 }
    )
  }
}
