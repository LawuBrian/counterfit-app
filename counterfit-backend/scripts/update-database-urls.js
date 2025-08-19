const { supabase } = require('../lib/supabase');
require('dotenv').config();

// Script to update database URLs from frontend to backend
console.log('🔄 Starting database URL migration...');

// Check environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const backendUrl = process.env.BACKEND_URL || 'https://counterfit-backend.onrender.com';

async function updateDatabaseUrls() {
  try {
    console.log('🔗 Backend URL:', backendUrl);
    
    // Update Products table
    console.log('\n📦 Updating Products table...');
    
    const { data: products, error: productsError } = await supabase
      .from('Product')
      .select('id, images, name');
    
    if (productsError) {
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }
    
    console.log(`Found ${products.length} products to update`);
    
    let updatedProducts = 0;
    let failedProducts = 0;
    
    for (const product of products) {
      if (product.images && Array.isArray(product.images)) {
        let needsUpdate = false;
        const updatedImages = product.images.map(image => {
          if (image.url && image.url.startsWith('/images/')) {
            // Convert frontend path to backend URL
            const category = image.url.split('/')[2]; // /images/outerwear/FILE.jpg -> outerwear
            const filename = image.url.split('/').pop(); // Get filename
            
            const newUrl = `${backendUrl}/uploads/images/${category}/${filename}`;
            console.log(`🔄 ${product.name}: ${image.url} → ${newUrl}`);
            
            needsUpdate = true;
            return { ...image, url: newUrl };
          }
          return image;
        });
        
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('Product')
            .update({ images: updatedImages })
            .eq('id', product.id);
          
          if (updateError) {
            console.error(`❌ Failed to update product ${product.name}:`, updateError.message);
            failedProducts++;
          } else {
            updatedProducts++;
          }
        }
      }
    }
    
    // Update Collections table
    console.log('\n📚 Updating Collections table...');
    
    const { data: collections, error: collectionsError } = await supabase
      .from('Collection')
      .select('id, image, name');
    
    if (collectionsError) {
      throw new Error(`Failed to fetch collections: ${collectionsError.message}`);
    }
    
    console.log(`Found ${collections.length} collections to update`);
    
    let updatedCollections = 0;
    let failedCollections = 0;
    
    for (const collection of collections) {
      if (collection.image && collection.image.startsWith('/images/')) {
        const category = collection.image.split('/')[2];
        const filename = collection.image.split('/').pop();
        
        const newUrl = `${backendUrl}/uploads/images/${category}/${filename}`;
        console.log(`🔄 ${collection.name}: ${collection.image} → ${newUrl}`);
        
        const { error: updateError } = await supabase
          .from('Collection')
          .update({ image: newUrl })
          .eq('id', collection.id);
        
        if (updateError) {
          console.error(`❌ Failed to update collection ${collection.name}:`, updateError.message);
          failedCollections++;
        } else {
          updatedCollections++;
        }
      }
    }
    
    // Summary
    console.log('\n📊 Database Migration Summary:');
    console.log(`Products updated: ${updatedProducts}/${products.length}`);
    console.log(`Collections updated: ${updatedCollections}/${collections.length}`);
    console.log(`Failed products: ${failedProducts}`);
    console.log(`Failed collections: ${failedCollections}`);
    
    if (updatedProducts > 0 || updatedCollections > 0) {
      console.log('\n🎉 Database migration completed successfully!');
      console.log('All images now use backend URLs');
      console.log('Next: Test image serving and remove frontend dependencies');
    } else {
      console.log('\n⚠️ No database updates were needed');
    }
    
  } catch (error) {
    console.error('❌ Database migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
updateDatabaseUrls();
