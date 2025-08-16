import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/admin/products - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    console.log('🔍 Session object:', JSON.stringify(session, null, 2))
    console.log('🔍 Session user:', session?.user)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    const productData = await request.json()
    console.log('Product data received:', productData)
    
    // Generate slug from product name if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    // Call the backend API to create the product
    const response = await fetch(`${BACKEND_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      },
      body: JSON.stringify(productData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to create product' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    console.log('Product created successfully:', result)
    
    return NextResponse.json(result)

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
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    // Call the backend API to get products
    const response = await fetch(`${BACKEND_URL}/api/products${queryString ? `?${queryString}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch products' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
