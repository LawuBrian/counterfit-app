import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Get the category from the query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'products'
    
    // Forward the request to the backend with the category
    const backendResponse = await fetch(`${config.apiUrl}/api/upload/product-image?category=${category}`, {
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
