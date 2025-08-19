import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createShipment, validateSAPostalCode } from '@/lib/fastway'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(request: NextRequest) {
  try {
    console.log('📦 POST /api/shipping/create-shipment - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to create shipment' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    const { 
      orderId,
      orderNumber,
      recipientName,
      recipientPhone,
      recipientEmail,
      recipientAddress,
      recipientCity,
      recipientPostalCode,
      recipientCountry = 'ZA',
      packageWeight,
      packageDimensions,
      packageDescription
    } = await request.json()

    // Validate required fields
    if (!orderId || !orderNumber || !recipientName || !recipientPhone || !recipientEmail || 
        !recipientAddress || !recipientCity || !recipientPostalCode) {
      return NextResponse.json(
        { error: 'Missing required recipient information' },
        { status: 400 }
      )
    }

    // Validate postal code
    if (!validateSAPostalCode(recipientPostalCode)) {
      return NextResponse.json(
        { error: 'Invalid postal code format. Please enter a 4-digit South African postal code.' },
        { status: 400 }
      )
    }

    // Create shipment data
    const shipmentData = {
      recipientName,
      recipientPhone,
      recipientEmail,
      recipientAddress,
      recipientCity,
      recipientPostalCode,
      recipientCountry,
      packageWeight: packageWeight || 0.5,
      packageLength: packageDimensions?.length || 30,
      packageWidth: packageDimensions?.width || 20,
      packageHeight: packageDimensions?.height || 10,
      packageDescription: packageDescription || `Order ${orderNumber}`,
      orderNumber,
      orderId
    }

    console.log('📦 Creating shipment with data:', shipmentData)

    // Create shipment in Fastway
    const shipment = await createShipment(shipmentData)

    // Update order in backend with shipment details
    const updateResponse = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        trackingNumber: shipment.trackingNumber,
        carrier: 'Fastway',
        estimatedDelivery: shipment.estimatedDelivery,
        status: 'shipped',
        shipmentId: shipment.id,
        shippingCost: shipment.cost
      })
    })

    if (!updateResponse.ok) {
      console.warn('⚠️ Failed to update order with shipment details, but shipment was created')
    } else {
      console.log('✅ Order updated with shipment details')
    }

    return NextResponse.json({
      success: true,
      message: 'Shipment created successfully',
      shipment: {
        id: shipment.id,
        trackingNumber: shipment.trackingNumber,
        labelUrl: shipment.labelUrl,
        estimatedDelivery: shipment.estimatedDelivery,
        cost: shipment.cost,
        status: shipment.status
      }
    })

  } catch (error) {
    console.error('❌ Shipment creation error:', error)
    
    if (error instanceof Error && error.message.includes('Fastway')) {
      return NextResponse.json(
        { error: 'Failed to create shipment with courier. Please try again later.' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create shipment. Please try again.' },
      { status: 500 }
    )
  }
}
