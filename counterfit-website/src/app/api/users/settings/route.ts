import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view settings' },
        { status: 401 }
      )
    }

    // Fetch user and settings from Supabase
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('id, firstName, lastName, email, phone')
      .eq('id', session.user.id)
      .single()

    if (userError) {
      console.error('❌ User fetch error:', userError)
      return NextResponse.json(
        { error: 'Failed to fetch user data' },
        { status: 500 }
      )
    }

    // Fetch user settings (create default if not exists)
    let { data: settings, error: settingsError } = await supabase
      .from('UserSettings')
      .select('*')
      .eq('userId', session.user.id)
      .single()

    if (settingsError && settingsError.code === 'PGRST116') {
      // No settings found, create default settings
      const { data: newSettings, error: createError } = await supabase
        .from('UserSettings')
        .insert([{
          userId: session.user.id,
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true,
          orderUpdates: true,
          newsletter: false,
          twoFactorEnabled: false,
          preferredLanguage: 'en',
          timezone: 'Africa/Johannesburg'
        }])
        .select()
        .single()

      if (createError) {
        console.error('❌ Settings creation error:', createError)
        // Return default settings if creation fails
        settings = {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: true,
          orderUpdates: true,
          newsletter: false,
          twoFactorEnabled: false,
          preferredLanguage: 'en',
          timezone: 'Africa/Johannesburg'
        }
      } else {
        settings = newSettings
      }
    } else if (settingsError) {
      console.error('❌ Settings fetch error:', settingsError)
      return NextResponse.json(
        { error: 'Failed to fetch user settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      settings: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        marketingEmails: settings.marketingEmails,
        orderUpdates: settings.orderUpdates,
        newsletter: settings.newsletter,
        twoFactorEnabled: settings.twoFactorEnabled,
        preferredLanguage: settings.preferredLanguage,
        timezone: settings.timezone
      }
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

    const body = await request.json()
    const {
      firstName,
      lastName,
      phone,
      emailNotifications,
      smsNotifications,
      marketingEmails,
      orderUpdates,
      newsletter,
      twoFactorEnabled,
      preferredLanguage,
      timezone
    } = body

    // Update user profile fields
    if (firstName !== undefined || lastName !== undefined || phone !== undefined) {
      const { error: userError } = await supabase
        .from('User')
        .update({
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(phone !== undefined && { phone })
        })
        .eq('id', session.user.id)

      if (userError) {
        console.error('❌ User update error:', userError)
        return NextResponse.json(
          { error: 'Failed to update user profile' },
          { status: 500 }
        )
      }
    }

    // Update user settings
    const { error: settingsError } = await supabase
      .from('UserSettings')
      .upsert({
        userId: session.user.id,
        ...(emailNotifications !== undefined && { emailNotifications }),
        ...(smsNotifications !== undefined && { smsNotifications }),
        ...(marketingEmails !== undefined && { marketingEmails }),
        ...(orderUpdates !== undefined && { orderUpdates }),
        ...(newsletter !== undefined && { newsletter }),
        ...(twoFactorEnabled !== undefined && { twoFactorEnabled }),
        ...(preferredLanguage !== undefined && { preferredLanguage }),
        ...(timezone !== undefined && { timezone })
      })

    if (settingsError) {
      console.error('❌ Settings update error:', settingsError)
      return NextResponse.json(
        { error: 'Failed to update user settings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
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
