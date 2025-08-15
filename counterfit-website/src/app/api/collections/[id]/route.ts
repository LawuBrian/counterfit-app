import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // For now, return a simple response
    // This will be replaced when backend is deployed
    return NextResponse.json({
      message: 'Collection endpoint - backend not yet deployed',
      id: id,
      status: 'pending'
    })
  } catch (error) {
    console.error('Collection error:', error)
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}
