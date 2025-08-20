const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../lib/supabase');
const { protect, generateToken } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Supabase error:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Server error during registration'
      });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with explicit UUID generation
    const crypto = require('crypto');
    const userId = crypto.randomUUID();
    
    const { data: user, error: createError } = await supabase
      .from('User')
      .insert({
        id: userId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .select('id, firstName, lastName, email, role')
      .single();

    if (createError) {
      console.error('❌ Supabase error:', createError);
      return res.status(500).json({
        success: false,
        message: 'Failed to create user'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Google OAuth authentication
// @route   POST /api/auth/google
// @access  Public
router.post('/google', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('name').notEmpty().withMessage('Name is required'),
  body('googleId').notEmpty().withMessage('Google ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, name, image, googleId } = req.body;

    // Parse name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('User')
      .select('*')
      .eq('email', email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Supabase error:', checkError);
      return res.status(500).json({
        success: false,
        message: 'Server error during Google authentication'
      });
    }

    let user;
    let isNewUser = false;

    if (existingUser) {
      // User exists, update Google ID if not set
      if (!existingUser.googleId) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('User')
          .update({ 
            googleId,
            avatar: image || existingUser.avatar,
            updatedAt: new Date().toISOString()
          })
          .eq('id', existingUser.id)
          .select('*')
          .single();

        if (updateError) {
          console.error('❌ Supabase error:', updateError);
          return res.status(500).json({
            success: false,
            message: 'Failed to update user with Google ID'
          });
        }
        user = updatedUser;
      } else {
        user = existingUser;
      }
    } else {
      // Create new user
      const crypto = require('crypto');
      const userId = crypto.randomUUID();
      
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert({
          id: userId,
          firstName,
          lastName,
          email,
          googleId,
          avatar: image,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .select('*')
        .single();

      if (createError) {
        console.error('❌ Supabase error:', createError);
        return res.status(500).json({
          success: false,
          message: 'Failed to create user'
        });
      }
      user = newUser;
      isNewUser = true;
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(isNewUser ? 201 : 200).json({
      success: true,
      message: isNewUser ? 'User created successfully' : 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication'
    });
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('id, firstName, lastName, email, role, avatar, wishlist, createdAt')
      .eq('id', req.user.id)
      .single();
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch profile'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('phone').optional().trim().isMobilePhone().withMessage('Please enter a valid phone number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address'];
    const updates = {
      updatedAt: new Date().toISOString()
    };

    // Only include allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const { data: user, error } = await supabase
      .from('User')
      .update(updates)
      .eq('id', req.user.id)
      .select('id, firstName, lastName, email, role, avatar, wishlist, createdAt')
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const { data: user, error: fetchError } = await supabase
      .from('User')
      .select('password')
      .eq('id', req.user.id)
      .single();

    if (fetchError) {
      console.error('❌ Supabase error:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update({ 
        password: hashedNewPassword,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('id, firstName, lastName, email, role')
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update password'
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;
