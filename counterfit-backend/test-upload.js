const fs = require('fs');
const path = require('path');

// Test the uploads directory
console.log('🧪 Testing uploads directory...');

const uploadsDir = path.join(__dirname, 'uploads');
const productsUploadsDir = path.join(uploadsDir, 'products');

console.log('📁 Uploads directory:', uploadsDir);
console.log('📁 Products uploads directory:', productsUploadsDir);

// Check if directories exist
console.log('📁 Uploads directory exists:', fs.existsSync(uploadsDir));
console.log('📁 Products uploads directory exists:', fs.existsSync(productsUploadsDir));

// List files in products directory
if (fs.existsSync(productsUploadsDir)) {
  try {
    const files = fs.readdirSync(productsUploadsDir);
    console.log('📁 Files in products directory:', files);
    console.log('📊 Total files:', files.length);
    
    // Show file details
    files.forEach(file => {
      const filePath = path.join(productsUploadsDir, file);
      const stats = fs.statSync(filePath);
      console.log(`📄 ${file}: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    });
  } catch (error) {
    console.error('❌ Error reading products directory:', error.message);
  }
} else {
  console.log('❌ Products uploads directory does not exist');
}

console.log('✅ Test completed');
