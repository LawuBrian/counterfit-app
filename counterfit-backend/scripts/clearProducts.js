const mongoose = require('mongoose');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
require('dotenv').config();

async function clearProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/counterfit');
    console.log('Connected to MongoDB');

    // Get current counts
    const productCount = await Product.countDocuments();
    const collectionCount = await Collection.countDocuments();

    console.log(`Found ${productCount} products and ${collectionCount} collections`);

    if (productCount === 0 && collectionCount === 0) {
      console.log('✅ Database is already empty - no products or collections to remove');
      return;
    }

    // Clear all products
    const productResult = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${productResult.deletedCount} products`);

    // Clear all collections
    const collectionResult = await Collection.deleteMany({});
    console.log(`🗑️  Deleted ${collectionResult.deletedCount} collections`);

    console.log('');
    console.log('✅ All products and collections have been removed from the database');
    console.log('');
    console.log('You can now:');
    console.log('1. Add new products via the admin panel: http://localhost:3000/admin/products');
    console.log('2. Or run "npm run seed" to add sample products again');

  } catch (error) {
    console.error('❌ Error clearing products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function
if (require.main === module) {
  clearProducts();
}

module.exports = clearProducts;
