import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Forward the request to the backend
    const backendResponse = await fetch(`${config.apiUrl}/api/upload/product-image`, {
      method: 'POST',
      body: formData,
    })

    const data = await backendResponse.json()

    if (!backendResponse.ok) {
      return NextResponse.json(data, { status: backendResponse.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Upload proxy error:', error)
    return NextResponse.json(
      { success: false, message: 'Upload failed' },
      { status: 500 }
    )
  }
}

// Configure the route to handle larger files
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds timeout
