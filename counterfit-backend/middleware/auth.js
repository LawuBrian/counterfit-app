const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔐 Token received:', token.substring(0, 20) + '...');
    }

    // Check if token exists
    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      console.log('🔍 Verifying token with JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded successfully:', decoded);

      // Get user from token
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, firstName: true, lastName: true, role: true, avatar: true }
      });

      if (!req.user) {
        console.log('❌ User not found for ID:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('✅ User authenticated:', req.user.email, 'Role:', req.user.role);
      next();
    } catch (err) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.log('❌ Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin only access
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
};

// Optional authentication - sets user if token is valid
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, email: true, firstName: true, lastName: true, role: true, avatar: true }
        });
      } catch (err) {
        // Invalid token, but continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Generate JWT Token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};
