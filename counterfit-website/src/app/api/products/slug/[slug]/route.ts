import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetch(`${config.apiUrl}/api/products/slug/${params.slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Get product by slug API error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
}
