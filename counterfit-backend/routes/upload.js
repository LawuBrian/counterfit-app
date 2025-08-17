const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists with absolute paths
const uploadsDir = path.join(__dirname, '..', 'uploads');
const productsUploadsDir = path.join(uploadsDir, 'products');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

if (!fs.existsSync(productsUploadsDir)) {
  fs.mkdirSync(productsUploadsDir, { recursive: true });
  console.log('📁 Created products uploads directory:', productsUploadsDir);
}

// Configure multer for file uploads - simplified version
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📁 Multer destination:', productsUploadsDir);
    cb(null, productsUploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'product-' + uniqueSuffix + path.extname(file.originalname);
    console.log('📝 Generated filename:', filename);
    cb(null, filename);
  }
});

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
    fileSize: 100 * 1024 * 1024, // 100MB limit to handle large images
    files: 10 // Maximum 10 files
  }
});

// @desc    Handle preflight CORS request
// @route   OPTIONS /api/upload/product-image
// @access  Public
router.options('/product-image', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.status(200).end();
});

// @desc    Upload single product image
// @route   POST /api/upload/product-image
// @access  Public (for now - TODO: Add proper auth)
router.post('/product-image', upload.single('image'), (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.log('🖼️ Upload route hit - /api/upload/product-image')
  console.log('📁 Request body:', req.body)
  console.log('📁 Request file:', req.file)
  console.log('📁 Request headers:', req.headers)
  
  try {
    if (!req.file) {
      console.log('❌ No file uploaded - req.file is undefined')
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log('✅ File received:', {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    })

    // Return the file URL immediately - use full backend URL
    const backendUrl = process.env.BACKEND_URL || `https://${req.get('host')}`;
    const fileUrl = `${backendUrl}/uploads/products/${req.file.filename}`;
    console.log('🔗 Generated file URL:', fileUrl)
    
    const response = {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      }
    }
    
    console.log('📤 Sending response:', response)
    res.json(response)
    
  } catch (error) {
    console.error('❌ Upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

// @desc    Handle preflight CORS request for multiple images
// @route   OPTIONS /api/upload/product-images
// @access  Public
router.options('/product-images', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.status(200).end();
});

// @desc    Upload multiple product images
// @route   POST /api/upload/product-images
// @access  Public (for now - TODO: Add proper auth)
router.post('/product-images', upload.array('images', 10), (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Return array of file URLs - use full backend URL
    const backendUrl = process.env.BACKEND_URL || `https://${req.get('host')}`;
    const uploadedFiles = req.files.map(file => ({
      url: `${backendUrl}/uploads/products/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size
    }));
    
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
    const filePath = path.join(productsUploadsDir, filename);

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
        message: 'File too large. Maximum size is 100MB.'
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

  console.error('Upload route error:', error);
  res.status(500).json({
    success: false,
    message: 'Server error during upload'
  });
});

module.exports = router;
