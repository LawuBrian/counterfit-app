const fs = require('fs');
const path = require('path');

// Test the new backend-only upload structure
console.log('🧪 Testing backend-only upload system...');

// Check if organized directories exist on BACKEND
const organizedDirs = {
  outerwear: path.join(__dirname, 'uploads', 'images', 'outerwear'),
  bottoms: path.join(__dirname, 'uploads', 'images', 'bottoms'),
  tops: path.join(__dirname, 'uploads', 'images', 'tops'),
  accessories: path.join(__dirname, 'uploads', 'images', 'accessories'),
  collections: path.join(__dirname, 'uploads', 'images', 'collections'),
  products: path.join(__dirname, 'uploads', 'images', 'products')
};

console.log('📁 Checking backend organized directories:');

Object.entries(organizedDirs).forEach(([category, dirPath]) => {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    console.log(`✅ ${category}: ${dirPath}`);
    console.log(`   Files: ${files.length}`);
    if (files.length > 0) {
      console.log(`   Sample: ${files.slice(0, 3).join(', ')}`);
    }
  } else {
    console.log(`❌ ${category}: ${dirPath} - NOT FOUND`);
  }
});

// Check if we can write to these directories
console.log('\n🔍 Testing write permissions:');

Object.entries(organizedDirs).forEach(([category, dirPath]) => {
  if (fs.existsSync(dirPath)) {
    try {
      const testFile = path.join(dirPath, 'test-write-permission.tmp');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
      console.log(`✅ ${category}: Write permission OK`);
    } catch (error) {
      console.log(`❌ ${category}: Write permission failed - ${error.message}`);
    }
  }
});

console.log('\n🚀 New upload system architecture:');
console.log('📝 1. Images saved to BACKEND: /uploads/images/{category}/');
console.log('🔗 2. Backend serves images via: /uploads/images/{category}/{filename}');
console.log('🌐 3. Frontend gets URLs like: https://counterfit-backend.onrender.com/uploads/images/outerwear/FILENAME.jpeg');
console.log('✅ 4. No more frontend folder dependencies!');
console.log('✅ 5. Works in production (Render + Vercel)');
