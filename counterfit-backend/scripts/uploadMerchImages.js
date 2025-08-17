const { supabase } = require('../lib/supabase');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function uploadMerchImages() {
  try {
    console.log('🖼️ Uploading Merch images to backend...');
    
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    // Path to Merch folder (relative to project root)
    const merchPath = path.join(__dirname, '..', '..', 'Merch');
    const uploadsPath = path.join(__dirname, '..', 'uploads', 'products');
    
    console.log('📁 Merch folder path:', merchPath);
    console.log('📁 Uploads folder path:', uploadsPath);
    
    // Check if Merch folder exists
    if (!fs.existsSync(merchPath)) {
      console.error('❌ Merch folder not found at:', merchPath);
      return;
    }
    
    // Check if uploads folder exists
    if (!fs.existsSync(uploadsPath)) {
      console.log('📁 Creating uploads folder...');
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    
    // Get list of image files in Merch folder
    const merchFiles = fs.readdirSync(merchPath).filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    );
    
    console.log(`✅ Found ${merchFiles.length} image files in Merch folder:`);
    merchFiles.forEach(file => console.log(`  - ${file}`));
    
    // Copy files to uploads folder
    console.log('\n📋 Copying images to backend uploads folder...');
    const copiedFiles = [];
    
    for (const file of merchFiles) {
      const sourcePath = path.join(merchPath, file);
      const destPath = path.join(uploadsPath, file);
      
      try {
        fs.copyFileSync(sourcePath, destPath);
        copiedFiles.push(file);
        console.log(`  ✅ Copied: ${file}`);
      } catch (copyError) {
        console.error(`  ❌ Failed to copy ${file}:`, copyError.message);
      }
    }
    
    console.log(`\n📊 Successfully copied ${copiedFiles.length}/${merchFiles.length} images`);
    
    // Now update the database with the new image URLs
    console.log('\n💾 Updating database with new image URLs...');
    
    // Get all products from database
    const { data: products, error: productsError } = await supabase
      .from('Product')
      .select('id, name, images');
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    console.log(`✅ Found ${products.length} products in database`);
    
    // Update each product with working images
    for (const product of products) {
      console.log(`\n📦 Processing: ${product.name}`);
      
      // Create new image array with working URLs
      const newImages = copiedFiles.map((filename, index) => ({
        url: `https://counterfit-backend.onrender.com/uploads/products/${filename}`,
        alt: `${product.name} - Image ${index + 1}`,
        isPrimary: index === 0 // First image is primary
      }));
      
      // Update product in database
      const { error: updateError } = await supabase
        .from('Product')
        .update({ 
          images: newImages,
          updatedAt: new Date().toISOString()
        })
        .eq('id', product.id);
      
      if (updateError) {
        console.error(`  ❌ Error updating ${product.name}:`, updateError);
      } else {
        console.log(`  ✅ Updated ${product.name} with ${newImages.length} images`);
      }
    }
    
    console.log('\n🎉 Merch image upload and database update completed!');
    console.log('\n🔍 Next steps:');
    console.log('1. Check your website - images should now work');
    console.log('2. Use admin panel to customize which images go with which products');
    console.log('3. Delete any duplicate or unwanted images from uploads folder');
    
  } catch (error) {
    console.error('❌ Error uploading merch images:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Run the function
if (require.main === module) {
  uploadMerchImages();
}

module.exports = uploadMerchImages;
