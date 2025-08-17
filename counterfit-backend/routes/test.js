const express = require('express');
const { supabase } = require('../lib/supabase');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Test endpoint to verify authentication
// @route   GET /api/test/auth
// @access  Private
router.get('/auth', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication working!',
    user: req.user
  });
});

// @desc    Test endpoint to verify admin access
// @route   GET /api/test/admin
// @access  Private/Admin
router.get('/admin', protect, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Admin access working!',
    user: req.user
  });
});

// @desc    Test endpoint to verify Supabase connection
// @route   GET /api/test/supabase
// @access  Public
router.get('/supabase', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('User')
      .select('id')
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Supabase connection failed',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Supabase connection working!',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Supabase test failed',
      error: error.message
    });
  }
});

// @desc    Test endpoint to verify JWT token
// @route   POST /api/test/token
// @access  Public
router.post('/token', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      message: 'Token is valid!',
      decoded: decoded
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
});

module.exports = router;
