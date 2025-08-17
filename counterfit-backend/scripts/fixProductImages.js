const { supabase } = require('../lib/supabase');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function fixProductImages() {
  try {
    console.log('🖼️ Fixing broken product images...');
    
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    // Step 1: Get all products from database
    console.log('\n📦 Fetching products from database...');
    const { data: products, error: productsError } = await supabase
      .from('Product')
      .select('id, name, images');
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`✅ Found ${products.length} products`);

    // Step 2: Get actual images from backend
    console.log('\n🖼️ Checking backend for actual images...');
    try {
      const response = await fetch('https://counterfit-backend.onrender.com/debug/uploads');
      const backendData = await response.json();
      
      if (backendData.files && Array.isArray(backendData.files)) {
        console.log(`✅ Backend has ${backendData.files.length} images:`);
        backendData.files.forEach(file => console.log(`  - ${file}`));
        
        // Step 3: Fix each product's images
        console.log('\n🔧 Fixing product images...');
        
        for (const product of products) {
          if (product.images && Array.isArray(product.images)) {
            console.log(`\n📦 Processing: ${product.name}`);
            
            const fixedImages = product.images.map(img => {
              const oldUrl = img.url || img;
              const oldFilename = oldUrl.split('/').pop(); // Get filename from URL
              
              // Check if this image exists on backend
              if (backendData.files.includes(oldFilename)) {
                console.log(`  ✅ Image exists: ${oldFilename}`);
                return img; // Keep as is
              } else {
                // Find a replacement image
                const replacementImage = backendData.files.find(file => 
                  file.includes('.jpg') || file.includes('.jpeg') || file.includes('.png')
                );
                
                if (replacementImage) {
                  const newUrl = `https://counterfit-backend.onrender.com/uploads/products/${replacementImage}`;
                  console.log(`  🔄 Replacing broken image with: ${replacementImage}`);
                  return { ...img, url: newUrl };
                } else {
                  console.log(`  ❌ No replacement image found for: ${oldFilename}`);
                  return img; // Keep as is for now
                }
              }
            });
            
            // Update product in database if images changed
            if (JSON.stringify(fixedImages) !== JSON.stringify(product.images)) {
              console.log(`  💾 Updating database for: ${product.name}`);
              
              const { error: updateError } = await supabase
                .from('Product')
                .update({ 
                  images: fixedImages,
                  updatedAt: new Date().toISOString()
                })
                .eq('id', product.id);
              
              if (updateError) {
                console.error(`  ❌ Error updating ${product.name}:`, updateError);
              } else {
                console.log(`  ✅ Updated ${product.name} successfully`);
              }
            }
          }
        }
        
        console.log('\n🎉 Product image fix completed!');
        
      } else {
        console.log('❌ Could not get backend image list');
      }
      
    } catch (fetchError) {
      console.error('❌ Error fetching backend data:', fetchError);
    }

  } catch (error) {
    console.error('❌ Error fixing product images:', error);
  }
}

// Run the function
if (require.main === module) {
  fixProductImages();
}

module.exports = fixProductImages;
