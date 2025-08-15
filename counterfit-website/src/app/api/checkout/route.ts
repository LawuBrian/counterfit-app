import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { items, shippingAddress, billingAddress } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    const lineItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        )
      }

      const itemTotal = Number(product.price) * item.quantity
      subtotal += itemTotal

      lineItems.push({
        price_data: {
          currency: 'zar',
          product_data: {
            name: product.name,
            images: product.images.slice(0, 1), // Stripe allows max 8 images
          },
          unit_amount: Math.round(Number(product.price) * 100), // Convert to cents
        },
        quantity: item.quantity,
      })
    }

    // Calculate shipping and tax
    const shipping = subtotal >= 1000 ? 0 : 150
    const tax = Math.round(subtotal * 0.15) // 15% VAT
    const total = subtotal + shipping + tax

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber: `CF-${Date.now()}`,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal: subtotal,
        tax: tax,
        shipping: shipping,
        totalAmount: total,
        shippingAddress: shippingAddress ? {
          create: shippingAddress
        } : undefined,
        billingAddress: billingAddress ? {
          create: billingAddress
        } : undefined,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: Number(item.price),
          }))
        }
      }
    })

    // Add shipping as line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'zar',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: shipping * 100,
        },
        quantity: 1,
      })
    }

    // Add tax as line item
    lineItems.push({
      price_data: {
        currency: 'zar',
        product_data: {
          name: 'VAT (15%)',
        },
        unit_amount: tax * 100,
      },
      quantity: 1,
    })

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      metadata: {
        orderId: order.id,
        userId: session.user.id,
      },
      customer_email: session.user.email || undefined,
      shipping_address_collection: {
        allowed_countries: ['ZA'], // South Africa
      },
    })

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: stripeSession.id }
    })

    return NextResponse.json({
      sessionId: stripeSession.id,
      url: stripeSession.url,
      orderId: order.id,
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
