#!/usr/bin/env node

// Test script to verify Supabase orders connection
// Run with: node scripts/test-supabase-orders.js

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

async function testSupabaseOrders() {
  try {
    console.log('🔍 Testing Supabase orders connection...')
    
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
    
    // Test 2: Count total orders
    console.log('\n📊 Counting total orders...')
    const { count: totalOrders, error: countError } = await supabase
      .from('Order')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('❌ Count failed:', countError.message)
      return
    }
    
    console.log(`✅ Total orders in database: ${totalOrders || 0}`)
    
    // Test 3: Get recent orders
    console.log('\n📋 Fetching recent orders...')
    const { data: recentOrders, error: ordersError } = await supabase
      .from('Order')
      .select(`
        id,
        orderNumber,
        totalAmount,
        status,
        paymentStatus,
        createdAt,
        userId
      `)
      .order('createdAt', { ascending: false })
      .limit(5)
    
    if (ordersError) {
      console.error('❌ Fetch orders failed:', ordersError.message)
      return
    }
    
    console.log(`✅ Recent orders fetched: ${recentOrders?.length || 0}`)
    
    if (recentOrders && recentOrders.length > 0) {
      console.log('\n📋 Recent orders:')
      recentOrders.forEach((order, index) => {
        console.log(`${index + 1}. ${order.orderNumber} - R${order.totalAmount} - ${order.status}`)
        console.log(`   ID: ${order.id}`)
        console.log(`   Created: ${new Date(order.createdAt).toLocaleString()}`)
        console.log(`   Payment: ${order.paymentStatus}`)
        console.log('')
      })
    } else {
      console.log('⚠️ No orders found in database')
    }
    
    // Test 4: Check order structure
    if (recentOrders && recentOrders.length > 0) {
      console.log('\n🔍 Checking order structure...')
      const sampleOrder = recentOrders[0]
      const requiredFields = ['id', 'orderNumber', 'totalAmount', 'status', 'createdAt']
      const missingFields = requiredFields.filter(field => !sampleOrder[field])
      
      if (missingFields.length > 0) {
        console.log('⚠️ Missing required fields:', missingFields)
      } else {
        console.log('✅ Order structure looks good')
      }
    }
    
    console.log('\n✅ Supabase orders test completed successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testSupabaseOrders()
