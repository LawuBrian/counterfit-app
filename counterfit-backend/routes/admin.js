const express = require('express');
const { supabase } = require('../lib/supabase');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Apply admin protection to all routes
router.use(protect, adminOnly);

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalCollections,
      recentOrders,
      topProducts
    ] = await Promise.all([
      supabase.from('User').select('id', { count: 'exact' }),
      supabase.from('Product').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('Order').select('id', { count: 'exact' }),
      supabase.from('Collection').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('Order').select('*, User(id, firstName, lastName, email)').order('createdAt', { ascending: false }).limit(5),
      supabase.from('Product').select('*').eq('status', 'published').order('salesCount', { ascending: false }).limit(5)
    ]);

    // Calculate total revenue
    const revenueResult = await supabase
      .from('Order')
      .select('totalAmount')
      .eq('paymentStatus', 'paid');

    const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers: totalUsers.count || 0,
          totalProducts: totalProducts.count || 0,
          totalOrders: totalOrders.count || 0,
          totalCollections: totalCollections.count || 0,
          totalRevenue
        },
        recentOrders: recentOrders.data || [],
        topProducts: topProducts.data || []
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all orders for admin
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    let query = supabase
      .from('Order')
      .select('*, User(id, firstName, lastName, email)')
      .order('createdAt', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { data: orders, error, count } = await query.range(offset, offset + parseInt(limit) - 1);

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }

    res.json({
      success: true,
      data: orders || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const { data: order, error } = await supabase
      .from('Order')
      .update({ 
        status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select('*, User(*)')
      .single();

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
        message: 'Failed to update order'
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

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { data: users, error, count } = await supabase
      .from('User')
      .select('id, firstName, lastName, email, createdAt')
      .order('createdAt', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

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
        total: count || 0,
        pages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
router.delete('/products/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('Product')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete product'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
router.put('/products/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const { data: product, error } = await supabase
      .from('Product')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update product'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
router.post('/products', async (req, res) => {
  console.log('🚀 POST /api/admin/products - Backend route hit!')
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2))
  console.log('🖼️ Images in request:', req.body.images)
  
  try {
    const productData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data: product, error } = await supabase
      .from('Product')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create product',
        error: error.message
      });
    }

    console.log('✅ Product created in database:', {
      id: product.id,
      name: product.name,
      images: product.images
    })

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all products for admin with enhanced filtering
// @route   GET /api/admin/products
// @access  Private/Admin
router.get('/products', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category,
      status,
      featured,
      isNew,
      isAvailable,
      stockCode,
      search,
      sort = 'createdAt'
    } = req.query;
    
    let query = supabase.from('Product').select('*');
    
    // Apply filters
    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);
    if (featured !== undefined) query = query.eq('featured', featured === 'true');
    if (isNew !== undefined) query = query.eq('isNew', isNew === 'true');
    if (isAvailable !== undefined) query = query.eq('isAvailable', isAvailable === 'true');
    if (stockCode) query = query.ilike('stockCode', `%${stockCode}%`);
    
    // Text search across name and description
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,stockCode.ilike.%${search}%`);
    }

    // Apply sorting
    if (sort === 'salesCount') {
      query = query.order('salesCount', { ascending: false });
    } else {
      query = query.order(sort, { ascending: false });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { data: products, error, count } = await query.range(offset, offset + parseInt(limit) - 1);

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products'
      });
    }

    res.json({
      success: true,
      data: products || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single product for admin
// @route   GET /api/admin/products/:id
// @access  Private/Admin
router.get('/products/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('Product')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch product'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get admin product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update product stock for specific size/color
// @route   PUT /api/admin/products/:id/stock
// @access  Private/Admin
router.put('/products/:id/stock', async (req, res) => {
  try {
    const { type, identifier, stock } = req.body;
    
    const { data: product, error: fetchError } = await supabase
      .from('Product')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    let updatedProduct = { ...product };

    if (type === 'size') {
      const sizeIndex = updatedProduct.sizes.findIndex(s => s.size === identifier);
      if (sizeIndex !== -1) {
        updatedProduct.sizes[sizeIndex].stock = stock;
        updatedProduct.sizes[sizeIndex].isAvailable = stock > 0;
      }
    } else if (type === 'color') {
      const colorIndex = updatedProduct.colors.findIndex(c => c.name === identifier);
      if (colorIndex !== -1) {
        updatedProduct.colors[colorIndex].stock = stock;
        updatedProduct.colors[colorIndex].isAvailable = stock > 0;
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from('Product')
      .update({
        sizes: updatedProduct.sizes,
        colors: updatedProduct.colors,
        updatedAt: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Supabase error:', updateError);
      return res.status(500).json({
        success: false,
        message: 'Failed to update stock'
      });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Bulk update product status
// @route   PUT /api/admin/products/bulk/status
// @access  Private/Admin
router.put('/products/bulk/status', async (req, res) => {
  try {
    const { productIds, status } = req.body;
    
    const { data, error } = await supabase
      .from('Product')
      .update({ 
        status,
        updatedAt: new Date().toISOString()
      })
      .in('id', productIds);

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update products'
      });
    }

    res.json({
      success: true,
      message: `Updated ${data?.length || 0} products`,
      data: { modifiedCount: data?.length || 0 }
    });
  } catch (error) {
    console.error('Bulk update products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get product analytics
// @route   GET /api/admin/products/analytics
// @access  Private/Admin
router.get('/products/analytics', async (req, res) => {
  try {
    const [
      totalProducts,
      activeProducts,
      draftProducts,
      featuredProducts,
      newProducts,
      lowStockProducts,
      topSellingProducts
    ] = await Promise.all([
      supabase.from('Product').select('id', { count: 'exact' }),
      supabase.from('Product').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('Product').select('id', { count: 'exact' }).eq('status', 'draft'),
      supabase.from('Product').select('id', { count: 'exact' }).eq('featured', true),
      supabase.from('Product').select('id', { count: 'exact' }).eq('isNew', true),
      supabase.from('Product').select('id', { count: 'exact' }).lt('totalStock', 10),
      supabase.from('Product').select('name, salesCount, price, images').eq('status', 'published').order('salesCount', { ascending: false }).limit(10)
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts: totalProducts.count || 0,
          activeProducts: activeProducts.count || 0,
          draftProducts: draftProducts.count || 0,
          featuredProducts: featuredProducts.count || 0,
          newProducts: newProducts.count || 0,
          lowStockProducts: lowStockProducts.count || 0
        },
        topSellingProducts: topSellingProducts.data || []
      }
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all collections for admin
// @route   GET /api/admin/collections
// @access  Private/Admin
router.get('/collections', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      featured,
      status,
      search,
      sort = 'createdAt'
    } = req.query;
    
    let query = supabase.from('Collection').select('*');
    
    // Apply filters
    if (featured !== undefined) query = query.eq('featured', featured === 'true');
    if (status) query = query.eq('status', status);
    
    // Text search across name and description
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    if (sort === 'createdAt') {
      query = query.order('createdAt', { ascending: false });
    } else {
      query = query.order(sort, { ascending: false });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { data: collections, error, count } = await query.range(offset, offset + parseInt(limit) - 1);

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch collections'
      });
    }

    res.json({
      success: true,
      data: collections || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single collection for admin
// @route   GET /api/admin/collections/:id
// @access  Private/Admin
router.get('/collections/:id', async (req, res) => {
  try {
    const { data: collection, error } = await supabase
      .from('Collection')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Collection not found'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch collection'
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Get admin collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new collection
// @route   POST /api/admin/collections
// @access  Private/Admin
router.post('/collections', async (req, res) => {
  try {
    const collectionData = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { data: collection, error } = await supabase
      .from('Collection')
      .insert(collectionData)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create collection',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: collection
    });
  } catch (error) {
    console.error('Create collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update collection
// @route   PUT /api/admin/collections/:id
// @access  Private/Admin
router.put('/collections/:id', async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    const { data: collection, error } = await supabase
      .from('Collection')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Collection not found'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update collection'
      });
    }

    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: collection
    });
  } catch (error) {
    console.error('Update collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete collection
// @route   DELETE /api/admin/collections/:id
// @access  Private/Admin
router.delete('/collections/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('Collection')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Collection not found'
        });
      }
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete collection'
      });
    }

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    console.error('Delete collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
