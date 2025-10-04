const express = require('express')
const router = express.Router()
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// @desc    Track a new page view
// @route   POST /api/visitors/track
// @access  Public
router.post('/track', async (req, res) => {
  try {
    const {
      sessionId,
      ipAddress,
      userAgent,
      referrer,
      pageUrl,
      pageTitle,
      country,
      city,
      region,
      timezone,
      deviceType,
      browser,
      os,
      screenResolution,
      language
    } = req.body

    if (!sessionId || !pageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and page URL are required'
      })
    }

    // Check if visitor already exists
    const { data: existingVisitor, error: findError } = await supabase
      .from('visitors')
      .select('*')
      .eq('sessionid', sessionId)
      .single()

    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding visitor:', findError)
    }

    let visitor
    if (existingVisitor) {
             // Update existing visitor
       const { data, error } = await supabase
         .from('visitors')
         .update({
           pageurl: pageUrl,
           pagetitle: pageTitle,
           pagesviewed: existingVisitor.pagesviewed + 1,
           lastactivity: new Date().toISOString(),
           updatedat: new Date().toISOString()
         })
        .eq('sessionid', sessionId)
        .select()
        .single()

      if (error) {
        console.error('Error updating visitor:', error)
        return res.status(500).json({
          success: false,
          message: 'Failed to update visitor'
        })
      }
      visitor = data
    } else {
             // Create new visitor
       const { data, error } = await supabase
         .from('visitors')
         .insert({
           sessionid: sessionId,
           ipaddress: ipAddress,
           useragent: userAgent,
           referrer,
           pageurl: pageUrl,
           pagetitle: pageTitle,
           country,
           city,
           region,
           timezone,
           devicetype: deviceType,
           browser,
           os,
           screenresolution: screenResolution,
           language,
           isreturning: false
         })
        .select()
        .single()

      if (error) {
        console.error('Error creating visitor:', error)
        return res.status(500).json({
          success: false,
          message: 'Failed to create visitor'
        })
      }
      visitor = data
    }

    res.json({
      success: true,
      data: visitor
    })
  } catch (error) {
    console.error('Visitor tracking error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to track visitor'
    })
  }
})

// @desc    Update visit duration when visitor leaves
// @route   PUT /api/visitors/duration
// @access  Public
router.put('/duration', async (req, res) => {
  try {
    const { sessionId, duration } = req.body

    if (!sessionId || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and duration are required'
      })
    }

    // Don't use .single() - it errors if no record found
    const { data: visitors, error } = await supabase
      .from('visitors')
      .update({
        visitduration: duration,
        updatedat: new Date().toISOString()
      })
      .eq('sessionid', sessionId)
      .select()

    if (error) {
      console.error('Error updating duration:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to update visit duration',
        error: error.message
      })
    }

    // Return success even if no rows updated (session may have expired)
    res.json({
      success: true,
      data: visitors?.[0] || null,
      updated: visitors?.length > 0
    })
  } catch (error) {
    console.error('Duration update error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update visit duration',
      error: error.message
    })
  }
})

// @desc    Get visitor analytics for admin
// @route   GET /api/visitors/analytics
// @access  Private (Admin)
router.get('/analytics', async (req, res) => {
  try {
    const { period = '7d' } = req.query

    // Calculate date range based on period
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }

         // Get total visitors in period
     const { count: totalVisitors, error: totalError } = await supabase
       .from('visitors')
       .select('*', { count: 'exact', head: true })
       .gte('createdat', startDate.toISOString())

    if (totalError) {
      console.error('Error getting total visitors:', totalError)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch total visitors'
      })
    }

         // Get unique visitors (by session)
     const { data: uniqueVisitorsData, error: uniqueError } = await supabase
       .from('visitors')
       .select('sessionid')
       .gte('createdat', startDate.toISOString())

    if (uniqueError) {
      console.error('Error getting unique visitors:', uniqueError)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch unique visitors'
      })
    }

    const uniqueVisitors = new Set(uniqueVisitorsData.map(v => v.sessionid)).size

         // Get returning visitors
     const { count: returningVisitors, error: returningError } = await supabase
       .from('visitors')
       .select('*', { count: 'exact', head: true })
       .gte('createdat', startDate.toISOString())
       .eq('isreturning', true)

    if (returningError) {
      console.error('Error getting returning visitors:', returningError)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch returning visitors'
      })
    }

         // Get page views
     const { data: pageViewsData, error: pageViewsError } = await supabase
       .from('visitors')
       .select('pagesviewed')
       .gte('createdat', startDate.toISOString())

    if (pageViewsError) {
      console.error('Error getting page views:', pageViewsError)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch page views'
      })
    }

         const totalPageViews = pageViewsData.reduce((sum, v) => sum + (v.pagesviewed || 1), 0)

         // Get average visit duration
     const { data: durationData, error: durationError } = await supabase
       .from('visitors')
       .select('visitduration')
       .gte('createdat', startDate.toISOString())
       .not('visitduration', 'is', null)

    if (durationError) {
      console.error('Error getting duration data:', durationError)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch duration data'
      })
    }

         const avgDuration = durationData.length > 0 
       ? durationData.reduce((sum, v) => sum + (v.visitduration || 0), 0) / durationData.length
       : 0

         // Get top pages
     const { data: topPagesData, error: topPagesError } = await supabase
       .from('visitors')
       .select('pageurl, pagetitle')
       .gte('createdat', startDate.toISOString())

    if (topPagesError) {
      console.error('Error getting top pages:', topPagesError)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch top pages'
      })
    }

         // Count page views manually since Supabase doesn't support GROUP BY in the same way
     const pageCounts = {}
     topPagesData.forEach(visitor => {
       const key = `${visitor.pageurl}|${visitor.pagetitle || 'Unknown'}`
       pageCounts[key] = (pageCounts[key] || 0) + 1
     })

    const topPages = Object.entries(pageCounts)
      .map(([key, count]) => {
        const [url, title] = key.split('|')
        return { url, title, views: count }
      })
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

         // Get device types
     const { data: deviceData, error: deviceError } = await supabase
       .from('visitors')
       .select('devicetype')
       .gte('createdat', startDate.toISOString())
       .not('devicetype', 'is', null)

    if (deviceError) {
      console.error('Error getting device data:', deviceError)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch device data'
      })
    }

         const deviceCounts = {}
     deviceData.forEach(visitor => {
       const type = visitor.devicetype || 'Unknown'
       deviceCounts[type] = (deviceCounts[type] || 0) + 1
     })

    const deviceTypes = Object.entries(deviceCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)

         // Get countries
     const { data: countryData, error: countryError } = await supabase
       .from('visitors')
       .select('country')
       .gte('createdat', startDate.toISOString())
       .not('country', 'is', null)

    if (countryError) {
      console.error('Error getting country data:', countryError)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch country data'
      })
    }

    const countryCounts = {}
    countryData.forEach(visitor => {
      const country = visitor.country || 'Unknown'
      countryCounts[country] = (countryCounts[country] || 0) + 1
    })

    const countries = Object.entries(countryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Get hourly distribution for the last 24 hours
    const hourlyData = []
    if (period === '24h') {
      for (let i = 0; i < 24; i++) {
        const hourStart = new Date(now)
        hourStart.setHours(now.getHours() - i, 0, 0, 0)
        const hourEnd = new Date(hourStart)
        hourEnd.setHours(hourStart.getHours() + 1)

                 const { count: hourCount, error: hourError } = await supabase
           .from('visitors')
           .select('*', { count: 'exact', head: true })
           .gte('createdat', hourStart.toISOString())
           .lt('createdat', hourEnd.toISOString())

        if (hourError) {
          console.error('Error getting hour data:', hourError)
        }

        hourlyData.unshift({
          hour: hourStart.getHours(),
          count: hourCount || 0
        })
      }
    }

    // Get daily distribution for periods > 24h
    const dailyData = []
    if (period !== '24h') {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
      for (let i = 0; i < days; i++) {
        const dayStart = new Date(now)
        dayStart.setDate(now.getDate() - i)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(dayStart)
        dayEnd.setDate(dayStart.getDate() + 1)

                 const { count: dayCount, error: dayError } = await supabase
           .from('visitors')
           .select('*', { count: 'exact', head: true })
           .gte('createdat', dayStart.toISOString())
           .lt('createdat', dayEnd.toISOString())

        if (dayError) {
          console.error('Error getting day data:', dayError)
        }

        dailyData.unshift({
          date: dayStart.toISOString().split('T')[0],
          count: dayCount || 0
        })
      }
    }

    const analytics = {
      period,
      overview: {
        totalVisitors: totalVisitors || 0,
        uniqueVisitors,
        returningVisitors: returningVisitors || 0,
        totalPageViews,
        avgVisitDuration: Math.round(avgDuration / 60), // Convert to minutes
        bounceRate: uniqueVisitors > 0 ? Math.round(((uniqueVisitors - (returningVisitors || 0)) / uniqueVisitors) * 100) : 0
      },
      topPages,
      deviceTypes,
      countries,
      timeDistribution: period === '24h' ? hourlyData : dailyData
    }

    res.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Visitor analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch visitor analytics'
    })
  }
})

// @desc    Get recent visitors
// @route   GET /api/visitors/recent
// @access  Private (Admin)
router.get('/recent', async (req, res) => {
  try {
    const { limit = 20 } = req.query

         const { data: recentVisitors, error } = await supabase
       .from('visitors')
       .select('id, sessionid, pageurl, pagetitle, country, city, devicetype, browser, os, pagesviewed, visitduration, lastactivity, createdat')
       .order('lastactivity', { ascending: false })
       .limit(parseInt(limit))

    if (error) {
      console.error('Error getting recent visitors:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recent visitors'
      })
    }

    res.json({
      success: true,
      data: recentVisitors || []
    })
  } catch (error) {
    console.error('Recent visitors error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent visitors'
    })
  }
})

module.exports = router
