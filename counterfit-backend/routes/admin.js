const express = require('express');
const prisma = require('../lib/prisma');
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
      prisma.user.count(),
      prisma.product.count({ where: { status: 'active' } }),
      prisma.order.count(),
      prisma.collection.count({ where: { status: 'active' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, lastName: true, email: true } } }
      }),
      prisma.product.findMany({
        where: { status: 'active' },
        take: 5,
        orderBy: { salesCount: 'desc' }
      })
    ]);

    // Calculate total revenue
    const revenueResult = await prisma.order.aggregate({
      where: { 'payment.status': 'paid' },
      _sum: { total: true }
    });
    const totalRevenue = revenueResult._sum.total || 0;

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
    
    let where = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });

    const total = await prisma.order.count({ where });

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
    
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: { user: true }
    });

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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });

    const total = await prisma.user.count();

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
    const product = await prisma.product.delete({
      where: { id: req.params.id }
    });

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
    if (error.code === 'P2025') { // Prisma's not found error code
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
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
      include: { collections: true }
    });

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
    if (error.code === 'P2025') { // Prisma's not found error code
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    if (error.code === 'P2002') { // Prisma's unique constraint error code
      let message = 'Duplicate field error';
      if (error.meta?.target?.includes('sku')) message = 'Product with this SKU already exists';
      else if (error.meta?.target?.includes('barcode')) message = 'Product with this barcode already exists';
      else if (error.meta?.target?.includes('stockCode')) message = 'Product with this stock code already exists';
      
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
    const product = await prisma.product.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 'P2002') { // Prisma's unique constraint error code
      let message = 'Duplicate field error';
      if (error.meta?.target?.includes('sku')) message = 'Product with this SKU already exists';
      else if (error.meta?.target?.includes('barcode')) message = 'Product with this barcode already exists';
      else if (error.meta?.target?.includes('stockCode')) message = 'Product with this stock code already exists';
      
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
      sort = 'createdAt'
    } = req.query;
    
    let where = {};
    
    // Apply filters
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured !== undefined) where.featured = featured === 'true';
    if (isNew !== undefined) where.isNew = isNew === 'true';
    if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
    if (stockCode) where.stockCode = { contains: stockCode, mode: 'insensitive' };
    
    // Text search across name and description
    if (search) {
      where.$or = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { stockCode: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: { collections: true },
      orderBy: sort === 'salesCount' ? { salesCount: 'desc' } : { [sort]: 'desc' },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });

    const total = await prisma.product.count({ where });

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
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { collections: true }
    });

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
    if (error.code === 'P2025') { // Prisma's not found error code
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
    
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
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

    await prisma.product.update({
      where: { id: req.params.id },
      data: {
        sizes: product.sizes,
        colors: product.colors
      }
    });

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
    
    const result = await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { status }
    });

    res.json({
      success: true,
      message: `Updated ${result.count} products`,
      data: { modifiedCount: result.count }
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
      prisma.product.count(),
      prisma.product.count({ where: { status: 'active' } }),
      prisma.product.count({ where: { status: 'draft' } }),
      prisma.product.count({ where: { featured: true } }),
      prisma.product.count({ where: { isNew: true } }),
      prisma.product.count({ 
        where: { 
          OR: [
            { 'inventory.quantity': { lte: 10 } },
            { 'sizes.stock': { lte: 10 } },
            { 'colors.stock': { lte: 10 } }
          ]
        }
      }),
      prisma.product.findMany({
        where: { status: 'active' },
        take: 10,
        select: { name: true, salesCount: true, price: true, primaryImage: true }
      }),
      prisma.product.groupBy({
        by: 'category',
        _count: { _all: true },
        orderBy: { _count: { _all: 'desc' } }
      })
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
      sort = 'createdAt'
    } = req.query;
    
    let where = {};
    
    // Apply filters
    if (featured !== undefined) where.featured = featured === 'true';
    if (status) where.status = status;
    
    // Text search across name and description
    if (search) {
      where.$or = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const collections = await prisma.collection.findMany({
      where,
      orderBy: sort === 'createdAt' ? { createdAt: 'desc' } : { [sort]: 'desc' },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit)
    });

    const total = await prisma.collection.count({ where });

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
    const collection = await prisma.collection.findUnique({
      where: { id: req.params.id }
    });

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
    if (error.code === 'P2025') { // Prisma's not found error code
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
    const collection = await prisma.collection.create({
      data: req.body
    });

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      data: collection
    });
  } catch (error) {
    console.error('Create collection error:', error);
    if (error.code === 'P2002') { // Prisma's unique constraint error code
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
    const collection = await prisma.collection.update({
      where: { id: req.params.id },
      data: req.body,
      include: { products: true }
    });

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
    if (error.code === 'P2025') { // Prisma's not found error code
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
    const collection = await prisma.collection.delete({
      where: { id: req.params.id }
    });

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
    if (error.code === 'P2025') { // Prisma's not found error code
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
