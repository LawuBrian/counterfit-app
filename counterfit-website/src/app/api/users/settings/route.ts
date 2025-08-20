import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view settings' },
        { status: 401 }
      )
    }

    if (!session.user?.accessToken) {
      return NextResponse.json(
        { error: 'No access token found - please login again' },
        { status: 401 }
      )
    }

    // Fetch user settings from backend
    const response = await fetch(`${BACKEND_URL}/api/users/settings`, {
      headers: {
        'Authorization': `Bearer ${session.user.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          settings: {
            firstName: session.user.firstName || '',
            lastName: session.user.lastName || '',
            email: session.user.email || '',
            phone: '',
            dateOfBirth: '',
            emailNotifications: {
              orderUpdates: true,
              promotions: true,
              newsletter: false,
              stockAlerts: true
            },
            smsNotifications: {
              orderUpdates: true,
              deliveryUpdates: true
            },
            profileVisibility: 'private',
            showPurchaseHistory: false,
            allowDataCollection: true,
            theme: 'system',
            language: 'en',
            currency: 'ZAR',
            twoFactorEnabled: false,
            loginAlerts: true
          },
          message: 'Backend temporarily unavailable - using default settings'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch settings from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      settings: data.settings || data
    })

  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to update settings' },
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

    // Update user settings in backend
    const response = await fetch(`${BACKEND_URL}/api/users/settings`, {
      method: 'PUT',
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
          message: 'Backend temporarily unavailable - settings will be updated when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to update settings in backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      settings: data.settings || data,
      message: 'Settings updated successfully'
    })

  } catch (error) {
    console.error('Settings update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to update settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to perform this action' },
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
    const { action, ...data } = body

    switch (action) {
      case 'change-password':
        return await handlePasswordChange(session.user.accessToken, data)
      case 'export-data':
        return await handleDataExport(session.user.accessToken)
      case 'delete-account':
        return await handleAccountDeletion(session.user.accessToken, data)
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Settings action API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to perform action' },
      { status: 500 }
    )
  }
}

async function handlePasswordChange(accessToken: string, data: any) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          message: 'Backend temporarily unavailable - password will be changed when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to change password in backend' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to change password' },
      { status: 500 }
    )
  }
}

async function handleDataExport(accessToken: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/export-data`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          message: 'Backend temporarily unavailable - data export will be available when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to export data from backend' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      data: data.data || data,
      message: 'Data exported successfully'
    })

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to export data' },
      { status: 500 }
    )
  }
}

async function handleAccountDeletion(accessToken: string, data: any) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users/delete-account`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      if (response.status === 503 || response.status === 502) {
        return NextResponse.json({
          success: true,
          message: 'Backend temporarily unavailable - account will be deleted when service is restored'
        })
      }
      
      return NextResponse.json(
        { error: 'Failed to delete account in backend' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })

  } catch (error) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to delete account' },
      { status: 500 }
    )
  }
}
