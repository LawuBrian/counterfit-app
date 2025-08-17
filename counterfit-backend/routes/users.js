const express = require('express');
const { supabase } = require('../lib/supabase');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Add/Remove product from wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('wishlist')
      .eq('id', req.user.id)
      .single();
    
    if (userError) {
      console.error('❌ Supabase error:', userError);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const productId = req.params.productId;
    const currentWishlist = user.wishlist || [];

    const isInWishlist = currentWishlist.includes(productId);

    let newWishlist;
    if (isInWishlist) {
      // Remove from wishlist
      newWishlist = currentWishlist.filter(id => id !== productId);
    } else {
      // Add to wishlist
      newWishlist = [...currentWishlist, productId];
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update({ 
        wishlist: newWishlist,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('wishlist')
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update wishlist'
      });
    }

    res.json({
      success: true,
      message: isInWishlist ? 'Removed from wishlist' : 'Added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    console.error('Wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get('/wishlist', protect, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('wishlist')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch wishlist'
      });
    }

    if (!user || !user.wishlist) {
      return res.json({
        success: true,
        data: []
      });
    }

    res.json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('id, email, firstName, lastName, role, avatar, createdAt')
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
      data: user
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
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;
    
    // Only allow updating certain fields
    const updateData = {
      updatedAt: new Date().toISOString()
    };

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (avatar !== undefined) updateData.avatar = avatar;

    const { data: user, error } = await supabase
      .from('User')
      .update(updateData)
      .eq('id', req.user.id)
      .select('id, email, firstName, lastName, role, avatar, createdAt')
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
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { limit = 50, page = 1, role, search } = req.query;
    
    let query = supabase
      .from('User')
      .select('id, email, firstName, lastName, role, avatar, createdAt')
      .order('createdAt', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`firstName.ilike.%${search}%,lastName.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (limit) {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      query = query.range(offset, offset + parseInt(limit) - 1);
    }

    const { data: users, error, count } = await query;

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }

    res.json({
      success: true,
      data: users || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('id, email, firstName, lastName, role, avatar, createdAt, updatedAt')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be USER or ADMIN'
      });
    }

    const { data: user, error } = await supabase
      .from('User')
      .update({ 
        role,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select('id, email, firstName, lastName, role')
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update user role'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
