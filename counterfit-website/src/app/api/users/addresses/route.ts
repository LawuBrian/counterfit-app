import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view addresses' },
        { status: 401 }
      )
    }

    // Fetch user addresses from Supabase
    const { data: addresses, error } = await supabase
      .from('UserAddresses')
      .select('*')
      .eq('userId', session.user.id)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Addresses fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch addresses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      addresses: addresses || []
    })

  } catch (error) {
    console.error('Addresses API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to add addresses' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      type,
      isDefault,
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      province,
      postalCode,
      country,
      phone
    } = body

    // If this is being set as default, unset other defaults of the same type
    if (isDefault) {
      await supabase
        .from('UserAddresses')
        .update({ isDefault: false })
        .eq('userId', session.user.id)
        .eq('type', type)
    }

    // Create new address
    const { data: address, error } = await supabase
      .from('UserAddresses')
      .insert([{
        userId: session.user.id,
        type,
        isDefault: isDefault || false,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        province,
        postalCode,
        country: country || 'South Africa',
        phone
      }])
      .select()
      .single()

    if (error) {
      console.error('❌ Address creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create address' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      address,
      message: 'Address created successfully'
    })

  } catch (error) {
    console.error('Address creation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to create address' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to update addresses' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      id,
      type,
      isDefault,
      firstName,
      lastName,
      company,
      address1,
      address2,
      city,
      province,
      postalCode,
      country,
      phone
    } = body

    // If this is being set as default, unset other defaults of the same type
    if (isDefault) {
      await supabase
        .from('UserAddresses')
        .update({ isDefault: false })
        .eq('userId', session.user.id)
        .eq('type', type)
        .neq('id', id)
    }

    // Update address
    const { data: address, error } = await supabase
      .from('UserAddresses')
      .update({
        type,
        isDefault: isDefault || false,
        firstName,
        lastName,
        company,
        address1,
        address2,
        city,
        province,
        postalCode,
        country: country || 'South Africa',
        phone
      })
      .eq('id', id)
      .eq('userId', session.user.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Address update error:', error)
      return NextResponse.json(
        { error: 'Failed to update address' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      address,
      message: 'Address updated successfully'
    })

  } catch (error) {
    console.error('Address update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to update address' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to delete addresses' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Delete address
    const { error } = await supabase
      .from('UserAddresses')
      .delete()
      .eq('id', addressId)
      .eq('userId', session.user.id)

    if (error) {
      console.error('❌ Address deletion error:', error)
      return NextResponse.json(
        { error: 'Failed to delete address' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    })

  } catch (error) {
    console.error('Address deletion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to delete address' },
      { status: 500 }
    )
  }
}