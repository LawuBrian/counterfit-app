import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/admin/products - Route hit!')
    
    // Temporarily skip auth to test if route works
    const productData = await request.json()
    console.log('Product data received:', productData)
    
    return NextResponse.json({
      success: true,
      message: 'Route working - auth temporarily disabled',
      data: productData
    })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/admin/products - Route hit!')
    
    return NextResponse.json({
      success: true,
      message: 'GET route working'
    })

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
