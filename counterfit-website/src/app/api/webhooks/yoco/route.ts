import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, validateWebhookTimestamp } from '@/lib/yoco'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Yoco webhook received')
    
    // Get headers for verification
    const webhookSignature = request.headers.get('webhook-signature')
    const webhookId = request.headers.get('webhook-id')
    const webhookTimestamp = request.headers.get('webhook-timestamp')
    
    if (!webhookSignature || !webhookId || !webhookTimestamp) {
      console.error('❌ Missing webhook headers')
      return NextResponse.json(
        { error: 'Missing required webhook headers' },
        { status: 400 }
      )
    }

    // Get raw body for signature verification
    const rawBody = await request.text()
    const body = JSON.parse(rawBody)
    
    console.log('📦 Webhook payload:', JSON.stringify(body, null, 2))
    
    // Verify webhook signature
    const isValidSignature = verifyWebhookSignature(
      webhookId,
      webhookTimestamp,
      rawBody,
      webhookSignature
    )
    
    if (!isValidSignature) {
      console.error('❌ Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      )
    }
    
    // Validate timestamp to prevent replay attacks
    const isValidTimestamp = validateWebhookTimestamp(webhookTimestamp)
    
    if (!isValidTimestamp) {
      console.error('❌ Invalid webhook timestamp')
      return NextResponse.json(
        { error: 'Invalid webhook timestamp' },
        { status: 401 }
      )
    }
    
    console.log('✅ Webhook verification passed')
    
    // Process the webhook based on event type
    const { type, data } = body
    
    switch (type) {
      case 'checkout.payment.succeeded':
        await handlePaymentSucceeded(data)
        break
        
      case 'checkout.payment.failed':
        await handlePaymentFailed(data)
        break
        
      case 'checkout.payment.cancelled':
        await handlePaymentCancelled(data)
        break
        
      default:
        console.log(`ℹ️ Unhandled webhook type: ${type}`)
    }
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(data: any) {
  try {
    console.log('✅ Processing payment success:', data)
    
    const { id: paymentId, metadata } = data
    const { orderId, orderNumber } = metadata || {}
    
    if (!orderId) {
      console.error('❌ No orderId in payment metadata')
      return
    }
    
    // ⚠️ IMPORTANT: Convert draft order to real order when payment succeeds
    try {
      const { supabase } = await import('@/lib/supabase')
      
      // Get the draft order
      const { data: draftOrder, error: fetchError } = await supabase
        .from('Order')
        .select('*')
        .eq('id', orderId)
        .single()
      
      if (fetchError || !draftOrder) {
        console.error('❌ Draft order not found:', orderId)
        return
      }
      
      console.log('📋 Converting draft order to real order:', draftOrder.orderNumber)
      
      // Create real order with payment confirmation
      const realOrderData = {
        ...draftOrder,
        id: draftOrder.userId + '-' + Date.now(), // New real order ID
        status: 'confirmed', // Confirmed status for paid orders
        paymentStatus: 'paid',
        paymentId: paymentId,
        updatedAt: new Date().toISOString()
      }
      
      // Insert the real order
      const { data: realOrder, error: insertError } = await supabase
        .from('Order')
        .insert([realOrderData])
        .select()
        .single()
      
      if (insertError) {
        console.error('❌ Failed to create real order:', insertError)
        return
      }
      
      // Delete the draft order
      await supabase
        .from('Order')
        .delete()
        .eq('id', orderId)
      
      console.log('✅ Order converted successfully:', {
        draftId: orderId,
        realId: realOrder.id,
        orderNumber: realOrder.orderNumber,
        paymentId: paymentId
      })
      
      // Send payment confirmation email
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/emails/payment-confirmation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: realOrder.id,
            orderNumber: realOrder.orderNumber,
            paymentId
          })
        })
        console.log('✅ Payment confirmation email sent')
      } catch (emailError) {
        console.warn('⚠️ Failed to send payment confirmation email:', emailError)
      }
      
    } catch (supabaseError) {
      console.error('❌ Error converting draft to real order:', supabaseError)
      
      // Fallback: try to update existing order
      const updateResponse = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': process.env.YOCO_WEBHOOK_SECRET || ''
        },
        body: JSON.stringify({
          paymentStatus: 'paid',
          paymentId: paymentId,
          status: 'confirmed',
          updatedAt: new Date().toISOString()
        })
      })
      
      if (updateResponse.ok) {
        console.log('✅ Fallback: Order payment status updated via backend')
      } else {
        console.error('❌ Both Supabase and backend update failed')
      }
    }
    
  } catch (error) {
    console.error('❌ Error handling payment success:', error)
  }
}

async function handlePaymentFailed(data: any) {
  try {
    console.log('❌ Processing payment failure:', data)
    
    const { metadata } = data
    const { orderId } = metadata || {}
    
    if (!orderId) {
      console.error('❌ No orderId in payment metadata')
      return
    }
    
    // Update order status in backend
    const updateResponse = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.YOCO_WEBHOOK_SECRET || ''
      },
      body: JSON.stringify({
        paymentStatus: 'failed',
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      })
    })
    
    if (updateResponse.ok) {
      console.log('✅ Order payment failure status updated')
    } else {
      console.error('❌ Failed to update order payment failure status')
    }
    
  } catch (error) {
    console.error('❌ Error handling payment failure:', error)
  }
}

async function handlePaymentCancelled(data: any) {
  try {
    console.log('❌ Processing payment cancellation:', data)
    
    const { metadata } = data
    const { orderId } = metadata || {}
    
    if (!orderId) {
      console.error('❌ No orderId in payment metadata')
      return
    }
    
    // Update order status in backend
    const updateResponse = await fetch(`${BACKEND_URL}/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.YOCO_WEBHOOK_SECRET || ''
      },
      body: JSON.stringify({
        paymentStatus: 'cancelled',
        status: 'cancelled',
        updatedAt: new Date().toISOString()
      })
    })
    
    if (updateResponse.ok) {
      console.log('✅ Order cancellation status updated')
    } else {
      console.error('❌ Failed to update order cancellation status')
    }
    
  } catch (error) {
    console.error('❌ Error handling payment cancellation:', error)
  }
}