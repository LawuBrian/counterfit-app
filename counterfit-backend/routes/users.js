const express = require('express');
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @desc    Add/Remove product from wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
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

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { wishlist: newWishlist }
    });

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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { wishlist: true }
    });

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

module.exports = router;
