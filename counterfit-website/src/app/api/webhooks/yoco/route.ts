import { NextRequest, NextResponse } from 'next/server'
import { 
  verifyWebhookSignature, 
  validateWebhookTimestamp 
} from '@/lib/yoco'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'
const BACKEND_API_KEY = process.env.BACKEND_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 YOCO webhook received')
    
    // Get raw body for signature verification
    const body = await request.text()
    
    // Extract webhook headers
    const webhookId = request.headers.get('webhook-id')
    const webhookTimestamp = request.headers.get('webhook-timestamp')
    const webhookSignature = request.headers.get('webhook-signature')
    
    console.log('🔔 Webhook ID:', webhookId)
    console.log('🔔 Webhook Timestamp:', webhookTimestamp)
    console.log('🔔 Webhook Signature:', webhookSignature)
    console.log('🔔 Webhook Body:', body)
    
    // Validate required headers
    if (!webhookId || !webhookTimestamp || !webhookSignature) {
      console.error('❌ Missing required webhook headers')
      return NextResponse.json(
        { error: 'Missing required webhook headers' },
        { status: 400 }
      )
    }
    
    // Validate timestamp to prevent replay attacks
    if (!validateWebhookTimestamp(webhookTimestamp)) {
      console.error('❌ Webhook timestamp validation failed')
      return NextResponse.json(
        { error: 'Webhook timestamp validation failed' },
        { status: 400 }
      )
    }
    
    // Verify webhook signature
    if (!verifyWebhookSignature(webhookId, webhookTimestamp, body, webhookSignature)) {
      console.error('❌ Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }
    
    // Parse webhook event
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
      case 'refund.succeeded':
        await handleRefundSucceeded(event)
        break
      case 'refund.failed':
        await handleRefundFailed(event)
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

async function handlePaymentSucceeded(event: any) {
  console.log('✅ Payment succeeded:', event.data.id)
  
  const { id, amount, currency, metadata } = event.data
  
  // Update order status in your database
  if (metadata?.orderId) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/${metadata.orderId}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BACKEND_API_KEY}`
        },
        body: JSON.stringify({
          paymentId: id,
          amount,
          currency,
          status: 'paid',
          paymentMethod: 'yoco'
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
      const response = await fetch(`${BACKEND_URL}/api/orders/${metadata.orderId}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BACKEND_API_KEY}`
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
      const response = await fetch(`${BACKEND_URL}/api/orders/${metadata.orderId}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BACKEND_API_KEY}`
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

async function handleRefundSucceeded(event: any) {
  console.log('✅ Refund succeeded:', event.data.id)
  
  const { id, amount, currency, metadata } = event.data
  
  // Update order status to refunded
  if (metadata?.orderId) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/${metadata.orderId}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BACKEND_API_KEY}`
        },
        body: JSON.stringify({
          status: 'refunded',
          refundId: id,
          refundAmount: amount,
          refundCurrency: currency
        })
      })
      
      if (response.ok) {
        console.log('✅ Order status updated to refunded')
      } else {
        console.error('❌ Failed to update order status to refunded')
      }
    } catch (error) {
      console.error('❌ Error updating order status to refunded:', error)
    }
  }
}

async function handleRefundFailed(event: any) {
  console.log('❌ Refund failed:', event.data.id)
  
  const { id, metadata } = event.data
  
  // Update order status to refund_failed
  if (metadata?.orderId) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/orders/${metadata.orderId}/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BACKEND_API_KEY}`
        },
        body: JSON.stringify({
          status: 'refund_failed',
          refundId: id
        })
      })
      
      if (response.ok) {
        console.log('✅ Order status updated to refund failed')
      } else {
        console.error('❌ Failed to update order status to refund failed')
      }
    } catch (error) {
      console.error('❌ Error updating order status to refund failed:', error)
    }
  }
}
