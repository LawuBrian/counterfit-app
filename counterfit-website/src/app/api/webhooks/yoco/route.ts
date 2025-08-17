import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const YOCO_WEBHOOK_SECRET = process.env.YOCO_WEBHOOK_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Yoco webhook received')
    
    const body = await request.text()
    const signature = request.headers.get('x-yoco-signature')
    
    console.log('🔔 Webhook body:', body)
    console.log('🔔 Signature:', signature)
    
    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature)) {
      console.error('❌ Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
    
    const event = JSON.parse(body)
    console.log('🔔 Webhook event:', event)
    
    // Handle different event types
    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event)
        break
      case 'payment.failed':
        await handlePaymentFailed(event)
        break
      case 'checkout.completed':
        await handleCheckoutCompleted(event)
        break
      default:
        console.log('🔔 Unhandled event type:', event.type)
    }
    
    return NextResponse.json({ received: true })
    
  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature || !YOCO_WEBHOOK_SECRET) {
    console.warn('⚠️ Missing signature or webhook secret')
    return false
  }
  
  try {
    const expectedSignature = crypto
      .createHmac('sha256', YOCO_WEBHOOK_SECRET)
      .update(payload)
      .digest('hex')
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
    
    console.log('🔐 Signature verification:', isValid ? '✅ Valid' : '❌ Invalid')
    return isValid
    
  } catch (error) {
    console.error('❌ Signature verification error:', error)
    return false
  }
}

async function handlePaymentSucceeded(event: any) {
  console.log('✅ Payment succeeded:', event.data.id)
  
  const { id, amount, currency, metadata } = event.data
  
  // Update order status in your database
  if (metadata?.orderId) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${metadata.orderId}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`
        },
        body: JSON.stringify({
          paymentId: id,
          amount,
          currency,
          status: 'paid'
        })
      })
      
      if (response.ok) {
        console.log('✅ Order payment confirmed in database')
      } else {
        console.error('❌ Failed to confirm order payment')
      }
    } catch (error) {
      console.error('❌ Error confirming order payment:', error)
    }
  }
}

async function handlePaymentFailed(event: any) {
  console.log('❌ Payment failed:', event.data.id)
  
  const { id, metadata } = event.data
  
  // Update order status to failed
  if (metadata?.orderId) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${metadata.orderId}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`
        },
        body: JSON.stringify({
          status: 'payment_failed',
          paymentId: id
        })
      })
      
      if (response.ok) {
        console.log('✅ Order status updated to payment failed')
      } else {
        console.error('❌ Failed to update order status')
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error)
    }
  }
}

async function handleCheckoutCompleted(event: any) {
  console.log('✅ Checkout completed:', event.data.id)
  
  const { id, amount, currency, metadata } = event.data
  
  // This event is fired when checkout is completed but payment might still be processing
  // You can use this to update order status to 'pending_payment'
  if (metadata?.orderId) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/orders/${metadata.orderId}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`
        },
        body: JSON.stringify({
          status: 'pending_payment',
          checkoutId: id
        })
      })
      
      if (response.ok) {
        console.log('✅ Order status updated to pending payment')
      } else {
        console.error('❌ Failed to update order status')
      }
    } catch (error) {
      console.error('❌ Error updating order status:', error)
    }
  }
}
