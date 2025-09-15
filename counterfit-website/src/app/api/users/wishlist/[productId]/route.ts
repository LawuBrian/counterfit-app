import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function POST(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const productId = params.productId
    console.log('🔄 Wishlist toggle for product:', productId, 'by user:', session.user.id)

    // Forward request to backend with proper authentication
    const response = await fetch(`${BACKEND_URL}/api/users/wishlist/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      }
    })

    console.log('📥 Backend wishlist response status:', response.status)

    const data = await response.json()
    console.log('📄 Backend wishlist response:', data)

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to update wishlist' }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Wishlist API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
