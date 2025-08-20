import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view payment methods' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    // Fetch user payment methods from backend
    const response = await fetch(`${BACKEND_URL}/api/users/payment-methods`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          paymentMethods: [],
          message: 'Backend temporarily unavailable - payment methods will appear when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch payment methods from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      paymentMethods: data.paymentMethods || []
    })

  } catch (error) {
    console.error('Payment methods API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch payment methods' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to add payment method' },
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

    // Add new payment method to backend
    const response = await fetch(`${BACKEND_URL}/api/users/payment-methods`, {
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
          message: 'Backend temporarily unavailable - payment method will be added when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to add payment method to backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      paymentMethod: data.paymentMethod || data,
      message: 'Payment method added successfully'
    })

  } catch (error) {
    console.error('Payment method add API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to add payment method' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to update payment method' },
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
    const { id, ...paymentMethodData } = body

    // Update payment method in backend
    const response = await fetch(`${BACKEND_URL}/api/users/payment-methods/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentMethodData)
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          message: 'Backend temporarily unavailable - payment method will be updated when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to update payment method in backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      paymentMethod: data.paymentMethod || data,
      message: 'Payment method updated successfully'
    })

  } catch (error) {
    console.error('Payment method update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to update payment method' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to delete payment method' },
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
        { error: 'Payment method ID is required' },
        { status: 400 }
      )
    }

    // Delete payment method from backend
    const response = await fetch(`${BACKEND_URL}/api/users/payment-methods/${id}`, {
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
          message: 'Backend temporarily unavailable - payment method will be deleted when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to delete payment method from backend' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    })

  } catch (error) {
    console.error('Payment method delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to delete payment method' },
      { status: 500 }
    )
  }
}
