const fetch = require('node-fetch')

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

async function testVisitorTracking() {
  console.log('🧪 Testing Visitor Tracking API...')
  console.log('📍 Backend URL:', BACKEND_URL)

  try {
    // Test 1: Track a page view
    console.log('\n📊 Test 1: Tracking page view...')
    const trackResponse = await fetch(`${BACKEND_URL}/api/visitors/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: 'test_session_' + Date.now(),
        pageUrl: '/test-page',
        pageTitle: 'Test Page',
        deviceType: 'desktop',
        browser: 'Chrome',
        os: 'Windows',
        country: 'South Africa',
        city: 'Johannesburg',
        timezone: 'Africa/Johannesburg',
        language: 'en-US'
      })
    })

    if (trackResponse.ok) {
      const trackData = await trackResponse.json()
      console.log('✅ Page view tracked successfully:', trackData.data.sessionId)
    } else {
      console.error('❌ Failed to track page view:', trackResponse.status, trackResponse.statusText)
      const errorText = await trackResponse.text()
      console.error('Error details:', errorText)
    }

    // Test 2: Update visit duration
    console.log('\n⏱️  Test 2: Updating visit duration...')
    const sessionId = 'test_session_' + Date.now()
    
    // First create a visitor
    await fetch(`${BACKEND_URL}/api/visitors/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        pageUrl: '/test-page',
        pageTitle: 'Test Page',
        deviceType: 'desktop'
      })
    })

    // Then update duration
    const durationResponse = await fetch(`${BACKEND_URL}/api/visitors/duration`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        duration: 120
      })
    })

    if (durationResponse.ok) {
      const durationData = await durationResponse.json()
      console.log('✅ Visit duration updated successfully:', durationData.data.visitDuration, 'seconds')
    } else {
      console.error('❌ Failed to update duration:', durationResponse.status, durationResponse.statusText)
      const errorText = await durationResponse.text()
      console.error('Error details:', errorText)
    }

    // Test 3: Get analytics (this will fail without admin auth, but we can test the endpoint)
    console.log('\n📈 Test 3: Testing analytics endpoint...')
    const analyticsResponse = await fetch(`${BACKEND_URL}/api/visitors/analytics?period=7d`)
    
    if (analyticsResponse.status === 401 || analyticsResponse.status === 403) {
      console.log('✅ Analytics endpoint working (requires admin auth)')
    } else if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json()
      console.log('✅ Analytics fetched successfully:', analyticsData.data.overview)
    } else {
      console.error('❌ Analytics endpoint error:', analyticsResponse.status, analyticsResponse.statusText)
    }

    // Test 4: Get recent visitors (this will also fail without admin auth)
    console.log('\n👥 Test 4: Testing recent visitors endpoint...')
    const visitorsResponse = await fetch(`${BACKEND_URL}/api/visitors/recent?limit=5`)
    
    if (visitorsResponse.status === 401 || visitorsResponse.status === 403) {
      console.log('✅ Recent visitors endpoint working (requires admin auth)')
    } else if (visitorsResponse.ok) {
      const visitorsData = await visitorsResponse.json()
      console.log('✅ Recent visitors fetched successfully:', visitorsData.data.length, 'visitors')
    } else {
      console.error('❌ Recent visitors endpoint error:', visitorsResponse.status, visitorsResponse.statusText)
    }

    console.log('\n🎉 Visitor tracking API tests completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Create the visitors table in Supabase using the SQL script')
    console.log('2. Test the admin endpoints with proper authentication')
    console.log('3. Integrate visitor tracking into your frontend pages')

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testVisitorTracking()
    .then(() => {
      console.log('\n✅ All tests completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Tests failed:', error)
      process.exit(1)
    })
}

module.exports = { testVisitorTracking }
