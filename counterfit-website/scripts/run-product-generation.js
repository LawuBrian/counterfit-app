#!/usr/bin/env node

/**
 * COUNTERFIT PRODUCT GENERATION RUNNER
 * Simple script to generate all products
 * 
 * Usage: node scripts/run-product-generation.js
 */

// Import the product generator
const { products, combos, collections } = require('./generate-all-products.js');

// Combine all products
const allProducts = [...products, ...combos, ...collections];

console.log('🚀 Starting Counterfit Product Generation...\n');

// Function to create a product via API
async function createProduct(product) {
  try {
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Created: ${product.name} (ID: ${result.data.id})`);
      return true;
    } else {
      const error = await response.json();
      console.log(`❌ Failed: ${product.name} - ${error.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error: ${product.name} - ${error.message}`);
    return false;
  }
}

// Main generation function
async function generateAllProducts() {
  console.log(`📋 Generating ${allProducts.length} products...\n`);
  
  let successCount = 0;
  let failureCount = 0;

  for (const product of allProducts) {
    console.log(`🔄 Creating: ${product.name}...`);
    
    const success = await createProduct(product);
    
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎯 GENERATION COMPLETE!');
  console.log('========================');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📊 Total: ${allProducts.length}`);
  
  if (failureCount > 0) {
    console.log('\n⚠️  Some products failed to create. Check the logs above for details.');
  } else {
    console.log('\n🎉 All products created successfully!');
  }
}

// Export for use in other scripts
module.exports = {
  generateAllProducts,
  allProducts
};

// If run directly, execute generation
if (require.main === module) {
  generateAllProducts().catch(console.error);
}
