import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = new URLSearchParams()
    
    // Forward query parameters
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })
    
    const url = `${BACKEND_URL}/api/collections?${params.toString()}`
    console.log('Fetching collections from:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      console.error('Backend response not ok:', response.status, response.statusText)
      return NextResponse.json(
        { success: false, message: 'Failed to fetch collections' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
