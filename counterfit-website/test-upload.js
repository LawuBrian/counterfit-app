// Test script to verify the upload system
const fs = require('fs');
const path = require('path');

// Test the organized directory structure
console.log('🧪 Testing organized directory structure...');

const publicDir = path.join(__dirname, 'public', 'images');
const categories = ['outerwear', 'bottoms', 'tops', 'accessories', 'collections'];

console.log('📁 Public images directory:', publicDir);

categories.forEach(category => {
  const categoryDir = path.join(publicDir, category);
  if (fs.existsSync(categoryDir)) {
    const files = fs.readdirSync(categoryDir);
    console.log(`✅ ${category}: ${files.length} files`);
    if (files.length > 0) {
      console.log(`   Sample files: ${files.slice(0, 3).join(', ')}`);
    }
  } else {
    console.log(`❌ ${category}: Directory not found`);
  }
});

console.log('\n🔍 Checking for existing image files...');

// Check if there are any existing images in the organized structure
let totalImages = 0;
categories.forEach(category => {
  const categoryDir = path.join(publicDir, category);
  if (fs.existsSync(categoryDir)) {
    const files = fs.readdirSync(categoryDir);
    totalImages += files.length;
  }
});

console.log(`📊 Total images found: ${totalImages}`);

if (totalImages === 0) {
  console.log('\n⚠️ No images found in organized structure');
  console.log('   This is expected if you haven\'t uploaded any images yet');
} else {
  console.log('\n✅ Images found in organized structure');
  console.log('   The upload system should work correctly');
}

console.log('\n🚀 Next steps:');
console.log('1. Start your backend server');
console.log('2. Start your frontend server');
console.log('3. Try uploading an image through the admin panel');
console.log('4. Check that images are saved to the correct organized folders');
console.log('5. Verify that the database stores the correct image paths');
