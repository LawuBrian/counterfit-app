import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        error: 'No session found',
        sessionExists: false
      })
    }

    console.log('🔍 Session Data:', {
      userId: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role,
      accessTokenExists: !!session.user.accessToken
    })

    // Check if user exists in Supabase directly
    const { data: userInSupabase, error: supabaseError } = await supabase
      .from('User')
      .select('id, email, firstName, lastName, role, createdAt')
      .eq('id', session.user.id)
      .single()

    console.log('🔍 Supabase User Query Result:', {
      found: !!userInSupabase,
      error: supabaseError,
      user: userInSupabase
    })

    // Check if user exists by email
    const { data: userByEmail, error: emailError } = await supabase
      .from('User')
      .select('id, email, firstName, lastName, role, createdAt')
      .eq('email', session.user.email)

    console.log('🔍 Supabase User by Email:', {
      found: userByEmail?.length > 0,
      count: userByEmail?.length || 0,
      error: emailError,
      users: userByEmail
    })

    // Test backend connectivity
    let backendUser = null
    let backendError = null

    if (session.user.accessToken) {
      try {
        const response = await fetch(`${BACKEND_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          backendUser = await response.json()
          console.log('🔍 Backend User Response:', backendUser)
        } else {
          const errorText = await response.text()
          backendError = {
            status: response.status,
            message: errorText
          }
          console.log('🔍 Backend Error:', backendError)
        }
      } catch (fetchError: any) {
        backendError = {
          message: fetchError.message,
          type: 'fetch_error'
        }
        console.log('🔍 Backend Fetch Error:', backendError)
      }
    }

    return NextResponse.json({
      session: {
        userId: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role,
        accessTokenExists: !!session.user.accessToken
      },
      supabase: {
        userById: {
          found: !!userInSupabase,
          data: userInSupabase,
          error: supabaseError
        },
        userByEmail: {
          found: userByEmail?.length > 0,
          count: userByEmail?.length || 0,
          data: userByEmail,
          error: emailError
        }
      },
      backend: {
        userProfile: backendUser,
        error: backendError
      }
    })

  } catch (error: any) {
    console.error('Debug API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message
    }, { status: 500 })
  }
}
