import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({
        error: 'No session found',
        success: false
      }, { status: 401 })
    }

    console.log('🔄 Creating user from session:', {
      userId: session.user.id,
      email: session.user.email,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role
    })

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('User')
      .select('id, email')
      .eq('id', session.user.id)
      .single()

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: existingUser,
        action: 'none'
      })
    }

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error checking user:', checkError)
      return NextResponse.json({
        error: 'Database error while checking user',
        success: false
      }, { status: 500 })
    }

    // Create the user in Supabase
    const { data: newUser, error: createError } = await supabase
      .from('User')
      .insert([{
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role || 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select('id, email, firstName, lastName, role, createdAt')
      .single()

    if (createError) {
      console.error('❌ Error creating user:', createError)
      return NextResponse.json({
        error: 'Failed to create user',
        details: createError.message,
        success: false
      }, { status: 500 })
    }

    console.log('✅ User created successfully:', newUser)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser,
      action: 'created'
    })

  } catch (error: any) {
    console.error('Create user API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error.message,
      success: false
    }, { status: 500 })
  }
}

