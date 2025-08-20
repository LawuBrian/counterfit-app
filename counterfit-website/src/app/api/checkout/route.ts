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

    // Try to create order in backend first, fallback to Supabase
    let order
    let orderSource = 'backend'
    
    try {
      console.log('🌐 Trying to create order in backend...')
      const response = await fetch(`${BACKEND_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const backendOrder = await response.json()
        order = backendOrder.data || backendOrder.order || backendOrder
        console.log('✅ Order created in backend:', JSON.stringify(order, null, 2))
      } else {
        throw new Error(`Backend error: ${response.status}`)
      }
    } catch (backendError) {
      console.warn('⚠️ Backend failed, creating order directly in Supabase:', backendError)
      
      // Fallback to Supabase
      try {
        const { supabase } = await import('@/lib/supabase')
        
        // Create order in Supabase
        const { data: supabaseOrder, error } = await supabase
          .from('Order')
          .insert([{
            id: orderData.userId + '-' + Date.now(), // Generate unique ID
            orderNumber: orderData.orderNumber,
            status: orderData.status,
            totalAmount: orderData.totalAmount,
            subtotal: orderData.totalAmount,
            tax: 0,
            shipping: 0,
            paymentStatus: orderData.paymentStatus,
            paymentId: null,
            trackingNumber: orderData.trackingNumber,
            carrier: orderData.carrier,
            notes: orderData.notes,
            paymentMethod: orderData.paymentMethod,
            userId: orderData.userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }])
          .select()
          .single()

        if (error) throw error
        
        // Create shipping address
        await supabase
          .from('ShippingAddress')
          .insert([{
            firstName: orderData.shippingAddress.firstName,
            lastName: orderData.shippingAddress.lastName,
            address1: orderData.shippingAddress.address,
            city: orderData.shippingAddress.city,
            province: orderData.shippingAddress.state,
            postalCode: orderData.shippingAddress.postalCode,
            country: orderData.shippingAddress.country,
            phone: orderData.shippingAddress.phone,
            orderId: supabaseOrder.id
          }])

        // Create order items
        for (const item of orderData.items) {
          await supabase
            .from('OrderItem')
            .insert([{
              quantity: item.quantity,
              price: item.price,
              orderId: supabaseOrder.id,
              productId: item.id
            }])
        }

        order = {
          id: supabaseOrder.id,
          orderNumber: supabaseOrder.orderNumber,
          totalAmount: supabaseOrder.totalAmount,
          trackingNumber: orderData.trackingNumber,
          status: supabaseOrder.status,
          paymentStatus: supabaseOrder.paymentStatus
        }
        
        orderSource = 'supabase'
        console.log('✅ Order created in Supabase:', JSON.stringify(order, null, 2))
      } catch (supabaseError) {
        console.error('❌ Both backend and Supabase failed:', supabaseError)
        return NextResponse.json(
          { error: 'Failed to create order - both backend and database are unavailable' },
          { status: 500 }
        )
      }
    }

    // Return order data for Yoco payment
    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        trackingNumber: order.trackingNumber
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
