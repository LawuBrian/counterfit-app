const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { supabase } = require('../lib/supabase');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['outerwear', 'tops', 'bottoms', 'accessories']),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
  query('sort').optional().isIn(['price', '-price', 'name', '-name', 'createdAt', '-createdAt', 'featured'])
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

    const {
      page = 1,
      limit = 12,
      category,
      collection,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt',
      featured,
      status = 'active'
    } = req.query;

    // Execute query with Supabase
    let query = supabase
      .from('Product')
      .select('*', { count: 'exact' })
      .eq('status', status);

    // Apply filters
    if (category) {
      query = query.eq('category', category);
    }
    
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (minPrice || maxPrice) {
      if (minPrice) query = query.gte('price', parseFloat(minPrice));
      if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
    }

    // Apply sorting
    if (sort === '-createdAt') query = query.order('createdAt', { ascending: false });
    else if (sort === 'createdAt') query = query.order('createdAt', { ascending: true });
    else if (sort === '-price') query = query.order('price', { ascending: false });
    else if (sort === 'price') query = query.order('price', { ascending: true });
    else if (sort === '-name') query = query.order('name', { ascending: false });
    else if (sort === 'name') query = query.order('name', { ascending: true });
    else if (sort === 'featured') query = query.order('featured', { ascending: false });

    // Apply pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(skip, skip + parseInt(limit) - 1);

    const { data: products, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('Product')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('Product')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, adminOnly, [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['outerwear', 'tops', 'bottoms', 'accessories']).withMessage('Invalid category'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
  body('stockCode').optional().trim().notEmpty().withMessage('Stock code cannot be empty'),
  body('sizes').optional().isArray().withMessage('Sizes must be an array'),
  body('colors').optional().isArray().withMessage('Colors must be an array')
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

    const { data: product, error } = await supabase
      .from('Product')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Supabase error code for unique constraint violation
        let message = 'Duplicate field error';
        if (error.message.includes('stockCode')) message = 'Product with this stock code already exists';
        else if (error.message.includes('slug')) message = 'Product with this slug already exists';
        return res.status(400).json({
          success: false,
          message
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, [
  body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Product description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().isIn(['outerwear', 'tops', 'bottoms', 'accessories']).withMessage('Invalid category')
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

    const { data: product, error } = await supabase
      .from('Product')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
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

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Product')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
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

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
router.get('/:id/related', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('Product')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // Supabase error code for not found
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      throw error;
    }

    // Find related products in same category
    const { data: related, error: relatedError } = await supabase
      .from('Product')
      .select('*')
      .eq('status', 'active')
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(4)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (relatedError) {
      throw relatedError;
    }

    res.json({
      success: true,
      data: related
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
