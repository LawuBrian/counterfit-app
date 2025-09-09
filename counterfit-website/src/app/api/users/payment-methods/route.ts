import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to view payment methods' },
        { status: 401 }
      )
    }

    // Fetch user payment methods from Supabase
    const { data: paymentMethods, error } = await supabase
      .from('UserPaymentMethods')
      .select(`
        id,
        type,
        isDefault,
        nickname,
        cardLast4,
        cardBrand,
        cardExpMonth,
        cardExpYear,
        cardHolderName,
        bankName,
        ewalletProvider,
        createdAt
      `)
      .eq('userId', session.user.id)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('❌ Payment methods fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch payment methods' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentMethods: paymentMethods || []
    })

  } catch (error) {
    console.error('Payment methods API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to fetch payment methods' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to add payment methods' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      type,
      isDefault,
      nickname,
      cardLast4,
      cardBrand,
      cardExpMonth,
      cardExpYear,
      cardHolderName,
      bankName,
      accountNumber,
      branchCode,
      ewalletProvider,
      ewalletNumber,
      providerToken,
      providerId
    } = body

    // If this is being set as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('UserPaymentMethods')
        .update({ isDefault: false })
        .eq('userId', session.user.id)
    }

    // Create new payment method
    const { data: paymentMethod, error } = await supabase
      .from('UserPaymentMethods')
      .insert([{
        userId: session.user.id,
        type,
        isDefault: isDefault || false,
        nickname,
        cardLast4,
        cardBrand,
        cardExpMonth,
        cardExpYear,
        cardHolderName,
        bankName,
        accountNumber,
        branchCode,
        ewalletProvider,
        ewalletNumber,
        providerToken,
        providerId
      }])
      .select(`
        id,
        type,
        isDefault,
        nickname,
        cardLast4,
        cardBrand,
        cardExpMonth,
        cardExpYear,
        cardHolderName,
        bankName,
        ewalletProvider,
        createdAt
      `)
      .single()

    if (error) {
      console.error('❌ Payment method creation error:', error)
      return NextResponse.json(
        { error: 'Failed to create payment method' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentMethod,
      message: 'Payment method added successfully'
    })

  } catch (error) {
    console.error('Payment method creation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to create payment method' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to update payment methods' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      id,
      isDefault,
      nickname
    } = body

    // If this is being set as default, unset other defaults
    if (isDefault) {
      await supabase
        .from('UserPaymentMethods')
        .update({ isDefault: false })
        .eq('userId', session.user.id)
        .neq('id', id)
    }

    // Update payment method (only allow updating isDefault and nickname for security)
    const { data: paymentMethod, error } = await supabase
      .from('UserPaymentMethods')
      .update({
        isDefault: isDefault || false,
        nickname
      })
      .eq('id', id)
      .eq('userId', session.user.id)
      .select(`
        id,
        type,
        isDefault,
        nickname,
        cardLast4,
        cardBrand,
        cardExpMonth,
        cardExpYear,
        cardHolderName,
        bankName,
        ewalletProvider,
        createdAt
      `)
      .single()

    if (error) {
      console.error('❌ Payment method update error:', error)
      return NextResponse.json(
        { error: 'Failed to update payment method' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      paymentMethod,
      message: 'Payment method updated successfully'
    })

  } catch (error) {
    console.error('Payment method update API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to update payment method' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login to delete payment methods' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const paymentMethodId = searchParams.get('id')

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      )
    }

    // Delete payment method
    const { error } = await supabase
      .from('UserPaymentMethods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('userId', session.user.id)

    if (error) {
      console.error('❌ Payment method deletion error:', error)
      return NextResponse.json(
        { error: 'Failed to delete payment method' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully'
    })

  } catch (error) {
    console.error('Payment method deletion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error - failed to delete payment method' },
      { status: 500 }
    )
  }
}