import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Fetching wishlist for user:', session.user.id)

    // Forward request to backend with proper authentication
    const response = await fetch(`${BACKEND_URL}/api/users/wishlist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      }
    })

    console.log('📥 Backend wishlist fetch response status:', response.status)

    const data = await response.json()
    console.log('📄 Backend wishlist fetch response:', data)

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Failed to fetch wishlist' }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Wishlist API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
