#!/usr/bin/env node

// Test admin endpoints directly with hardcoded token
// Run with: node scripts/test-admin-direct.js

require('dotenv').config({ path: '.env.local' })

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

async function testAdminDirect() {
  try {
    console.log('🔍 Testing admin endpoints directly...')
    console.log('🌐 Backend URL:', BACKEND_URL)
    
    // You need to get a real token from your backend
    // This is just a placeholder - replace with actual token
    const testToken = 'YOUR_ACTUAL_TOKEN_HERE'
    
    if (testToken === 'YOUR_ACTUAL_TOKEN_HERE') {
      console.log('⚠️ Please get a real token from your backend first:')
      console.log('   1. Login to your website as admin')
      console.log('   2. Check browser dev tools -> Application -> Session Storage')
      console.log('   3. Look for the accessToken value')
      console.log('   4. Copy it and replace YOUR_ACTUAL_TOKEN_HERE in this script')
      return
    }
    
    console.log('🔑 Using token:', testToken.substring(0, 20) + '...')
    
    const adminEndpoints = [
      '/api/admin/stats',
      '/api/admin/orders',
      '/api/admin/products'
    ]
    
    for (const endpoint of adminEndpoints) {
      try {
        console.log(`\n📡 Testing ${endpoint}...`)
        
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${testToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        console.log(`Status: ${response.status} ${response.statusText}`)
        
        if (response.ok) {
          try {
            const data = await response.json()
            console.log('✅ Success! Response structure:')
            console.log('  - success:', data.success)
            console.log('  - has data:', !!data.data)
            console.log('  - data type:', Array.isArray(data.data) ? 'array' : typeof data.data)
            
            if (Array.isArray(data.data)) {
              console.log('  - data length:', data.data.length)
              if (data.data.length > 0) {
                console.log('  - first item keys:', Object.keys(data.data[0]))
              }
            } else if (data.data && typeof data.data === 'object') {
              console.log('  - data keys:', Object.keys(data.data))
            }
            
          } catch (parseError) {
            console.log('⚠️ Response OK but couldn\'t parse JSON')
          }
        } else if (response.status === 401) {
          console.log('❌ Unauthorized - token might be invalid or expired')
        } else if (response.status === 403) {
          console.log('❌ Forbidden - user might not have admin role')
        } else {
          console.log('⚠️ Unexpected status')
        }
        
      } catch (error) {
        console.log(`❌ Request failed: ${error.message}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testAdminDirect()
