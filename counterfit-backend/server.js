const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import Supabase client instead of Prisma
const { testSupabaseConnection } = require('./lib/supabase');

// Trust proxy for rate limiting (important for Render)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS configuration - allow both localhost and production domains
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://counterfit.co.za',
    'https://www.counterfit.co.za',
    'https://counterfit-app.vercel.app',
    'https://counterfit-8vem5mnzh-counterfits-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Static files - serve uploads with proper headers and ensure directory exists
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory:', uploadsDir);
}

// Ensure products subdirectory exists
const productsUploadsDir = path.join(uploadsDir, 'products');
if (!fs.existsSync(productsUploadsDir)) {
  fs.mkdirSync(productsUploadsDir, { recursive: true });
  console.log('📁 Created products uploads directory:', productsUploadsDir);
}

// Specific route for serving product images with proper CORS
app.get('/uploads/products/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(productsUploadsDir, filename);
  
  // Set CORS headers for images
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      success: false, 
      message: 'Image not found',
      filename,
      path: filePath
    });
  }
  
  // Set proper content type based on file extension
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    res.setHeader('Content-Type', 'image/jpeg');
  } else if (ext === '.png') {
    res.setHeader('Content-Type', 'image/png');
  } else if (ext === '.gif') {
    res.setHeader('Content-Type', 'image/gif');
  } else if (ext === '.webp') {
    res.setHeader('Content-Type', 'image/webp');
  }
  
  // Set cache headers
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  
  // Stream the file
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  
  stream.on('error', (error) => {
    console.error('Error streaming image:', error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        message: 'Error serving image' 
      });
    }
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, filePath) => {
    // Allow cross-origin requests for images from any domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Set proper content type for images
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (filePath.endsWith('.webp')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  }
}));

// Debug route to check uploads directory
app.get('/debug/uploads', (req, res) => {
  try {
    const files = fs.readdirSync(productsUploadsDir);
    res.json({
      uploadsDir,
      productsUploadsDir,
      files,
      exists: fs.existsSync(productsUploadsDir),
      totalFiles: files.length
    });
  } catch (error) {
    res.json({
      error: error.message,
      uploadsDir,
      productsUploadsDir,
      exists: fs.existsSync(productsUploadsDir)
    });
  }
});

// Test route to check if a specific image exists
app.get('/test-image/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(productsUploadsDir, filename);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      const stats = fs.statSync(filePath);
      res.json({
        filename,
        exists: true,
        size: stats.size,
        path: filePath
      });
    } else {
      res.json({
        filename,
        exists: false,
        path: filePath
      });
    }
  } catch (error) {
    res.json({
      error: error.message,
      filename: req.params.filename
    });
  }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));
app.use('/api/collections', require('./routes/collections'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api', require('./routes/health'));
app.use('/api/test', require('./routes/test'));

// Root route for health checks
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Counterfit Backend API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  
  // Handle multer errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File too large. Maximum size is 100MB.'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      success: false,
      message: 'Too many files. Maximum is 10 images.'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// Database connection with Supabase
console.log('🔍 Environment check:')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL)
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

testSupabaseConnection()
  .then((success) => {
    if (success) {
      console.log('✅ Connected to Supabase database');
      
      app.listen(PORT, () => {
        console.log(`🚀 Counterfit Backend Server running on port ${PORT}`);
        console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } else {
      console.error('❌ Failed to connect to Supabase database');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('❌ Database connection error:', err);
    console.error('💡 Error details:', {
      message: err.message
    });
    process.exit(1);
  });
