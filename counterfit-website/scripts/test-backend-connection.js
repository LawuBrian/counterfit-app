#!/usr/bin/env node

// Test script to check backend connection and endpoints
// Run with: node scripts/test-backend-connection.js

require('dotenv').config({ path: '.env.local' })

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

async function testBackendConnection() {
  try {
    console.log('🔍 Testing backend connection...')
    console.log('🌐 Backend URL:', BACKEND_URL)
    
    // Test 1: Check if backend is reachable
    console.log('\n📡 Testing basic connectivity...')
    try {
      const healthResponse = await fetch(`${BACKEND_URL}/api/health`)
      if (healthResponse.ok) {
        console.log('✅ Backend is reachable')
      } else {
        console.log('⚠️ Backend responded but with error:', healthResponse.status)
      }
    } catch (error) {
      console.log('❌ Backend is not reachable:', error.message)
    }
    
    // Test 2: Check admin endpoints without auth (should fail with 401)
    console.log('\n🔒 Testing admin endpoints (should fail without auth)...')
    
    const endpoints = [
      '/api/admin/stats',
      '/api/admin/orders', 
      '/api/admin/products'
    ]
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`)
        console.log(`${endpoint}: ${response.status} ${response.statusText}`)
        
        if (response.status === 401) {
          console.log('  ✅ Correctly requires authentication')
        } else if (response.status === 404) {
          console.log('  ❌ Endpoint not found')
        } else {
          console.log('  ⚠️ Unexpected response')
        }
      } catch (error) {
        console.log(`${endpoint}: ❌ Connection failed - ${error.message}`)
      }
    }
    
    // Test 3: Check if we can get any response from backend
    console.log('\n🧪 Testing backend response format...')
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Backend health response:', data)
      }
    } catch (error) {
      console.log('❌ Could not parse backend response')
    }
    
    console.log('\n📊 Backend Connection Summary:')
    console.log('- If you see 401 errors for admin endpoints, the backend is working but needs auth')
    console.log('- If you see 404 errors, the endpoints might not exist')
    console.log('- If you see connection errors, the backend might be down')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testBackendConnection()
