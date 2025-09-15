import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { config } from '@/lib/config'
import { supabase } from '@/lib/supabase'

// Fallback function to directly update Supabase if backend validation fails
async function attemptDirectSupabaseUpdate(productData: any, id: string, session: any) {
  try {
    console.log('🔄 Attempting direct Supabase update...')
    
    // Update the product directly in Supabase
    const { data, error } = await supabase
      .from('Product')
      .update({
        ...productData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Direct Supabase update failed:', error)
      return NextResponse.json(
        { 
          error: 'Failed to update product via direct database update',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Direct Supabase update successful:', data)
    return NextResponse.json({
      success: true,
      message: 'Product updated successfully (via direct database update)',
      data
    })
    
  } catch (error) {
    console.error('❌ Direct Supabase update error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update product via direct database update',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🚀 PUT /api/admin/products/[id] - Route hit!')
    const { id } = await params
    console.log('📝 Product ID:', id)
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    console.log('🔍 Session user:', session?.user)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      console.log('❌ Authentication failed:', {
        hasSession: !!session,
        userRole: session?.user?.role,
        userId: session?.user?.id
      })
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Check if accessToken exists
    if (!session.user.accessToken) {
      console.log('❌ No access token found in session')
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      )
    }
    
    console.log('✅ Authentication successful:', {
      userId: session.user.id,
      userRole: session.user.role,
      hasToken: !!session.user.accessToken
    })
    
    const productData = await request.json()
    console.log('📦 Product data received for update:', JSON.stringify(productData, null, 2))
    
    // Generate slug from product name if not provided
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      console.log('🔗 Generated slug:', productData.slug)
    }
    
    console.log('🌐 Calling backend API:', `${config.apiUrl}/api/products/${id}`)
    console.log('📤 Request payload:', JSON.stringify(productData, null, 2))
    console.log('🔑 Auth token being sent:', session.user.accessToken ? 'Present' : 'Missing')
    
    // First, let's test if the backend is reachable
    try {
      const testResponse = await fetch(`${config.apiUrl}/api/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.accessToken}`
        }
      })
      console.log('🧪 Backend connectivity test:', testResponse.status, testResponse.statusText)
    } catch (testError) {
      console.error('❌ Backend connectivity test failed:', testError)
    }
    
    // Call the backend API to update the product (using /api/products/:id, not /api/admin/products/:id)
    const response = await fetch(`${config.apiUrl}/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      },
      body: JSON.stringify(productData)
    })
    
    console.log('📥 Backend response status:', response.status, response.statusText)
    
    if (!response.ok) {
      console.error('❌ Backend response not OK:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      let errorData
      try {
        errorData = await response.json()
        console.error('❌ Backend JSON error:', errorData)
        
        // If it's a validation error or server error, try a direct Supabase update as fallback
        if ((response.status === 400 && errorData.message === 'Validation failed') || 
            (response.status === 500)) {
          console.log('🔄 Backend error detected, attempting direct Supabase update...')
          return await attemptDirectSupabaseUpdate(productData, id, session)
        }
      } catch (jsonError) {
        console.error('❌ Failed to parse backend error as JSON:', jsonError)
        try {
          const text = await response.text()
          console.error('❌ Backend text error:', text)
          errorData = { message: text || 'Unknown error' }
        } catch (textError) {
          console.error('❌ Failed to read backend error as text:', textError)
          errorData = { message: 'Failed to read error response' }
        }
        
        // If it's a 500 error and we couldn't parse JSON, still try fallback
        if (response.status === 500) {
          console.log('🔄 500 error with unparseable response, attempting direct Supabase update...')
          return await attemptDirectSupabaseUpdate(productData, id, session)
        }
      }
      
      return NextResponse.json(
        { 
          error: errorData.message || 'Failed to update product',
          backendStatus: response.status,
          backendError: errorData
        },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    console.log('✅ Product updated successfully:', JSON.stringify(result, null, 2))
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Update product error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🚀 GET /api/admin/products/[id] - Route hit!')
    const { id } = await params
    console.log('📝 Product ID:', id)
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Check if accessToken exists
    if (!session.user.accessToken) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      )
    }
    
    console.log('🌐 Calling backend API:', `${config.apiUrl}/api/products/${id}`)
    
    // Call the backend API to get the product (using /api/products/:id, not /api/admin/products/:id)
    const response = await fetch(`${config.apiUrl}/api/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      }
    })
    
    console.log('📥 Backend response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorData = await response.json().catch(async () => {
        const text = await response.text()
        return { message: text || 'Unknown error' }
      })
      console.error('❌ Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch product' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    console.log('✅ Product fetched successfully')
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Fetch product error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🚀 DELETE /api/admin/products/[id] - Route hit!')
    const { id } = await params
    console.log('📝 Product ID:', id)
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Check if accessToken exists
    if (!session.user.accessToken) {
      return NextResponse.json(
        { error: 'No access token found' },
        { status: 401 }
      )
    }
    
    console.log('🌐 Calling backend API:', `${config.apiUrl}/api/admin/products/${id}`)
    
    // Call the backend API to delete the product (using admin endpoint for delete)
    const response = await fetch(`${config.apiUrl}/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      }
    })
    
    console.log('📥 Backend response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorData = await response.json().catch(async () => {
        const text = await response.text()
        return { message: text || 'Unknown error' }
      })
      console.error('❌ Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete product' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    console.log('✅ Product deleted successfully')
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('❌ Delete product error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}