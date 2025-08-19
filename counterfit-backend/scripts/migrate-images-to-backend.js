const fs = require('fs');
const path = require('path');

// Migration script to move all frontend images to backend
console.log('🚀 Starting image migration to backend-only system...');

// Paths
const frontendImagesDir = path.join(__dirname, '..', '..', 'counterfit-website', 'public', 'images');
const backendImagesDir = path.join(__dirname, '..', 'uploads', 'images');

// Categories to migrate
const categories = ['outerwear', 'bottoms', 'tops', 'accessories', 'collections'];

console.log('📁 Frontend images directory:', frontendImagesDir);
console.log('📁 Backend images directory:', backendImagesDir);

// Ensure backend directories exist
categories.forEach(category => {
  const backendCategoryDir = path.join(backendImagesDir, category);
  if (!fs.existsSync(backendCategoryDir)) {
    fs.mkdirSync(backendCategoryDir, { recursive: true });
    console.log(`✅ Created backend directory: ${category}`);
  }
});

// Migration statistics
let totalImages = 0;
let migratedImages = 0;
let failedImages = 0;

// Migrate images by category
categories.forEach(category => {
  const frontendCategoryDir = path.join(frontendImagesDir, category);
  const backendCategoryDir = path.join(backendImagesDir, category);
  
  if (!fs.existsSync(frontendCategoryDir)) {
    console.log(`⚠️ Frontend category directory not found: ${category}`);
    return;
  }
  
  const files = fs.readdirSync(frontendCategoryDir);
  console.log(`\n📁 Migrating ${category}: ${files.length} files`);
  
  files.forEach(file => {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif')) {
      totalImages++;
      
      const sourcePath = path.join(frontendCategoryDir, file);
      const destPath = path.join(backendCategoryDir, file);
      
      try {
        // Copy file to backend
        fs.copyFileSync(sourcePath, destPath);
        
        // Verify copy was successful
        if (fs.existsSync(destPath)) {
          const sourceSize = fs.statSync(sourcePath).size;
          const destSize = fs.statSync(destPath).size;
          
          if (sourceSize === destSize) {
            console.log(`✅ ${file} → ${category}/`);
            migratedImages++;
          } else {
            console.log(`❌ ${file} - Size mismatch`);
            failedImages++;
          }
        } else {
          console.log(`❌ ${file} - Copy failed`);
          failedImages++;
        }
      } catch (error) {
        console.log(`❌ ${file} - Error: ${error.message}`);
        failedImages++;
      }
    }
  });
});

// Summary
console.log('\n📊 Migration Summary:');
console.log(`Total images found: ${totalImages}`);
console.log(`Successfully migrated: ${migratedImages}`);
console.log(`Failed migrations: ${failedImages}`);

if (migratedImages > 0) {
  console.log('\n🎉 Migration completed successfully!');
  console.log('Next steps:');
  console.log('1. Update database to use backend URLs');
  console.log('2. Test image serving from backend');
  console.log('3. Remove frontend image dependencies');
} else {
  console.log('\n⚠️ No images were migrated. Check paths and permissions.');
}

console.log('\n🔗 New image URLs will be:');
console.log('https://counterfit-backend.onrender.com/uploads/images/{category}/{filename}');
