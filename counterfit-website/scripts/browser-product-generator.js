/**
 * COUNTERFIT BROWSER PRODUCT GENERATOR
 * Run this in your admin panel browser console
 * 
 * Copy and paste this entire script into your browser console
 */

console.log('🚀 COUNTERFIT PRODUCT GENERATOR - Browser Version');
console.log('================================================\n');

// All products with complete API structure
const allProducts = [
  // ===== JACKETS =====
  {
    name: "Midnight Shadow Premium Jacket",
    slug: "midnight-shadow-premium-jacket",
    description: "Premium black jacket with sleek design and superior craftsmanship. The Midnight Shadow embodies urban sophistication with its refined silhouette and premium materials. Perfect for those who appreciate understated luxury and exceptional quality.",
    shortDescription: "Premium black jacket with sleek design and superior craftsmanship",
    price: 1000,
    comparePrice: 0,
    stockCode: "CF-J001",
    category: "jackets",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567891",
    costPrice: 0,
    sku: "CF-J001",
    salesCount: 0,
    images: [
      {
        alt: "Midnight Shadow Premium Jacket",
        url: "/Merch/BLACKJACKET.jpeg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 15, isAvailable: true },
      { size: "M", stock: 20, isAvailable: true },
      { size: "L", stock: 18, isAvailable: true },
      { size: "XL", stock: 12, isAvailable: true }
    ],
    colors: [
      { name: "Black", stock: 65, hexCode: "#000000", isAvailable: true }
    ],
    inventory: {
      quantity: 65,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 10
    },
    seo: {
      title: "Midnight Shadow Premium Jacket - Counterfit",
      keywords: ["premium jacket", "black jacket", "streetwear", "luxury"],
      description: "Premium black jacket with sleek design and superior craftsmanship"
    },
    shipping: {
      weight: 800,
      dimensions: { width: 45, height: 70, length: 15 },
      requiresShipping: true
    }
  },
  {
    name: "Arctic Frost Premium Jacket",
    slug: "arctic-frost-premium-jacket",
    description: "Elegant white jacket with premium materials and modern styling. The Arctic Frost combines pristine aesthetics with exceptional comfort, featuring a clean design that makes a bold statement in any setting.",
    shortDescription: "Elegant white jacket with premium materials and modern styling",
    price: 1000,
    comparePrice: 0,
    stockCode: "CF-J002",
    category: "jackets",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567892",
    costPrice: 0,
    sku: "CF-J002",
    salesCount: 0,
    images: [
      {
        alt: "Arctic Frost Premium Jacket",
        url: "/Merch/WHITEJACKET.jpeg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 12, isAvailable: true },
      { size: "M", stock: 18, isAvailable: true },
      { size: "L", stock: 15, isAvailable: true },
      { size: "XL", stock: 10, isAvailable: true }
    ],
    colors: [
      { name: "White", stock: 55, hexCode: "#FFFFFF", isAvailable: true }
    ],
    inventory: {
      quantity: 55,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 10
    },
    seo: {
      title: "Arctic Frost Premium Jacket - Counterfit",
      keywords: ["white jacket", "premium jacket", "elegant", "streetwear"],
      description: "Elegant white jacket with premium materials and modern styling"
    },
    shipping: {
      weight: 800,
      dimensions: { width: 45, height: 70, length: 15 },
      requiresShipping: true
    }
  },
  {
    name: "Forest Camo Premium Jacket",
    slug: "forest-camo-premium-jacket",
    description: "Nature-inspired camouflage jacket with tactical design. The Forest Camo combines rugged outdoor aesthetics with urban streetwear appeal, featuring a distinctive pattern that stands out in any crowd.",
    shortDescription: "Nature-inspired camouflage jacket with tactical design",
    price: 1000,
    comparePrice: 0,
    stockCode: "CF-J003",
    category: "jackets",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567893",
    costPrice: 0,
    sku: "CF-J003",
    salesCount: 0,
    images: [
      {
        alt: "Forest Camo Premium Jacket",
        url: "/Merch/NATUREJACKET.jpeg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 10, isAvailable: true },
      { size: "M", stock: 15, isAvailable: true },
      { size: "L", stock: 12, isAvailable: true },
      { size: "XL", stock: 8, isAvailable: true }
    ],
    colors: [
      { name: "Forest Camo", stock: 45, hexCode: "#4A5D23", isAvailable: true }
    ],
    inventory: {
      quantity: 45,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 8
    },
    seo: {
      title: "Forest Camo Premium Jacket - Counterfit",
      keywords: ["camo jacket", "forest camo", "tactical", "outdoor"],
      description: "Nature-inspired camouflage jacket with tactical design"
    },
    shipping: {
      weight: 800,
      dimensions: { width: 45, height: 70, length: 15 },
      requiresShipping: true
    }
  },
  {
    name: "Storm Cloud Furry Premium Jacket",
    slug: "storm-cloud-furry-premium-jacket",
    description: "Luxurious furry grey jacket with premium texture and comfort. The Storm Cloud features an ultra-soft exterior that provides both warmth and style, perfect for those who demand exceptional quality and comfort.",
    shortDescription: "Luxurious furry grey jacket with premium texture and comfort",
    price: 1000,
    comparePrice: 0,
    stockCode: "CF-J004",
    category: "jackets",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567894",
    costPrice: 0,
    sku: "CF-J004",
    salesCount: 0,
    images: [
      {
        alt: "Storm Cloud Furry Premium Jacket",
        url: "/Merch/FURRYGREYJACKET.jpeg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 8, isAvailable: true },
      { size: "M", stock: 12, isAvailable: true },
      { size: "L", stock: 10, isAvailable: true },
      { size: "XL", stock: 6, isAvailable: true }
    ],
    colors: [
      { name: "Grey", stock: 36, hexCode: "#808080", isAvailable: true }
    ],
    inventory: {
      quantity: 36,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 6
    },
    seo: {
      title: "Storm Cloud Furry Premium Jacket - Counterfit",
      keywords: ["furry jacket", "grey jacket", "luxury", "comfort"],
      description: "Luxurious furry grey jacket with premium texture and comfort"
    },
    shipping: {
      weight: 900,
      dimensions: { width: 50, height: 75, length: 18 },
      requiresShipping: true
    }
  },
  {
    name: "Royal Crown Luxury Jacket",
    slug: "royal-crown-luxury-jacket",
    description: "Ultra-premium luxury jacket with exclusive materials and design. The Royal Crown represents the pinnacle of Counterfit craftsmanship, featuring the finest materials and most sophisticated design elements for the discerning customer.",
    shortDescription: "Ultra-premium luxury jacket with exclusive materials and design",
    price: 1200,
    comparePrice: 0,
    stockCode: "CF-J005",
    category: "jackets",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567895",
    costPrice: 0,
    sku: "CF-J005",
    salesCount: 0,
    images: [
      {
        alt: "Royal Crown Luxury Jacket",
        url: "/Merch/LUXURYJACKET.jpeg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 6, isAvailable: true },
      { size: "M", stock: 8, isAvailable: true },
      { size: "L", stock: 6, isAvailable: true },
      { size: "XL", stock: 4, isAvailable: true }
    ],
    colors: [
      { name: "Luxury Black", stock: 24, hexCode: "#1A1A1A", isAvailable: true }
    ],
    inventory: {
      quantity: 24,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 4
    },
    seo: {
      title: "Royal Crown Luxury Jacket - Counterfit",
      keywords: ["luxury jacket", "premium", "exclusive", "royal crown"],
      description: "Ultra-premium luxury jacket with exclusive materials and design"
    },
    shipping: {
      weight: 850,
      dimensions: { width: 48, height: 72, length: 16 },
      requiresShipping: true
    }
  },

  // ===== PANTS =====
  {
    name: "Urban Elite Premium Pants",
    slug: "urban-elite-premium-pants",
    description: "Premium pants with urban streetwear aesthetic. The Urban Elite combines comfort with style, featuring a modern fit that works perfectly with any Counterfit jacket for a complete premium look.",
    shortDescription: "Premium pants with urban streetwear aesthetic",
    price: 500,
    comparePrice: 0,
    stockCode: "CF-P001",
    category: "pants",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567896",
    costPrice: 0,
    sku: "CF-P001",
    salesCount: 0,
    images: [
      {
        alt: "Urban Elite Premium Pants",
        url: "/Merch/COUNTERFITPANTS.jpeg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "30", stock: 12, isAvailable: true },
      { size: "32", stock: 18, isAvailable: true },
      { size: "34", stock: 15, isAvailable: true },
      { size: "36", stock: 10, isAvailable: true }
    ],
    colors: [
      { name: "Black", stock: 55, hexCode: "#000000", isAvailable: true }
    ],
    inventory: {
      quantity: 55,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 8
    },
    seo: {
      title: "Urban Elite Premium Pants - Counterfit",
      keywords: ["premium pants", "streetwear", "urban", "comfort"],
      description: "Premium pants with urban streetwear aesthetic"
    },
    shipping: {
      weight: 400,
      dimensions: { width: 35, height: 100, length: 8 },
      requiresShipping: true
    }
  },

  // ===== ACCESSORIES =====
  {
    name: "Skull King Premium Cap",
    slug: "skull-king-premium-cap",
    description: "Premium skull cap with distinctive design. The Skull King delivers a sleek silhouette that elevates any look—whether paired with streetwear or layered under outerwear. Its smooth fit and breathable finish make it as functional as it is stylish.",
    shortDescription: "Premium skull cap with distinctive design",
    price: 200,
    comparePrice: 0,
    stockCode: "CF-A001",
    category: "accessories",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567897",
    costPrice: 0,
    sku: "CF-A001",
    salesCount: 0,
    images: [
      {
        alt: "Skull King Premium Cap",
        url: "/Merch/SKULLCAP.jpg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "One Size Fits All", stock: 25, isAvailable: true }
    ],
    colors: [
      { name: "Black", stock: 25, hexCode: "#000000", isAvailable: true }
    ],
    inventory: {
      quantity: 25,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 5
    },
    seo: {
      title: "Skull King Premium Cap - Counterfit",
      keywords: ["skull cap", "premium cap", "accessories", "streetwear"],
      description: "Premium skull cap with distinctive design"
    },
    shipping: {
      weight: 150,
      dimensions: { width: 20, height: 25, length: 20 },
      requiresShipping: true
    }
  }
];

// Function to create a product
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

// Function to generate all products
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

// Make functions available globally
window.generateAllProducts = generateAllProducts;
window.createProduct = createProduct;
window.allProducts = allProducts;

console.log('🚀 Ready! Use these commands:');
console.log('================================');
console.log('• generateAllProducts() - Create all products');
console.log('• createProduct(product) - Create a specific product');
console.log('• allProducts - View all product data');
console.log('\n💡 Tip: Run generateAllProducts() to start!');
