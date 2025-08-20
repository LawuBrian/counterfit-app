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

// @desc    Get user addresses
// @route   GET /api/users/addresses
// @access  Private
router.get('/addresses', protect, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('addresses')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch addresses'
      });
    }

    const addresses = user?.addresses || [];
    res.json({
      success: true,
      addresses: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add new address
// @route   POST /api/users/addresses
// @access  Private
router.post('/addresses', protect, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('addresses')
      .eq('id', req.user.id)
      .single();

    if (userError) {
      console.error('❌ Supabase error:', userError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }

    const currentAddresses = user?.addresses || [];
    const newAddress = {
      id: Date.now().toString(), // Simple ID generation
      ...req.body,
      createdAt: new Date().toISOString()
    };

    // If this is the first address, make it default
    if (currentAddresses.length === 0) {
      newAddress.isDefault = true;
    }

    const updatedAddresses = [...currentAddresses, newAddress];

    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update({ 
        addresses: updatedAddresses,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('addresses')
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to add address'
      });
    }

    res.json({
      success: true,
      address: newAddress,
      message: 'Address added successfully'
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update address
// @route   PUT /api/users/addresses
// @access  Private
router.put('/addresses', protect, async (req, res) => {
  try {
    const { id, ...addressData } = req.body;
    
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('addresses')
      .eq('id', req.user.id)
      .single();

    if (userError) {
      console.error('❌ Supabase error:', userError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }

    const currentAddresses = user?.addresses || [];
    const addressIndex = currentAddresses.findIndex(addr => addr.id === id);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const updatedAddress = {
      ...currentAddresses[addressIndex],
      ...addressData,
      updatedAt: new Date().toISOString()
    };

    currentAddresses[addressIndex] = updatedAddress;

    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update({ 
        addresses: currentAddresses,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('addresses')
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update address'
      });
    }

    res.json({
      success: true,
      address: updatedAddress,
      message: 'Address updated successfully'
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete address
// @route   DELETE /api/users/addresses
// @access  Private
router.delete('/addresses', protect, async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Address ID is required'
      });
    }

    const { data: user, error: userError } = await supabase
      .from('User')
      .select('addresses')
      .eq('id', req.user.id)
      .single();

    if (userError) {
      console.error('❌ Supabase error:', userError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }

    const currentAddresses = user?.addresses || [];
    const filteredAddresses = currentAddresses.filter(addr => addr.id !== id);

    if (filteredAddresses.length === currentAddresses.length) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update({ 
        addresses: filteredAddresses,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('addresses')
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete address'
      });
    }

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user payment methods
// @route   GET /api/users/payment-methods
// @access  Private
router.get('/payment-methods', protect, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('paymentMethods')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment methods'
      });
    }

    const paymentMethods = user?.paymentMethods || [];
    res.json({
      success: true,
      paymentMethods: paymentMethods
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add payment method
// @route   POST /api/users/payment-methods
// @access  Private
router.post('/payment-methods', protect, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('paymentMethods')
      .eq('id', req.user.id)
      .single();

    if (userError) {
      console.error('❌ Supabase error:', userError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }

    const currentPaymentMethods = user?.paymentMethods || [];
    const newPaymentMethod = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    const updatedPaymentMethods = [...currentPaymentMethods, newPaymentMethod];

    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update({ 
        paymentMethods: updatedPaymentMethods,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('paymentMethods')
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to add payment method'
      });
    }

    res.json({
      success: true,
      paymentMethod: newPaymentMethod,
      message: 'Payment method added successfully'
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete payment method
// @route   DELETE /api/users/payment-methods
// @access  Private
router.delete('/payment-methods', protect, async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Payment method ID is required'
      });
    }

    const { data: user, error: userError } = await supabase
      .from('User')
      .select('paymentMethods')
      .eq('id', req.user.id)
      .single();

    if (userError) {
      console.error('❌ Supabase error:', userError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }

    const currentPaymentMethods = user?.paymentMethods || [];
    const filteredPaymentMethods = currentPaymentMethods.filter(pm => pm.id !== id);

    if (filteredPaymentMethods.length === currentPaymentMethods.length) {
      return res.status(404).json({
        success: false,
        message: 'Payment method not found'
      });
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update({ 
        paymentMethods: filteredPaymentMethods,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('paymentMethods')
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete payment method'
      });
    }

    res.json({
      success: true,
      message: 'Payment method deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user settings
// @route   GET /api/users/settings
// @access  Private
router.get('/settings', protect, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('settings')
      .eq('id', req.user.id)
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch settings'
      });
    }

    const settings = user?.settings || {};
    res.json({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
  try {
    const { data: user, error: userError } = await supabase
      .from('User')
      .select('settings')
      .eq('id', req.user.id)
      .single();

    if (userError) {
      console.error('❌ Supabase error:', userError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user'
      });
    }

    const currentSettings = user?.settings || {};
    const updatedSettings = { ...currentSettings, ...req.body };

    const { data: updatedUser, error: updateError } = await supabase
      .from('User')
      .update({ 
        settings: updatedSettings,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select('settings')
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update settings'
      });
    }

    res.json({
      success: true,
      settings: updatedSettings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
