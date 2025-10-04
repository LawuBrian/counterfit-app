const express = require('express');
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');
const { supabase } = require('../lib/supabase');
const router = express.Router();

// Configure multer to store files in memory (not disk)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 10 // Maximum 10 files
  }
});

/**
 * Upload image to Supabase Storage
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} filename - The filename
 * @param {string} category - The category (outerwear, tops, etc.)
 * @param {string} mimetype - The file mimetype
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
async function uploadToSupabase(fileBuffer, filename, category, mimetype) {
  try {
    // Clean the filename
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '');
    const storagePath = `${category}/${cleanFilename}`;
    
    console.log('📤 Uploading to Supabase Storage:', storagePath);

    // Upload to Supabase Storage bucket 'product-images'
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(storagePath, fileBuffer, {
        contentType: mimetype,
        upsert: true, // Overwrite if exists
        cacheControl: '31536000' // Cache for 1 year
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      throw error;
    }

    console.log('✅ Uploaded to Supabase:', data.path);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(storagePath);

    console.log('🌐 Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('❌ Upload to Supabase failed:', error);
    throw error;
  }
}

// @desc    Upload single organized image to Supabase
// @route   POST /api/upload/image?category=outerwear
// @access  Private/Admin
router.post('/image', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    console.log('📸 POST /api/upload/image - Single organized upload to Supabase');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const category = req.query.category || 'products';
    const validCategories = ['outerwear', 'bottoms', 'tops', 'accessories', 'collections', 'products'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Generate filename with timestamp
    const timestamp = Date.now();
    const originalName = req.file.originalname;
    const ext = originalName.substring(originalName.lastIndexOf('.'));
    const baseName = originalName.substring(0, originalName.lastIndexOf('.')).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const filename = `${baseName}-${timestamp}${ext}`;

    // Upload to Supabase
    const publicUrl = await uploadToSupabase(
      req.file.buffer,
      filename,
      category,
      req.file.mimetype
    );

    res.json({
      success: true,
      message: 'Image uploaded successfully to Supabase',
      data: {
        url: publicUrl,
        path: `${category}/${filename}`,
        category,
        filename
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// @desc    Upload multiple organized images to Supabase
// @route   POST /api/upload/images?category=outerwear
// @access  Private/Admin
router.post('/images', protect, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    console.log('📸 POST /api/upload/images - Multiple organized uploads to Supabase');
    console.log(`📦 Received ${req.files?.length || 0} files`);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const category = req.query.category || 'products';
    const validCategories = ['outerwear', 'bottoms', 'tops', 'accessories', 'collections', 'products'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Upload all files to Supabase
    const uploadPromises = req.files.map(async (file) => {
      const timestamp = Date.now();
      const originalName = file.originalname;
      const ext = originalName.substring(originalName.lastIndexOf('.'));
      const baseName = originalName.substring(0, originalName.lastIndexOf('.')).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      const filename = `${baseName}-${timestamp}${ext}`;

      try {
        const publicUrl = await uploadToSupabase(
          file.buffer,
          filename,
          category,
          file.mimetype
        );

        return {
          success: true,
          url: publicUrl,
          path: `${category}/${filename}`,
          originalName: file.originalname,
          filename
        };
      } catch (error) {
        console.error(`❌ Failed to upload ${file.originalname}:`, error);
        return {
          success: false,
          originalName: file.originalname,
          error: error.message
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    res.json({
      success: true,
      message: `Uploaded ${successful.length} of ${req.files.length} images to Supabase`,
      data: {
        uploaded: successful,
        failed: failed,
        category
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// @desc    Delete image from Supabase
// @route   DELETE /api/upload/image?path=outerwear/IMAGE.jpeg
// @access  Private/Admin
router.delete('/image', protect, adminOnly, async (req, res) => {
  try {
    const { path: imagePath } = req.query;
    
    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: 'Image path is required'
      });
    }

    console.log('🗑️  Deleting from Supabase:', imagePath);

    const { data, error } = await supabase.storage
      .from('product-images')
      .remove([imagePath]);

    if (error) {
      console.error('❌ Delete error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Image deleted successfully',
      data
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

// @desc    List images from Supabase
// @route   GET /api/upload/images?category=outerwear
// @access  Private/Admin
router.get('/images', protect, adminOnly, async (req, res) => {
  try {
    const { category } = req.query;
    const prefix = category ? `${category}/` : '';

    console.log('📋 Listing Supabase images with prefix:', prefix || 'all');

    const { data, error } = await supabase.storage
      .from('product-images')
      .list(category || '', {
        limit: 1000,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error('❌ List error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to list images',
        error: error.message
      });
    }

    // Get public URLs for all images
    const images = data.map(file => {
      const fullPath = category ? `${category}/${file.name}` : file.name;
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fullPath);

      return {
        name: file.name,
        path: fullPath,
        url: publicUrl,
        size: file.metadata?.size,
        createdAt: file.created_at,
        updatedAt: file.updated_at
      };
    });

    res.json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('❌ List error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list images',
      error: error.message
    });
  }
});

module.exports = router;

