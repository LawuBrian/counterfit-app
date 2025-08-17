const express = require('express');
const { supabase } = require('../lib/supabase');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, limit } = req.query;
    
    let query = supabase
      .from('Collection')
      .select('*')
      .order('createdAt', { ascending: false });
    
    // If status is specified, filter by it, otherwise show all
    if (status) {
      query = query.eq('status', status);
    }
    
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: collections, error } = await query;

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch collections',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: collections || []
    });
  } catch (error) {
    console.error('Get collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single collection
// @route   GET /api/collections/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { data: collection, error } = await supabase
      .from('Collection')
      .select('*')
      .eq('slug', req.params.slug)
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
        message: 'Failed to fetch collection',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Get collection error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create collection
// @route   POST /api/collections
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
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
// @route   PUT /api/collections/:id
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
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
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update collection',
        error: error.message
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
// @route   DELETE /api/collections/:id
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('Collection')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete collection',
        error: error.message
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

// @desc    Get featured collections
// @route   GET /api/collections/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { data: collections, error } = await supabase
      .from('Collection')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch featured collections',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: collections || []
    });
  } catch (error) {
    console.error('Get featured collections error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
