import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

// Function to fetch products directly from Supabase as fallback
async function fetchProductsFromSupabase(page: string, limit: string, search: string, category: string, status: string) {
  try {
    console.log('🔄 Fetching products directly from Supabase...')
    
    let query = supabase
      .from('Product')
      .select('*')
      .order('createdAt', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (category) {
      query = query.eq('category', category)
    }
    if (status) {
      query = query.eq('status', status)
    }

    // Apply pagination
    const pageNum = parseInt(page) || 1
    const limitNum = parseInt(limit) || 10
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum - 1

    query = query.range(from, to)

    const { data: products, error, count } = await query

    if (error) throw error

    console.log('✅ Supabase products fetched:', products?.length || 0)
    return {
      products: products || [],
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        pages: Math.ceil((count || 0) / limitNum)
      }
    }
  } catch (error) {
    console.error('❌ Failed to fetch products from Supabase:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/admin/products - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    console.log('🔍 Session object:', JSON.stringify(session, null, 2))
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
      hasToken: !!session.user.accessToken,
      tokenPreview: session.user.accessToken.substring(0, 20) + '...'
    })
    
    const productData = await request.json()
    console.log('📦 Product data received:', JSON.stringify(productData, null, 2))
    console.log('🖼️ Images in product data:', productData.images)
    
    // Generate slug from product name if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      console.log('🔗 Generated slug:', productData.slug)
    }
    
    console.log('🌐 Calling backend API:', `${BACKEND_URL}/api/admin/products`)
    console.log('📤 Request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.user.accessToken.substring(0, 20)}...`
    })
    
    // Call the backend API to create the product
    const response = await fetch(`${BACKEND_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.accessToken}`
      },
      body: JSON.stringify(productData)
    })
    
    console.log('📥 Backend response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ Backend error:', errorData)
      return NextResponse.json(
        { error: errorData.message || 'Failed to create product' },
        { status: response.status }
      )
    }
    
    const result = await response.json()
    console.log('✅ Product created successfully:', JSON.stringify(result, null, 2))
    
    return NextResponse.json(result)

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 GET /api/admin/products - Route hit!')
    
    // Get session for authentication
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
    
    // Try backend first, fallback to Supabase
    try {
      if (session.user?.accessToken) {
        console.log('🌐 Trying backend API first...')
        
        // Build query string
        const queryParams = new URLSearchParams()
        if (page) queryParams.append('page', page)
        if (limit) queryParams.append('limit', limit)
        if (search) queryParams.append('search', search)
        if (category) queryParams.append('category', category)
        if (status) queryParams.append('status', status)

        const queryString = queryParams.toString()

        const response = await fetch(`${BACKEND_URL}/api/admin/products${queryString ? `?${queryString}` : ''}`, {
          headers: {
            'Authorization': `Bearer ${session.user.accessToken}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          let result
          try {
            result = await response.json()
          } catch (jsonError) {
            console.error('❌ Failed to parse backend response:', jsonError)
            throw new Error('Backend response parsing failed')
          }
          
          console.log('✅ Admin products fetched from backend')
          
          // Transform backend data to expected format
          const transformedResult = {
            products: result.data || [],
            pagination: result.pagination || {
              page: parseInt(page) || 1,
              limit: parseInt(limit) || 10,
              total: 0,
              pages: 0
            }
          }
          
          return NextResponse.json({
            ...transformedResult,
            source: 'backend'
          })
        } else {
          console.warn('⚠️ Backend returned error:', response.status, response.statusText)
          throw new Error(`Backend error: ${response.status}`)
        }
      } else {
        throw new Error('No access token available')
      }
    } catch (backendError) {
      console.warn('⚠️ Backend failed, falling back to Supabase:', backendError)
      
      // Fallback to Supabase
      try {
        const result = await fetchProductsFromSupabase(page, limit, search, category, status)
        return NextResponse.json({
          ...result,
          message: 'Products loaded from database (backend unavailable)',
          source: 'supabase'
        })
      } catch (supabaseError) {
        console.error('❌ Both backend and Supabase failed:', supabaseError)
        return NextResponse.json({
          products: [],
          pagination: {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            total: 0,
            pages: 0
          },
          message: 'Unable to load products - both backend and database are unavailable',
          source: 'none'
        })
      }
    }

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
