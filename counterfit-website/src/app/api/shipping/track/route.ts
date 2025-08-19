import { NextRequest, NextResponse } from 'next/server'
import { trackShipment } from '@/lib/fastway'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/shipping/track - Route hit!')
    
    const { searchParams } = new URL(request.url)
    const trackingNumber = searchParams.get('trackingNumber')

    if (!trackingNumber) {
      return NextResponse.json(
        { error: 'Tracking number is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Tracking shipment:', trackingNumber)

    // Track shipment in Fastway
    const tracking = await trackShipment(trackingNumber)

    console.log('✅ Tracking data received:', tracking)

    return NextResponse.json({
      success: true,
      tracking
    })

  } catch (error) {
    console.error('❌ Tracking API error:', error)
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: 'Tracking number not found. Please check the number and try again.' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to track shipment. Please try again later.' },
      { status: 500 }
    )
  }
}
