#!/usr/bin/env node

// Script to inspect the actual table structure in Supabase
// Run with: node scripts/inspect-table.js

require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectTables() {
  try {
    console.log('🔍 Inspecting Supabase table structure...')
    
    // Test 1: Check Order table structure
    console.log('\n📋 Checking Order table...')
    const { data: orderData, error: orderError } = await supabase
      .from('Order')
      .select('*')
      .limit(1)
    
    if (orderError) {
      console.error('❌ Order table error:', orderError.message)
    } else {
      console.log('✅ Order table accessible')
      if (orderData && orderData.length > 0) {
        console.log('📊 Order table columns:', Object.keys(orderData[0]))
        console.log('📋 Sample order data:', JSON.stringify(orderData[0], null, 2))
      } else {
        console.log('📊 Order table is empty')
      }
    }
    
    // Test 2: Check if we can get table info
    console.log('\n🔍 Trying to get table info...')
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_info', { table_name: 'Order' })
      
      if (tableError) {
        console.log('⚠️ Could not get table info via RPC:', tableError.message)
      } else {
        console.log('📊 Table info:', tableInfo)
      }
    } catch (rpcError) {
      console.log('⚠️ RPC not available, trying direct query...')
    }
    
    // Test 3: Try to create a minimal order with only required fields
    console.log('\n🧪 Testing minimal order creation...')
    const minimalOrder = {
      id: 'minimal-' + Date.now(),
      orderNumber: 'MIN-' + Date.now(),
      status: 'PENDING',
      totalAmount: 100.00,
      userId: 'test-user-id'
    }
    
    const { data: createdMinimal, error: minimalError } = await supabase
      .from('Order')
      .insert([minimalOrder])
      .select()
      .single()

    if (minimalError) {
      console.error('❌ Minimal order creation failed:', minimalError.message)
      console.log('Error details:', minimalError)
    } else {
      console.log('✅ Minimal order created successfully:', createdMinimal)
      
      // Clean up
      await supabase
        .from('Order')
        .delete()
        .eq('id', createdMinimal.id)
      console.log('🧹 Minimal order cleaned up')
    }
    
  } catch (error) {
    console.error('❌ Inspection failed:', error)
  }
}

// Run the inspection
inspectTables()
