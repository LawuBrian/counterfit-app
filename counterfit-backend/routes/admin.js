const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Collection = require('../models/Collection');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Apply admin protection to all routes
// router.use(protect, adminOnly); // TODO: Re-enable after fixing auth flow

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
      User.countDocuments({ isActive: true }),
      Product.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      Collection.countDocuments({ status: 'active' }),
      Order.find().sort('-createdAt').limit(5).populate('user', 'firstName lastName email'),
      Product.find({ status: 'active' }).sort('-salesCount').limit(5)
    ]);

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalProducts,
          totalOrders,
          totalCollections,
          totalRevenue
        },
        recentOrders,
        topProducts
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
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
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
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
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

    const users = await User.find()
      .select('-password')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await User.countDocuments();

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
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
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
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
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    if (error.code === 11000) {
      let message = 'Duplicate field error';
      if (error.keyPattern?.sku) message = 'Product with this SKU already exists';
      else if (error.keyPattern?.barcode) message = 'Product with this barcode already exists';
      else if (error.keyPattern?.stockCode) message = 'Product with this stock code already exists';
      
      return res.status(400).json({
        success: false,
        message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Public (for now - TODO: Add proper auth)
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      let message = 'Duplicate field error';
      if (error.keyPattern?.sku) message = 'Product with this SKU already exists';
      else if (error.keyPattern?.barcode) message = 'Product with this barcode already exists';
      else if (error.keyPattern?.stockCode) message = 'Product with this stock code already exists';
      
      return res.status(400).json({
        success: false,
        message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all products for admin with enhanced filtering
// @route   GET /api/admin/products
// @access  Public (for now - TODO: Add proper auth)
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
      sort = '-createdAt'
    } = req.query;
    
    let query = {};
    
    // Apply filters
    if (category) query.category = category;
    if (status) query.status = status;
    if (featured !== undefined) query.featured = featured === 'true';
    if (isNew !== undefined) query.isNew = isNew === 'true';
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (stockCode) query.stockCode = new RegExp(stockCode, 'i');
    
    // Text search across name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { stockCode: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('collections', 'name slug')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
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
    const product = await Product.findById(req.params.id)
      .populate('collections', 'name slug');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get admin product error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
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
    const { type, identifier, stock } = req.body; // type: 'size'|'color', identifier: size name or color name
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (type === 'size') {
      const sizeIndex = product.sizes.findIndex(s => s.size === identifier);
      if (sizeIndex !== -1) {
        product.sizes[sizeIndex].stock = stock;
        product.sizes[sizeIndex].isAvailable = stock > 0;
      }
    } else if (type === 'color') {
      const colorIndex = product.colors.findIndex(c => c.name === identifier);
      if (colorIndex !== -1) {
        product.colors[colorIndex].stock = stock;
        product.colors[colorIndex].isAvailable = stock > 0;
      }
    }

    await product.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product
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
    
    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { status }
    );

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} products`,
      data: { modifiedCount: result.modifiedCount }
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
      topSellingProducts,
      categoryStats
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'draft' }),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ isNew: true }),
      Product.countDocuments({ 
        $or: [
          { 'inventory.quantity': { $lte: 10 } },
          { 'sizes.stock': { $lte: 10 } },
          { 'colors.stock': { $lte: 10 } }
        ]
      }),
      Product.find({ status: 'active' })
        .sort('-salesCount')
        .limit(10)
        .select('name salesCount price primaryImage'),
      Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          draftProducts,
          featuredProducts,
          newProducts,
          lowStockProducts
        },
        topSellingProducts,
        categoryStats
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
      sort = '-createdAt'
    } = req.query;
    
    let query = {};
    
    // Apply filters
    if (featured !== undefined) query.featured = featured === 'true';
    if (status) query.status = status;
    
    // Text search across name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const collections = await Collection.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Collection.countDocuments(query);

    res.json({
      success: true,
      data: collections,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
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
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Get admin collection error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
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
    const collection = await Collection.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: collection
    });
  } catch (error) {
    console.error('Create collection error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Collection with this name already exists'
      });
    }
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
    const collection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Collection updated successfully',
      data: collection
    });
  } catch (error) {
    console.error('Update collection error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
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
    const collection = await Collection.findByIdAndDelete(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    console.error('Delete collection error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
