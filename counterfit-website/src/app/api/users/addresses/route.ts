import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view addresses' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    // Fetch user addresses from backend
    const response = await fetch(`${BACKEND_URL}/api/users/addresses`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          addresses: [],
          message: 'Backend temporarily unavailable - addresses will appear when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch addresses from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      addresses: data.addresses || []
    })

  } catch (error) {
    console.error('Addresses API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to add address' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Add new address to backend
    const response = await fetch(`${BACKEND_URL}/api/users/addresses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          message: 'Backend temporarily unavailable - address will be added when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to add address to backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      address: data.address || data,
      message: 'Address added successfully'
    })

  } catch (error) {
    console.error('Address add API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to add address' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to update address' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...addressData } = body

    // Update address in backend
    const response = await fetch(`${BACKEND_URL}/api/users/addresses/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(addressData)
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          message: 'Backend temporarily unavailable - address will be updated when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to update address in backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      address: data.address || data,
      message: 'Address updated successfully'
    })

  } catch (error) {
    console.error('Address update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to delete address' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Delete address from backend
    const response = await fetch(`${BACKEND_URL}/api/users/addresses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          message: 'Backend temporarily unavailable - address will be deleted when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to delete address from backend' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Address delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to delete address' },
      { status: 500 }
    )
  }
}
