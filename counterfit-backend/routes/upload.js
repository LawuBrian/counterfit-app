const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = 'uploads/products';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads with optimizations
const storage = multer.memoryStorage(); // Use memory storage for faster processing

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
    fileSize: 5 * 1024 * 1024, // Reduced to 5MB for faster uploads
    files: 10 // Maximum 10 files
  }
});

// Helper function to save file to disk
const saveFileToDisk = (file, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(uploadsDir, filename);
    const writeStream = fs.createWriteStream(filePath);
    
    writeStream.on('finish', () => resolve(filePath));
    writeStream.on('error', reject);
    
    writeStream.write(file.buffer);
    writeStream.end();
  });
};

// @desc    Upload single product image
// @route   POST /api/upload/product-image
// @access  Public (for now - TODO: Add proper auth)
router.post('/product-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'product-' + uniqueSuffix + path.extname(req.file.originalname);
    
    // Save file to disk
    await saveFileToDisk(req.file, filename);

    // Return the file URL immediately
    const fileUrl = `/uploads/products/${filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: fileUrl,
        filename: filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

// @desc    Upload multiple product images
// @route   POST /api/upload/product-images
// @access  Public (for now - TODO: Add proper auth)
router.post('/product-images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Process files in parallel for faster uploads
    const uploadPromises = req.files.map(async (file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = 'product-' + uniqueSuffix + path.extname(file.originalname);
      
      await saveFileToDisk(file, filename);
      
      return {
        url: `/uploads/products/${filename}`,
        filename: filename,
        originalName: file.originalname,
        size: file.size
      };
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    
    res.json({
      success: true,
      message: `${uploadedFiles.length} image(s) uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

// @desc    Delete uploaded image
// @route   DELETE /api/upload/product-image/:filename
// @access  Private/Admin
router.delete('/product-image/:filename', protect, adminOnly, (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deletion'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 images.'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed!'
    });
  }

  next(error);
});

module.exports = router;
