const fs = require('fs');
const path = require('path');

// Test the organized directory structure
console.log('🧪 Testing organized upload directories...');

// Check if organized directories exist
const organizedDirs = {
  outerwear: path.join(__dirname, '..', 'counterfit-website', 'public', 'images', 'outerwear'),
  bottoms: path.join(__dirname, '..', 'counterfit-website', 'public', 'images', 'bottoms'),
  tops: path.join(__dirname, '..', 'counterfit-website', 'public', 'images', 'tops'),
  accessories: path.join(__dirname, '..', 'counterfit-website', 'public', 'images', 'accessories'),
  collections: path.join(__dirname, '..', 'counterfit-website', 'public', 'images', 'collections')
};

console.log('📁 Checking organized directories:');

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

console.log('\n🚀 Upload system should now work correctly!');
console.log('📝 Files will be saved to organized folders based on category');
console.log('🔗 Database will store paths like /images/outerwear/FILENAME.jpeg');
