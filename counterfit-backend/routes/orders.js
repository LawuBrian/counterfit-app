const express = require('express');
const { supabase } = require('../lib/supabase');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    console.log('🚀 POST /api/orders - Route hit!')
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2))
    console.log('👤 User ID from token:', req.user.id)
    
    // Generate UUID for order ID
    const orderId = require('crypto').randomUUID();
    
    const orderData = {
      id: orderId, // Add the generated UUID
      ...req.body,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('📋 Final order data:', JSON.stringify(orderData, null, 2))

    const { data: order, error } = await supabase
      .from('Order')
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create order',
        error: error.message
      });
    }

    console.log('✅ Order created successfully:', {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount
    })

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders/my
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('Order')
      .select('*')
      .eq('userId', req.user.id)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: orders || []
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    let query = supabase
      .from('Order')
      .select('*')
      .eq('id', req.params.id);
    
    // Non-admin users can only see their own orders
    if (req.user.role !== 'ADMIN') {
      query = query.eq('userId', req.user.id);
    }

    const { data: order, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch order',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus, trackingNumber, carrier, estimatedDelivery } = req.body;

    const updateData = {
      status,
      paymentStatus,
      trackingNumber,
      carrier,
      updatedAt: new Date().toISOString()
    };

    if (estimatedDelivery) {
      updateData.estimatedDelivery = new Date(estimatedDelivery).toISOString();
    }

    const { data: order, error } = await supabase
      .from('Order')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update order',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    
    let query = supabase
      .from('Order')
      .select('*, User(id, firstName, lastName, email)')
      .order('createdAt', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (limit) {
      const offset = (parseInt(page) - 1) * parseInt(limit);
      query = query.range(offset, offset + parseInt(limit) - 1);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: orders || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0
      }
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
