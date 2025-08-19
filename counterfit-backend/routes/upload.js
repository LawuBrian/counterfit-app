const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists with absolute paths
const uploadsDir = path.join(__dirname, '..', 'uploads');
const productsUploadsDir = path.join(uploadsDir, 'products');

// Create organized image directories on the BACKEND (not frontend)
const organizedDirs = {
  outerwear: path.join(__dirname, '..', 'uploads', 'images', 'outerwear'),
  bottoms: path.join(__dirname, '..', 'uploads', 'images', 'bottoms'),
  tops: path.join(__dirname, '..', 'uploads', 'images', 'tops'),
  accessories: path.join(__dirname, '..', 'uploads', 'images', 'accessories'),
  collections: path.join(__dirname, '..', 'uploads', 'images', 'collections'),
  products: path.join(__dirname, '..', 'uploads', 'images', 'products')
};

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

if (!fs.existsSync(productsUploadsDir)) {
  fs.mkdirSync(productsUploadsDir, { recursive: true });
  console.log('📁 Created products uploads directory:', productsUploadsDir);
}

// Create organized directories if they don't exist
Object.entries(organizedDirs).forEach(([category, dirPath]) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created ${category} directory:`, dirPath);
  }
});

// Configure multer for file uploads - organized version
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine category from query parameter or use default
    const category = req.query.category || 'products';
    const targetDir = organizedDirs[category] || organizedDirs.products;
    
    console.log('📁 Multer destination called with:', {
      file: file.originalname,
      category: category,
      destination: targetDir,
      exists: fs.existsSync(targetDir)
    });
    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // Use original filename or generate descriptive name
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    
    // Clean the filename (remove special characters, spaces)
    const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Generate filename: clean original name + timestamp + extension
    const timestamp = Date.now();
    const filename = `${cleanName}-${timestamp}${ext}`;
    
    console.log('📝 Generated filename:', filename);
    console.log('📁 Original name:', originalName);
    console.log('📁 Clean name:', cleanName);
    
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

// @desc    Serve uploaded images
// @route   GET /uploads/images/:category/:filename
// @access  Public
router.get('/uploads/images/:category/:filename', (req, res) => {
  const { category, filename } = req.params;
  const imagePath = path.join(__dirname, '..', 'uploads', 'images', category, filename);
  
  console.log('🖼️ Serving image:', { category, filename, imagePath });
  
  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    console.log('❌ Image not found:', imagePath);
    return res.status(404).json({ error: 'Image not found' });
  }
  
  // Set proper headers for image serving with optimization
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'image/jpeg'; // Default
  
  // Set correct content type based on file extension
  if (ext === '.jpg' || ext === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (ext === '.png') {
    contentType = 'image/png';
  } else if (ext === '.gif') {
    contentType = 'image/gif';
  } else if (ext === '.webp') {
    contentType = 'image/webp';
  }
  
  // Set aggressive caching headers for better performance
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year, immutable
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
  
  // Add ETag for better caching
  const stats = fs.statSync(imagePath);
  const etag = `"${stats.size}-${stats.mtime.getTime()}"`;
  res.setHeader('ETag', etag);
  
  // Check if client has cached version
  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end(); // Not Modified
  }
  
  // Stream the image file with error handling
  const stream = fs.createReadStream(imagePath);
  stream.pipe(res);
  
  stream.on('error', (error) => {
    console.error('Error streaming image:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error serving image' });
    }
  });
});

// @desc    Handle preflight CORS request
// @route   OPTIONS /api/upload/product-image
// @access  Public
router.options('/product-image', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
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
  console.log('📁 Query parameters:', req.query)
  console.log('📁 Category from query:', req.query.category)
  
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

    // Verify file was actually saved to the organized directory
    const category = req.query.category || 'products';
    const targetDir = organizedDirs[category] || organizedDirs.products;
    const savedFilePath = path.join(targetDir, req.file.filename);
    
    const fileExists = fs.existsSync(savedFilePath);
    console.log('🔍 File existence check:', {
      category: category,
      targetDir: targetDir,
      savedFilePath,
      exists: fileExists,
      size: fileExists ? fs.statSync(savedFilePath).size : 'N/A'
    });

    if (!fileExists) {
      console.error('❌ File was not saved to organized directory!');
      return res.status(500).json({
        success: false,
        message: 'File upload failed - file not saved to organized directory'
      });
    }

    // Generate backend URL that will serve the image
    const backendUrl = process.env.BACKEND_URL || 'https://counterfit-backend.onrender.com';
    const imageUrl = `${backendUrl}/uploads/images/${category}/${req.file.filename}`;
    
    console.log('🔗 Generated backend image URL:', imageUrl)
    console.log('📁 Category:', category)
    console.log('📁 Filename:', req.file.filename)
    
    const response = {
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        category: category
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

    // Return array of backend image URLs
    const category = req.query.category || 'products';
    const backendUrl = process.env.BACKEND_URL || 'https://counterfit-backend.onrender.com';
    const uploadedFiles = req.files.map(file => ({
      url: `${backendUrl}/uploads/images/${category}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      category: category
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
    const category = req.query.category || 'products';
    const targetDir = organizedDirs[category] || organizedDirs.products;
    const filePath = path.join(targetDir, filename);

    console.log('🗑️ Delete request:', {
      filename: filename,
      category: category,
      targetDir: targetDir,
      filePath: filePath
    });

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found in organized directory'
      });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'Image deleted successfully from organized directory'
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
