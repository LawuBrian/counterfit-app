const express = require('express')
const router = express.Router()
const { supabase } = require('../lib/supabase')

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test database connection
    const { error } = await supabase
      .from('User')
      .select('id')
      .limit(1)
    
    if (error) {
      throw error;
    }
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime()
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
      uptime: process.uptime()
    })
  }
})

// Database connection test
router.get('/health/db', async (req, res) => {
  try {
    const startTime = Date.now()
    const { error } = await supabase
      .from('User')
      .select('id')
      .limit(1)
    
    if (error) {
      throw error;
    }
    
    const responseTime = Date.now() - startTime
    
    res.json({
      status: 'connected',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database health check failed:', error)
    
    res.status(503).json({
      status: 'disconnected',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    })
  }
})

module.exports = router
