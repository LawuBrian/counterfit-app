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

    // ⚠️ IMPORTANT: Create draft order only - real order created when payment confirmed
    const draftOrderData = {
      userId: session.user.id,
      orderNumber: generateOrderNumber(),
      items,
      totalAmount: parseFloat(totalAmount),
      status: 'draft', // Draft status until payment is confirmed
      paymentStatus: 'pending',
      paymentMethod,
      trackingNumber: generateTrackingNumber(),
      carrier: 'PostNet',
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes: notes || ''
    }

    console.log('📋 Creating draft order:', JSON.stringify(draftOrderData, null, 2))
    
    let order
    
    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Generate UUID for the order
      const { randomUUID } = await import('crypto')
      const orderId = randomUUID()
      
      // Create draft order in Supabase
      const { data: draftOrder, error } = await supabase
        .from('Order')
        .insert([{
          id: orderId,
          orderNumber: draftOrderData.orderNumber,
          status: 'draft', // Draft status - not visible in admin until paid
          totalAmount: draftOrderData.totalAmount,
          subtotal: draftOrderData.totalAmount,
          tax: 0,
          shipping: 0,
          paymentStatus: 'pending',
          paymentId: null,
          trackingNumber: draftOrderData.trackingNumber,
          carrier: draftOrderData.carrier,
          notes: draftOrderData.notes,
          paymentMethod: draftOrderData.paymentMethod,
          userId: draftOrderData.userId,
          items: JSON.stringify(draftOrderData.items),
          shippingAddress: JSON.stringify(draftOrderData.shippingAddress),
          billingAddress: JSON.stringify(draftOrderData.billingAddress),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      
      order = draftOrder
      console.log('✅ Draft order created:', {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount
      })
        
    } catch (error) {
      console.error('❌ Failed to create draft order:', error)
      return NextResponse.json(
        { error: 'Failed to create checkout session - please try again' },
        { status: 500 }
      )
    }

    // Return order data for Yoco payment
    return NextResponse.json({
      success: true,
      message: 'Draft order created - proceed to payment',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        trackingNumber: order.trackingNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        items: draftOrderData.items,
        shippingAddress: draftOrderData.shippingAddress
      },
      source: 'draft'
    })

  } catch (error) {
    console.error('❌ Checkout error:', error)
    return NextResponse.json(
      { error: 'Server error during checkout' },
      { status: 500 }
    )
  }
}