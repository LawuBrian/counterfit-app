const { supabase } = require('../lib/supabase');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function smartImageMatching() {
  try {
    console.log('🧠 Smart image matching for products...');
    
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    // Path to Merch folder and uploads
    const merchPath = path.join(__dirname, '..', '..', 'Merch');
    const uploadsPath = path.join(__dirname, '..', 'uploads', 'products');
    
    console.log('📁 Merch folder path:', merchPath);
    console.log('📁 Uploads folder path:', uploadsPath);
    
    // Check if folders exist
    if (!fs.existsSync(merchPath)) {
      console.error('❌ Merch folder not found at:', merchPath);
      return;
    }
    
    if (!fs.existsSync(uploadsPath)) {
      console.log('📁 Creating uploads folder...');
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    
    // Get all image files from Merch folder
    const merchFiles = fs.readdirSync(merchPath).filter(file => 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') || 
      file.toLowerCase().endsWith('.png')
    );
    
    console.log(`✅ Found ${merchFiles.length} images in Merch folder:`);
    merchFiles.forEach(file => console.log(`  - ${file}`));
    
    // Copy all images to uploads folder first
    console.log('\n📋 Copying all images to backend...');
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
    
    // Get all products from database
    console.log('\n📦 Fetching products from database...');
    const { data: products, error: productsError } = await supabase
      .from('Product')
      .select('id, name, images');
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }
    
    console.log(`✅ Found ${products.length} products`);
    
    // Smart matching logic
    console.log('\n🧠 Smart matching images to products...');
    
    for (const product of products) {
      console.log(`\n📦 Processing: ${product.name}`);
      
      // Try to find matching images based on product name
      const matchingImages = findMatchingImages(product.name, copiedFiles);
      
      if (matchingImages.length > 0) {
        console.log(`  🎯 Found ${matchingImages.length} matching images:`);
        matchingImages.forEach(img => console.log(`    - ${img}`));
        
        // Create image array with matched images
        const newImages = matchingImages.map((filename, index) => ({
          url: `https://counterfit-backend.onrender.com/uploads/products/${filename}`,
          alt: `${product.name} - ${filename.replace(/\.[^/.]+$/, '')}`,
          isPrimary: index === 0
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
          console.log(`  ✅ Updated ${product.name} with ${newImages.length} matched images`);
        }
      } else {
        // No matches found - assign a default image
        console.log(`  ⚠️ No matches found, assigning default image`);
        
        const defaultImage = copiedFiles.find(file => 
          file.toLowerCase().includes('jacket') || 
          file.toLowerCase().includes('pants') ||
          file.toLowerCase().includes('cap')
        ) || copiedFiles[0];
        
        if (defaultImage) {
          const newImages = [{
            url: `https://counterfit-backend.onrender.com/uploads/products/${defaultImage}`,
            alt: `${product.name} - Default Image`,
            isPrimary: true
          }];
          
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
            console.log(`  ✅ Updated ${product.name} with default image: ${defaultImage}`);
          }
        }
      }
    }
    
    console.log('\n🎉 Smart image matching completed!');
    console.log('\n🔍 Next steps:');
    console.log('1. Check your website - products should have relevant images');
    console.log('2. Use admin panel to fine-tune image assignments');
    console.log('3. Some products may need manual image selection');
    
  } catch (error) {
    console.error('❌ Error in smart image matching:', error);
    console.error('Stack trace:', error.stack);
  }
}

function findMatchingImages(productName, imageFiles) {
  const productNameLower = productName.toLowerCase();
  const matches = [];
  
  for (const imageFile of imageFiles) {
    const imageNameLower = imageFile.toLowerCase();
    
    // Check for exact matches
    if (imageNameLower.includes('jacket') && productNameLower.includes('jacket')) {
      matches.push(imageFile);
    }
    else if (imageNameLower.includes('pants') && productNameLower.includes('pants')) {
      matches.push(imageFile);
    }
    else if (imageNameLower.includes('cap') && productNameLower.includes('cap')) {
      matches.push(imageFile);
    }
    // Check for color/material matches
    else if (imageNameLower.includes('black') && productNameLower.includes('black')) {
      matches.push(imageFile);
    }
    else if (imageNameLower.includes('white') && productNameLower.includes('white')) {
      matches.push(imageFile);
    }
    else if (imageNameLower.includes('camo') && productNameLower.includes('camo')) {
      matches.push(imageFile);
    }
    else if (imageNameLower.includes('furry') && productNameLower.includes('furry')) {
      matches.push(imageFile);
    }
    else if (imageNameLower.includes('luxury') && productNameLower.includes('luxury')) {
      matches.push(imageFile);
    }
    else if (imageNameLower.includes('nature') && productNameLower.includes('nature')) {
      matches.push(imageFile);
    }
  }
  
  return matches;
}

// Run the function
if (require.main === module) {
  smartImageMatching();
}

module.exports = smartImageMatching;
