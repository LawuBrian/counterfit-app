import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

// GET /api/admin/products/featured-order
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔍 Fetching featured products order from Supabase...')

    // Get featured products with their order from Supabase
    const { data: products, error } = await supabase
      .from('Product')
      .select('id, name, images, featured, featuredOrder, status')
      .eq('featured', true)
      .eq('status', 'active')
      .order('featuredOrder', { ascending: true, nullsLast: true })
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch featured products'
      }, { status: 500 })
    }

    console.log('✅ Featured products fetched successfully:', products?.length || 0)

    return NextResponse.json({
      success: true,
      data: products || []
    })
  } catch (error) {
    console.error('Error fetching featured products order:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch featured products order' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/products/featured-order
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { productOrders } = await request.json()

    if (!Array.isArray(productOrders)) {
      return NextResponse.json({
        success: false,
        message: 'Product orders must be an array'
      }, { status: 400 })
    }

    console.log('🔄 Updating featured product order in Supabase...')

    // Update each product's featured order
    const updatePromises = productOrders.map(({ id, featuredOrder }) =>
      supabase
        .from('Product')
        .update({ 
          featuredOrder,
          updatedAt: new Date().toISOString()
        })
        .eq('id', id)
    )

    const results = await Promise.all(updatePromises)
    const errors = results.filter(result => result.error)

    if (errors.length > 0) {
      console.error('❌ Some products failed to update:', errors)
      return NextResponse.json({
        success: false,
        message: 'Some products failed to update',
        errors: errors.map(e => e.error)
      }, { status: 500 })
    }

    console.log('✅ Featured product order updated successfully')

    return NextResponse.json({
      success: true,
      message: 'Featured product order updated successfully'
    })
  } catch (error) {
    console.error('Error updating featured products order:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update featured products order' },
      { status: 500 }
    )
  }
}
