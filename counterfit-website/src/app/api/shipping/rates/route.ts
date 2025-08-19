import { NextRequest, NextResponse } from 'next/server'
import { getShippingRates, validateSAPostalCode, calculatePackageDetails } from '@/lib/fastway'

export async function POST(request: NextRequest) {
  try {
    console.log('🚚 POST /api/shipping/rates - Route hit!')
    
    const { 
      postalCode, 
      items,
      packageWeight,
      packageDimensions 
    } = await request.json()

    // Validate postal code
    if (!postalCode || !validateSAPostalCode(postalCode)) {
      return NextResponse.json(
        { error: 'Invalid postal code format. Please enter a 4-digit South African postal code.' },
        { status: 400 }
      )
    }

    // Calculate package details if not provided
    let finalPackageWeight = packageWeight
    let finalPackageDimensions = packageDimensions

    if (!finalPackageWeight || !finalPackageDimensions) {
      const calculated = calculatePackageDetails(items || [])
      finalPackageWeight = calculated.weight
      finalPackageDimensions = calculated.dimensions
    }

    console.log('📦 Package details:', {
      weight: finalPackageWeight,
      dimensions: finalPackageDimensions,
      postalCode
    })

    // Get shipping rates from Fastway
    const rates = await getShippingRates(
      postalCode,
      finalPackageWeight,
      finalPackageDimensions
    )

    console.log('✅ Shipping rates calculated:', rates)

    return NextResponse.json({
      success: true,
      rates,
      packageDetails: {
        weight: finalPackageWeight,
        dimensions: finalPackageDimensions
      }
    })

  } catch (error) {
    console.error('❌ Shipping rates API error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates. Please try again.' },
      { status: 500 }
    )
  }
}
