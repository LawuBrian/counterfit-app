#!/usr/bin/env node

// Test script to create a test order in Supabase
// Run with: node scripts/test-create-order.js

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please check your .env.local file for:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testCreateOrder() {
  try {
    console.log('🔍 Testing Supabase order creation...')
    
    // Test 1: Check if we can connect to Supabase
    console.log('\n📡 Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('Order')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ Connection failed:', testError.message)
      return
    }
    
    console.log('✅ Supabase connection successful')
    
    // Test 2: Try to create a test order
    console.log('\n📦 Creating test order...')
    const testOrder = {
      id: 'test-' + Date.now(),
      orderNumber: 'TEST-' + Date.now(),
      status: 'PENDING',
      totalAmount: 100.00,
      subtotal: 100.00,
      tax: 0.00,
      shipping: 0.00,
      paymentStatus: 'PENDING',
      paymentId: null,
      trackingNumber: 'TEST-TRACK-' + Date.now(),
      carrier: 'Test Carrier',
      notes: 'Test order for admin panel testing',
      paymentMethod: 'test',
      userId: 'test-user-id',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const { data: createdOrder, error: createError } = await supabase
      .from('Order')
      .insert([testOrder])
      .select()
      .single()

    if (createError) {
      console.error('❌ Order creation failed:', createError.message)
      console.log('Error details:', createError)
      return
    }

    console.log('✅ Test order created successfully:', createdOrder)
    
    // Test 3: Verify the order can be fetched
    console.log('\n🔍 Verifying order can be fetched...')
    const { data: fetchedOrder, error: fetchError } = await supabase
      .from('Order')
      .select('*')
      .eq('id', createdOrder.id)
      .single()

    if (fetchError) {
      console.error('❌ Order fetch failed:', fetchError.message)
      return
    }

    console.log('✅ Order fetched successfully:', fetchedOrder)
    
    // Test 4: Clean up - delete test order
    console.log('\n🧹 Cleaning up test order...')
    const { error: deleteError } = await supabase
      .from('Order')
      .delete()
      .eq('id', createdOrder.id)

    if (deleteError) {
      console.error('⚠️ Failed to delete test order:', deleteError.message)
    } else {
      console.log('✅ Test order deleted successfully')
    }
    
    console.log('\n✅ Supabase order creation test completed successfully!')
    console.log('🎯 Your admin panel should now be able to fetch orders from Supabase!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testCreateOrder()
