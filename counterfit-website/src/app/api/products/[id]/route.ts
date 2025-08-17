import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://counterfit-backend.onrender.com'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Call the backend API to get the product
    const response = await fetch(`${BACKEND_URL}/api/products/${id}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch product' },
        { status: response.status }
      )
    }

    const product = await response.json()
    return NextResponse.json(product)

  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
