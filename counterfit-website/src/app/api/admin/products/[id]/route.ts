import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:5000'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Call the backend API to get the product
    const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}` // Adjust based on your auth setup
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch product' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Get admin product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    const productData = await request.json()
    
    // Call the backend API to update the product
    const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}` // Adjust based on your auth setup
      },
      body: JSON.stringify(productData)
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to update product' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Update admin product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Call the backend API to delete the product
    const response = await fetch(`${BACKEND_URL}/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}` // Adjust based on your auth setup
      }
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete product' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Delete admin product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
