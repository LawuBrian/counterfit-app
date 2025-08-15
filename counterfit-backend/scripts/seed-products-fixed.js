const mongoose = require('mongoose');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
require('dotenv').config();

// Helper function to generate slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '');
}

// Sample collections
const collections = [
  {
    name: "Platform Series",
    slug: "platform-series",
    description: "Elevated streetwear that puts you on another level. Clean lines, premium materials, and statement silhouettes.",
    status: "active",
    featured: true
  },
  {
    name: "Dynamic Motion",
    slug: "dynamic-motion", 
    description: "For those who move with purpose. Athletic-inspired pieces that blur the line between performance and style.",
    status: "active",
    featured: true
  },
  {
    name: "Urban Explorer",
    slug: "urban-explorer",
    description: "Bold patterns and textures for the modern adventurer. Pieces that make a statement without saying a word.",
    status: "active",
    featured: false
  }
];

// Sample products with proper slugs
const sampleProducts = [
  {
    name: "Premium Camo Hoodie",
    slug: "premium-camo-hoodie",
    description: "Ultra-comfortable premium cotton blend hoodie with modern streetwear design. Features include kangaroo pocket, adjustable drawstrings, and reinforced seams for durability.",
    shortDescription: "Premium cotton blend hoodie with modern streetwear design",
    price: 899,
    comparePrice: 1199,
    costPrice: 450,
    stockCode: "CF-HOOD-001",
    sku: "CF-HOOD-CAMO-M",
    category: "outerwear",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "/images/1d66cc_118bf0bf6588467e8c966076d949e1b3_mv2.png",
        alt: "Premium Camo Hoodie - Front View",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 15, isAvailable: true },
      { size: "M", stock: 25, isAvailable: true },
      { size: "L", stock: 20, isAvailable: true },
      { size: "XL", stock: 12, isAvailable: true }
    ],
    colors: [
      { name: "Camo", hexCode: "#4a5d23", stock: 40, isAvailable: true },
      { name: "Black", hexCode: "#000000", stock: 25, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 65,
      lowStockThreshold: 10,
      allowBackorder: false
    },
    shipping: {
      weight: 0.8,
      dimensions: { length: 30, width: 25, height: 5 },
      shippingClass: "standard"
    },
    seo: {
      title: "Premium Camo Hoodie - Counterfit Streetwear",
      description: "Shop the Premium Camo Hoodie from Counterfit. Ultra-comfortable cotton blend with modern design.",
      keywords: ["hoodie", "streetwear", "camo", "premium", "cotton"]
    },
    tags: ["streetwear", "hoodie", "premium", "camo"],
    rating: { average: 4.8, count: 24 }
  },
  {
    name: "Classic Black Tee",
    slug: "classic-black-tee",
    description: "Essential black t-shirt made from premium organic cotton. Perfect fit with reinforced collar and hem for lasting quality.",
    shortDescription: "Essential black t-shirt in premium organic cotton",
    price: 299,
    comparePrice: 399,
    costPrice: 120,
    stockCode: "CF-TEE-002",
    sku: "CF-TEE-BLK-M",
    category: "tops",
    status: "active",
    featured: false,
    isNew: false,
    isAvailable: true,
    images: [
      {
        url: "/images/1d66cc_19a0f6de460743f18fef591c43ae2592_mv2.png",
        alt: "Classic Black Tee - Front View",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "XS", stock: 10, isAvailable: true },
      { size: "S", stock: 20, isAvailable: true },
      { size: "M", stock: 30, isAvailable: true },
      { size: "L", stock: 25, isAvailable: true },
      { size: "XL", stock: 15, isAvailable: true }
    ],
    colors: [
      { name: "Black", hexCode: "#000000", stock: 80, isAvailable: true },
      { name: "White", hexCode: "#ffffff", stock: 20, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 100,
      lowStockThreshold: 15,
      allowBackorder: true
    },
    shipping: {
      weight: 0.2,
      dimensions: { length: 25, width: 20, height: 2 },
      shippingClass: "standard"
    },
    seo: {
      title: "Classic Black Tee - Essential Streetwear | Counterfit",
      description: "Shop the Classic Black Tee from Counterfit. Premium organic cotton essential for any streetwear collection.",
      keywords: ["t-shirt", "black", "organic cotton", "essential", "streetwear"]
    },
    tags: ["essentials", "t-shirt", "organic", "classic"],
    rating: { average: 4.6, count: 89 }
  },
  {
    name: "Urban Cargo Pants",
    slug: "urban-cargo-pants",
    description: "Versatile cargo pants with multiple pockets and modern fit. Made from durable cotton twill with reinforced knees and adjustable waist.",
    shortDescription: "Versatile cargo pants with modern fit and multiple pockets",
    price: 649,
    comparePrice: 849,
    costPrice: 280,
    stockCode: "CF-CARGO-003",
    sku: "CF-CARGO-KHK-32",
    category: "bottoms",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "/images/1d66cc_cde498cebe1e46d6a5caf466f6343ed9_mv2.png",
        alt: "Urban Cargo Pants - Front View",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 8, isAvailable: true },
      { size: "M", stock: 15, isAvailable: true },
      { size: "L", stock: 20, isAvailable: true },
      { size: "XL", stock: 18, isAvailable: true },
      { size: "XXL", stock: 12, isAvailable: true }
    ],
    colors: [
      { name: "Khaki", hexCode: "#8b7355", stock: 45, isAvailable: true },
      { name: "Black", hexCode: "#000000", stock: 30, isAvailable: true },
      { name: "Olive", hexCode: "#556b2f", stock: 25, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 80,
      lowStockThreshold: 12,
      allowBackorder: false
    },
    shipping: {
      weight: 0.6,
      dimensions: { length: 35, width: 30, height: 3 },
      shippingClass: "standard"
    },
    seo: {
      title: "Urban Cargo Pants - Functional Streetwear | Counterfit",
      description: "Shop Urban Cargo Pants from Counterfit. Durable cotton twill with multiple pockets and modern fit.",
      keywords: ["cargo pants", "urban", "streetwear", "functional", "pockets"]
    },
    tags: ["cargo", "pants", "urban", "functional"],
    rating: { average: 4.7, count: 43 }
  },
  {
    name: "Performance Track Jacket",
    slug: "performance-track-jacket",
    description: "Athletic-inspired track jacket with moisture-wicking fabric and contemporary design. Features full zip, side pockets, and reflective details.",
    shortDescription: "Athletic track jacket with moisture-wicking technology",
    price: 749,
    comparePrice: 999,
    costPrice: 320,
    stockCode: "CF-TRACK-004",
    sku: "CF-TRACK-NVY-L",
    category: "outerwear",
    status: "active",
    featured: false,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "/images/1d66cc_aec60f7b500c482397c35ad1f0ff735e_mv2.png",
        alt: "Performance Track Jacket - Front View",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 12, isAvailable: true },
      { size: "M", stock: 18, isAvailable: true },
      { size: "L", stock: 22, isAvailable: true },
      { size: "XL", stock: 15, isAvailable: true }
    ],
    colors: [
      { name: "Navy", hexCode: "#001f3f", stock: 35, isAvailable: true },
      { name: "Black", hexCode: "#000000", stock: 32, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 67,
      lowStockThreshold: 8,
      allowBackorder: true
    },
    shipping: {
      weight: 0.5,
      dimensions: { length: 32, width: 28, height: 4 },
      shippingClass: "standard"
    },
    seo: {
      title: "Performance Track Jacket - Athletic Streetwear | Counterfit",
      description: "Shop the Performance Track Jacket from Counterfit. Moisture-wicking athletic wear with contemporary design.",
      keywords: ["track jacket", "athletic", "performance", "moisture-wicking", "streetwear"]
    },
    tags: ["athletic", "performance", "track", "jacket"],
    rating: { average: 4.5, count: 31 }
  },
  {
    name: "Retro Snapback Cap",
    slug: "retro-snapback-cap",
    description: "Classic snapback cap with embroidered logo and vintage-inspired design. Adjustable fit with flat brim and structured crown.",
    shortDescription: "Classic snapback cap with embroidered logo",
    price: 199,
    comparePrice: 0, // No compare price
    costPrice: 75,
    stockCode: "CF-CAP-005",
    sku: "CF-CAP-BLK-OS",
    category: "accessories",
    status: "active",
    featured: false,
    isNew: false,
    isAvailable: true,
    images: [
      {
        url: "/images/1d66cc_6b9d669bf50e49e1848f958b11a16367_mv2.png",
        alt: "Retro Snapback Cap - Front View",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "One Size", stock: 50, isAvailable: true }
    ],
    colors: [
      { name: "Black", hexCode: "#000000", stock: 30, isAvailable: true },
      { name: "White", hexCode: "#ffffff", stock: 20, isAvailable: true }
    ],
    inventory: {
      trackQuantity: true,
      quantity: 50,
      lowStockThreshold: 10,
      allowBackorder: true
    },
    shipping: {
      weight: 0.15,
      dimensions: { length: 20, width: 15, height: 10 },
      shippingClass: "standard"
    },
    seo: {
      title: "Retro Snapback Cap - Classic Streetwear Accessory | Counterfit",
      description: "Shop the Retro Snapback Cap from Counterfit. Classic design with embroidered logo and adjustable fit.",
      keywords: ["snapback", "cap", "hat", "retro", "accessory", "streetwear"]
    },
    tags: ["accessories", "cap", "retro", "snapback"],
    rating: { average: 4.4, count: 67 }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing products and collections...');
    await Product.deleteMany({});
    await Collection.deleteMany({});

    // Create collections first
    console.log('Creating collections...');
    const createdCollections = await Collection.insertMany(collections);
    console.log(`Created ${createdCollections.length} collections`);

    // Add collection references to products
    const productsWithCollections = sampleProducts.map(product => ({
      ...product,
      collections: [createdCollections[0]._id] // Assign to Platform Series
    }));

    // Create products
    console.log('Creating products...');
    const createdProducts = await Product.insertMany(productsWithCollections);
    console.log(`Created ${createdProducts.length} products`);

    // Update collections with product references
    await Collection.findByIdAndUpdate(
      createdCollections[0]._id,
      { $push: { products: { $each: createdProducts.map(p => p._id) } } }
    );

    console.log('✅ Database seeded successfully!');
    console.log('\nCreated products:');
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (${product.slug}) - R${product.price}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

seedDatabase();
