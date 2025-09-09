import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    // Return session data for debugging (remove sensitive info)
    const debugSession = {
      user: {
        id: session.user.id,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        role: session.user.role,
        hasAccessToken: !!session.user.accessToken,
        accessTokenPreview: session.user.accessToken ? 
          `${session.user.accessToken.substring(0, 10)}...` : 'none'
      }
    }

    return NextResponse.json({
      success: true,
      session: debugSession,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Debug session error:', error)
    return NextResponse.json(
      { error: 'Failed to get session debug info' },
      { status: 500 }
    )
  }
}
