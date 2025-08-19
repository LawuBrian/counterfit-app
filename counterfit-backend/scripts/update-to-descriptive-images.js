const { supabase } = require('../lib/supabase');
require('dotenv').config();

// Mapping of product names/categories to descriptive image paths
const imageMapping = {
  // Jackets/Outerwear
  'jacket': [
    '/images/outerwear/BLACKJACKET.jpeg',
    '/images/outerwear/FURRYGREYJACKET.jpeg',
    '/images/outerwear/LUXURYJACKET.jpeg',
    '/images/outerwear/NATUREJACKET.jpeg',
    '/images/outerwear/WHITEJACKET.jpeg'
  ],
  'jackets': [
    '/images/outerwear/BLACKJACKET.jpeg',
    '/images/outerwear/FURRYGREYJACKET.jpeg',
    '/images/outerwear/LUXURYJACKET.jpeg',
    '/images/outerwear/NATUREJACKET.jpeg',
    '/images/outerwear/WHITEJACKET.jpeg'
  ],
  'outerwear': [
    '/images/outerwear/BLACKJACKET.jpeg',
    '/images/outerwear/FURRYGREYJACKET.jpeg',
    '/images/outerwear/LUXURYJACKET.jpeg',
    '/images/outerwear/NATUREJACKET.jpeg',
    '/images/outerwear/WHITEJACKET.jpeg'
  ],
  
  // Pants/Bottoms
  'pants': [
    '/images/bottoms/COUNTERFITPANTS.jpeg'
  ],
  'bottoms': [
    '/images/bottoms/COUNTERFITPANTS.jpeg'
  ],
  
  // Tops
  'tops': [
    '/images/tops/WHITEDUOCOLLECTION.jpg'
  ],
  
  // Accessories
  'accessories': [
    '/images/accessories/SKULLCAP.jpg'
  ],
  'skullcap': [
    '/images/accessories/SKULLCAP.jpg'
  ],
  
  // Collections
  'collection': [
    '/images/collections/COMBOPANTSJACKET.jpeg',
    '/images/collections/COMBOSKULLYJACKET.jpeg',
    '/images/collections/DUONATURECAMOORBLACKWHITE MIX.jpeg',
    '/images/collections/JACKETDUOCOLLECTION.jpg',
    '/images/collections/TRIOCOLLECTION.jpeg',
    '/images/collections/WHITEDUOCOLLECTION.jpg'
  ],
  'combo': [
    '/images/collections/COMBOPANTSJACKET.jpeg',
    '/images/collections/COMBOSKULLYJACKET.jpeg',
    '/images/collections/JACKETDUOCOLLECTION.jpg',
    '/images/collections/TRIOCOLLECTION.jpeg'
  ],
  'duo': [
    '/images/collections/DUONATURECAMOORBLACKWHITE MIX.jpeg',
    '/images/collections/WHITEDUOCOLLECTION.jpg'
  ]
};

// Default images for fallback
const defaultImages = [
  '/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png',
  '/images/1d66cc_149ffeb3bc0f441aa37acb363303a407_mv2.jpg',
  '/images/1d66cc_2cd6bfd9f3f14c02bf9bec1597481052_mv2.jpg'
];

async function updateToDescriptiveImages() {
  try {
    console.log('🖼️ Updating database to use descriptive image names...');
    
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    // Step 1: Get all products from database
    console.log('\n📦 Fetching products from database...');
    const { data: products, error: productsError } = await supabase
      .from('Product')
      .select('id, name, category, images, slug');
    
    if (productsError) {
      console.error('❌ Error fetching products:', productsError);
      return;
    }

    console.log(`✅ Found ${products.length} products`);

    // Step 2: Update each product with descriptive images
    console.log('\n🔄 Updating products with descriptive images...');
    
    for (const product of products) {
      console.log(`\n📦 Processing: ${product.name} (${product.category})`);
      
      // Find matching images based on product name and category
      let matchedImages = [];
      
      // First try to match by product name
      const productNameLower = product.name.toLowerCase();
      for (const [key, images] of Object.entries(imageMapping)) {
        if (productNameLower.includes(key)) {
          matchedImages = [...matchedImages, ...images];
          break;
        }
      }
      
      // If no match by name, try by category
      if (matchedImages.length === 0) {
        const categoryLower = product.category.toLowerCase();
        for (const [key, images] of Object.entries(imageMapping)) {
          if (categoryLower.includes(key)) {
            matchedImages = [...matchedImages, ...images];
            break;
          }
        }
      }
      
      // If still no match, use default images
      if (matchedImages.length === 0) {
        matchedImages = [...defaultImages];
        console.log(`  ⚠️ No specific matches found, using default images`);
      }
      
      // Remove duplicates and limit to reasonable number
      matchedImages = [...new Set(matchedImages)].slice(0, 5);
      
      console.log(`  🎯 Found ${matchedImages.length} matching images:`);
      matchedImages.forEach(img => console.log(`    - ${img}`));
      
      // Create new image array with descriptive paths
      const newImages = matchedImages.map((imagePath, index) => ({
        url: imagePath,
        alt: `${product.name} - ${imagePath.split('/').pop()?.replace(/\.[^/.]+$/, '') || `Image ${index + 1}`}`,
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
        console.log(`  ✅ Updated ${product.name} with ${newImages.length} descriptive images`);
      }
    }
    
    // Step 3: Update collections with descriptive images
    console.log('\n🎨 Updating collections with descriptive images...');
    
    const { data: collections, error: collectionsError } = await supabase
      .from('Collection')
      .select('id, name, slug, image');
    
    if (collectionsError) {
      console.error('❌ Error fetching collections:', collectionsError);
    } else {
      console.log(`✅ Found ${collections.length} collections`);
      
      for (const collection of collections) {
        console.log(`\n🎨 Processing collection: ${collection.name}`);
        
        // Find appropriate collection image
        let collectionImage = null;
        
        if (collection.name.toLowerCase().includes('combo')) {
          collectionImage = '/images/collections/COMBOPANTSJACKET.jpeg';
        } else if (collection.name.toLowerCase().includes('duo')) {
          collectionImage = '/images/collections/DUONATURECAMOORBLACKWHITE MIX.jpeg';
        } else if (collection.name.toLowerCase().includes('trio')) {
          collectionImage = '/images/collections/TRIOCOLLECTION.jpeg';
        } else {
          collectionImage = '/images/collections/JACKETDUOCOLLECTION.jpg';
        }
        
        console.log(`  🖼️ Setting collection image to: ${collectionImage}`);
        
        // Update collection in database
        const { error: updateError } = await supabase
          .from('Collection')
          .update({ 
            image: collectionImage,
            updatedAt: new Date().toISOString()
          })
          .eq('id', collection.id);
        
        if (updateError) {
          console.error(`  ❌ Error updating collection ${collection.name}:`, updateError);
        } else {
          console.log(`  ✅ Updated collection ${collection.name}`);
        }
      }
    }
    
    console.log('\n🎉 Database update completed successfully!');
    console.log('\n🔍 Next steps:');
    console.log('1. Check your website - images should now use descriptive names');
    console.log('2. Verify that all products display correctly');
    console.log('3. Use admin panel to fine-tune image assignments if needed');
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
  }
}

// Run the update
updateToDescriptiveImages();
