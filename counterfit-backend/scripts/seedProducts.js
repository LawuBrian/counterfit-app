const mongoose = require('mongoose');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
require('dotenv').config();

// Sample product data with all your required fields
const sampleProducts = [
  {
    name: "Premium Streetwear Hoodie",
    description: "Ultra-comfortable premium cotton blend hoodie with modern streetwear design. Features include kangaroo pocket, adjustable drawstrings, and reinforced seams for durability.",
    shortDescription: "Premium cotton blend hoodie with modern streetwear design",
    price: 899.99,
    comparePrice: 1199.99,
    costPrice: 450.00,
    stockCode: "CF-HOOD-001",
    sku: "CF-HOOD-BLK-M",
    category: "outerwear",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
        alt: "Premium Streetwear Hoodie - Front View",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        alt: "Premium Streetwear Hoodie - Back View",
        isPrimary: false
      }
    ],
    sizes: [
      { size: "S", stock: 15, isAvailable: true },
      { size: "M", stock: 25, isAvailable: true },
      { size: "L", stock: 20, isAvailable: true },
      { size: "XL", stock: 12, isAvailable: true },
      { size: "XXL", stock: 8, isAvailable: true }
    ],
    colors: [
      { name: "Black", hexCode: "#000000", stock: 40, isAvailable: true },
      { name: "Navy", hexCode: "#001f3f", stock: 25, isAvailable: true },
      { name: "Grey", hexCode: "#808080", stock: 15, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 80,
      lowStockThreshold: 10,
      allowBackorder: false
    },
    shipping: {
      weight: 650,
      dimensions: { length: 30, width: 25, height: 5 },
      requiresShipping: true
    },
    seo: {
      title: "Premium Streetwear Hoodie - Counterfit",
      description: "Shop the premium streetwear hoodie from Counterfit. Ultra-comfortable cotton blend with modern design.",
      keywords: ["hoodie", "streetwear", "premium", "cotton", "urban"]
    }
  },
  {
    name: "Luxury Denim Jacket",
    description: "Crafted from premium Japanese denim with vintage-inspired wash. Features classic button closure, chest pockets, and tailored fit for the modern urban professional.",
    shortDescription: "Premium Japanese denim jacket with vintage wash",
    price: 1299.99,
    comparePrice: 1699.99,
    costPrice: 650.00,
    stockCode: "CF-DENIM-002",
    sku: "CF-DENIM-IND-L",
    category: "outerwear",
    status: "active",
    featured: true,
    isNew: false,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
        alt: "Luxury Denim Jacket - Front View",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
        alt: "Luxury Denim Jacket - Detail View",
        isPrimary: false
      }
    ],
    sizes: [
      { size: "S", stock: 8, isAvailable: true },
      { size: "M", stock: 12, isAvailable: true },
      { size: "L", stock: 15, isAvailable: true },
      { size: "XL", stock: 10, isAvailable: true }
    ],
    colors: [
      { name: "Indigo", hexCode: "#4B0082", stock: 35, isAvailable: true },
      { name: "Light Wash", hexCode: "#87CEEB", stock: 10, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 45,
      lowStockThreshold: 5,
      allowBackorder: true
    },
    shipping: {
      weight: 800,
      dimensions: { length: 35, width: 30, height: 8 },
      requiresShipping: true
    },
    seo: {
      title: "Luxury Japanese Denim Jacket - Counterfit",
      description: "Premium Japanese denim jacket with vintage wash. Perfect for urban professionals.",
      keywords: ["denim", "jacket", "luxury", "japanese", "vintage"]
    }
  },
  {
    name: "Athletic Performance Tee",
    description: "High-performance athletic tee made from moisture-wicking fabric. Designed for intense workouts with anti-odor technology and seamless construction.",
    shortDescription: "High-performance moisture-wicking athletic tee",
    price: 349.99,
    comparePrice: 449.99,
    costPrice: 175.00,
    stockCode: "CF-TEE-003",
    sku: "CF-TEE-WHT-M",
    category: "athletic",
    status: "active",
    featured: false,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
        alt: "Athletic Performance Tee - White",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", stock: 20, isAvailable: true },
      { size: "S", stock: 30, isAvailable: true },
      { size: "M", stock: 35, isAvailable: true },
      { size: "L", stock: 25, isAvailable: true },
      { size: "XL", stock: 15, isAvailable: true }
    ],
    colors: [
      { name: "White", hexCode: "#FFFFFF", stock: 60, isAvailable: true },
      { name: "Black", hexCode: "#000000", stock: 45, isAvailable: true },
      { name: "Navy", hexCode: "#001f3f", stock: 20, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 125,
      lowStockThreshold: 20,
      allowBackorder: false
    },
    shipping: {
      weight: 200,
      dimensions: { length: 25, width: 20, height: 2 },
      requiresShipping: true
    },
    seo: {
      title: "Athletic Performance Tee - Counterfit",
      description: "High-performance athletic tee with moisture-wicking fabric and anti-odor technology.",
      keywords: ["athletic", "tee", "performance", "moisture-wicking", "workout"]
    }
  },
  {
    name: "Premium Cargo Pants",
    description: "Military-inspired cargo pants with modern tailoring. Features multiple utility pockets, reinforced knees, and comfortable stretch fabric for all-day wear.",
    shortDescription: "Military-inspired cargo pants with utility pockets",
    price: 749.99,
    comparePrice: 999.99,
    costPrice: 375.00,
    stockCode: "CF-CARGO-004",
    sku: "CF-CARGO-OLV-32",
    category: "bottoms",
    status: "active",
    featured: false,
    isNew: false,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
        alt: "Premium Cargo Pants - Olive",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 12, isAvailable: true },
      { size: "M", stock: 18, isAvailable: true },
      { size: "L", stock: 22, isAvailable: true },
      { size: "XL", stock: 15, isAvailable: true },
      { size: "XXL", stock: 8, isAvailable: true }
    ],
    colors: [
      { name: "Olive", hexCode: "#808000", stock: 45, isAvailable: true },
      { name: "Black", hexCode: "#000000", stock: 30, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 75,
      lowStockThreshold: 15,
      allowBackorder: false
    },
    shipping: {
      weight: 550,
      dimensions: { length: 40, width: 25, height: 5 },
      requiresShipping: true
    },
    seo: {
      title: "Premium Cargo Pants - Counterfit",
      description: "Military-inspired cargo pants with utility pockets and modern tailoring.",
      keywords: ["cargo", "pants", "military", "utility", "streetwear"]
    }
  },
  {
    name: "Designer Sneakers",
    description: "Limited edition designer sneakers with premium leather construction and unique colorway. Comfortable cushioning meets street-ready style.",
    shortDescription: "Limited edition designer sneakers with premium leather",
    price: 1899.99,
    comparePrice: 2499.99,
    costPrice: 950.00,
    stockCode: "CF-SNEAK-005",
    sku: "CF-SNEAK-WHT-42",
    category: "footwear",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
        alt: "Designer Sneakers - White/Black",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800",
        alt: "Designer Sneakers - Side View",
        isPrimary: false
      }
    ],
    sizes: [
      { size: "S", stock: 5, isAvailable: true }, // Size 40
      { size: "M", stock: 8, isAvailable: true }, // Size 42
      { size: "L", stock: 6, isAvailable: true }, // Size 44
      { size: "XL", stock: 3, isAvailable: true } // Size 46
    ],
    colors: [
      { name: "White/Black", hexCode: "#FFFFFF", stock: 15, isAvailable: true },
      { name: "All Black", hexCode: "#000000", stock: 7, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 22,
      lowStockThreshold: 5,
      allowBackorder: true
    },
    shipping: {
      weight: 1200,
      dimensions: { length: 35, width: 25, height: 15 },
      requiresShipping: true
    },
    seo: {
      title: "Limited Edition Designer Sneakers - Counterfit",
      description: "Exclusive designer sneakers with premium leather construction and unique colorway.",
      keywords: ["sneakers", "designer", "limited edition", "premium", "leather"]
    }
  },
  {
    name: "Minimalist Backpack",
    description: "Sleek minimalist backpack crafted from water-resistant material. Features laptop compartment, organization pockets, and comfortable padded straps.",
    shortDescription: "Water-resistant minimalist backpack with laptop compartment",
    price: 599.99,
    comparePrice: 799.99,
    costPrice: 300.00,
    stockCode: "CF-BAG-006",
    sku: "CF-BAG-BLK-OS",
    category: "accessories",
    status: "active",
    featured: false,
    isNew: false,
    isAvailable: true,
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        alt: "Minimalist Backpack - Black",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "M", stock: 30, isAvailable: true } // One size fits all
    ],
    colors: [
      { name: "Black", hexCode: "#000000", stock: 25, isAvailable: true },
      { name: "Grey", hexCode: "#808080", stock: 15, isAvailable: true },
      { name: "Navy", hexCode: "#001f3f", stock: 10, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 50,
      lowStockThreshold: 10,
      allowBackorder: false
    },
    shipping: {
      weight: 800,
      dimensions: { length: 45, width: 30, height: 20 },
      requiresShipping: true
    },
    seo: {
      title: "Minimalist Water-Resistant Backpack - Counterfit",
      description: "Sleek minimalist backpack with laptop compartment and water-resistant material.",
      keywords: ["backpack", "minimalist", "water-resistant", "laptop", "urban"]
    }
  }
];

// Sample collections
const sampleCollections = [
  {
    name: "Urban Essentials",
    slug: "urban-essentials",
    description: "Core pieces for the modern urban lifestyle",
    featured: true,
    status: "active"
  },
  {
    name: "Athletic Performance",
    slug: "athletic-performance", 
    description: "High-performance gear for active lifestyles",
    featured: false,
    status: "active"
  },
  {
    name: "Limited Drops",
    slug: "limited-drops",
    description: "Exclusive limited edition releases",
    featured: true,
    status: "active"
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/counterfit');
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing products and collections...');
    await Product.deleteMany({});
    await Collection.deleteMany({});

    // Create collections
    console.log('Creating collections...');
    const collections = await Collection.insertMany(sampleCollections);
    console.log(`Created ${collections.length} collections`);

    // Create products with collection references
    console.log('Creating products...');
    const productsWithCollections = sampleProducts.map((product, index) => ({
      ...product,
      collections: [collections[index % collections.length]._id] // Distribute products across collections
    }));

    const products = await Product.insertMany(productsWithCollections);
    console.log(`Created ${products.length} products`);

    // Display summary
    console.log('\n=== SEED COMPLETE ===');
    console.log(`✅ Created ${collections.length} collections`);
    console.log(`✅ Created ${products.length} products`);
    console.log('\nProduct Summary:');
    
    const categoryStats = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    categoryStats.forEach(stat => {
      console.log(`  - ${stat._id}: ${stat.count} products`);
    });

    console.log('\nFeatured Products:');
    const featuredProducts = await Product.find({ featured: true }).select('name price');
    featuredProducts.forEach(product => {
      console.log(`  - ${product.name}: R${product.price}`);
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Access admin panel at: http://localhost:3000/admin');
    console.log('3. View products at: http://localhost:3000/admin/products');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleProducts, sampleCollections, seedDatabase };
