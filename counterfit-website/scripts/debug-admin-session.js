#!/usr/bin/env node

// Debug script to check admin session and authentication
// Run with: node scripts/debug-admin-session.js

require('dotenv').config({ path: '.env.local' })

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

async function debugAdminSession() {
  try {
    console.log('🔍 Debugging admin session and authentication...')
    console.log('🌐 Backend URL:', BACKEND_URL)
    
    // Test 1: Check if we can simulate a login
    console.log('\n🔐 Testing login flow...')
    
    // You'll need to replace these with actual test credentials
    const testCredentials = {
      email: 'admin@counterfit.co.za', // Replace with actual admin email
      password: 'test-password' // Replace with actual password
    }
    
    console.log('📧 Test email:', testCredentials.email)
    console.log('🔑 Test password:', testCredentials.password ? '***' : 'NOT SET')
    
    if (!testCredentials.password || testCredentials.password === 'test-password') {
      console.log('⚠️ Please update the script with real test credentials')
      console.log('   Edit scripts/debug-admin-session.js and set real email/password')
      return
    }
    
    try {
      const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCredentials)
      })
      
      console.log('📥 Login response status:', loginResponse.status)
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json()
        console.log('✅ Login successful!')
        console.log('👤 User data:', {
          id: loginData.user?.id,
          email: loginData.user?.email,
          role: loginData.user?.role,
          firstName: loginData.user?.firstName,
          lastName: loginData.user?.lastName
        })
        console.log('🔑 Access token present:', !!loginData.token)
        console.log('🔑 Token length:', loginData.token?.length || 0)
        
        // Test 2: Use the token to call admin endpoints
        console.log('\n🔒 Testing admin endpoints with token...')
        
        const adminEndpoints = [
          '/api/admin/stats',
          '/api/admin/orders',
          '/api/admin/products'
        ]
        
        for (const endpoint of adminEndpoints) {
          try {
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
              headers: {
                'Authorization': `Bearer ${loginData.token}`,
                'Content-Type': 'application/json'
              }
            })
            
            console.log(`${endpoint}: ${response.status} ${response.statusText}`)
            
            if (response.ok) {
              try {
                const data = await response.json()
                console.log(`  ✅ Success! Data structure:`, {
                  success: data.success,
                  hasData: !!data.data,
                  dataType: Array.isArray(data.data) ? 'array' : typeof data.data,
                  dataLength: Array.isArray(data.data) ? data.data.length : 'N/A'
                })
              } catch (parseError) {
                console.log(`  ⚠️ Response OK but couldn't parse JSON`)
              }
            } else if (response.status === 401) {
              console.log(`  ❌ Still unauthorized - token might be invalid`)
            } else if (response.status === 403) {
              console.log(`  ❌ Forbidden - user might not have admin role`)
            } else {
              console.log(`  ⚠️ Unexpected status`)
            }
          } catch (error) {
            console.log(`${endpoint}: ❌ Connection failed - ${error.message}`)
          }
        }
        
      } else {
        const errorData = await loginResponse.json()
        console.log('❌ Login failed:', errorData.message || 'Unknown error')
      }
      
    } catch (error) {
      console.log('❌ Login request failed:', error.message)
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error)
  }
}

// Run the debug
debugAdminSession()
