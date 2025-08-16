const express = require('express');
const prisma = require('../lib/prisma');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
router.get('/', async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: collections
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
    const collection = await prisma.collection.findFirst({
      where: { 
        slug: req.params.slug, 
        status: 'active' 
      }
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
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
