import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    const userId = session.user.id
    console.log('🔍 Testing Supabase access for user:', userId)

    // Test 1: Try to read UserSettings
    const { data: settings, error: settingsError } = await supabase
      .from('UserSettings')
      .select('*')
      .eq('userId', userId)

    // Test 2: Try to read UserAddresses
    const { data: addresses, error: addressesError } = await supabase
      .from('UserAddresses')
      .select('*')
      .eq('userId', userId)

    // Test 3: Try to read UserPaymentMethods
    const { data: paymentMethods, error: paymentError } = await supabase
      .from('UserPaymentMethods')
      .select('*')
      .eq('userId', userId)

    // Test 4: Try to insert a test setting
    const { data: testInsert, error: insertError } = await supabase
      .from('UserSettings')
      .upsert({
        userId: userId,
        emailNotifications: true,
        marketingEmails: false
      })
      .select()

    return NextResponse.json({
      success: true,
      userId,
      tests: {
        settings: {
          data: settings,
          error: settingsError,
          count: settings?.length || 0
        },
        addresses: {
          data: addresses,
          error: addressesError,
          count: addresses?.length || 0
        },
        paymentMethods: {
          data: paymentMethods,
          error: paymentError,
          count: paymentMethods?.length || 0
        },
        testInsert: {
          data: testInsert,
          error: insertError,
          success: !insertError
        }
      }
    })

  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json(
      { error: 'Failed to test Supabase access', details: error.message },
      { status: 500 }
    )
  }
}
