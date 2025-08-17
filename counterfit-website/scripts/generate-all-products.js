#!/usr/bin/env node

/**
 * COUNTERFIT PRODUCT GENERATOR SCRIPT
 * Generates all products with complete API structure
 * 
 * Usage: node scripts/generate-all-products.js
 */

const products = [
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

// ===== COMBO PACKAGES =====
const combos = [
  {
    name: "Urban Elite Jacket + Pants Combo",
    slug: "urban-elite-jacket-pants-combo",
    description: "Premium jacket and pants combination with customer choice. Create your perfect urban ensemble by selecting any jacket and pants combination from our premium collection.",
    shortDescription: "Premium jacket and pants combination with customer choice",
    price: 1500,
    comparePrice: 0,
    stockCode: "CF-C001",
    category: "collections",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567898",
    costPrice: 0,
    sku: "CF-C001",
    salesCount: 0,
    images: [
      {
        alt: "Urban Elite Jacket + Pants Combo",
        url: "/Merch/COMBOPANTSJACKET.jpeg",
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
      { name: "Customizable", stock: 45, hexCode: "#000000", isAvailable: true }
    ],
    inventory: {
      quantity: 45,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 8
    },
    seo: {
      title: "Urban Elite Jacket + Pants Combo - Counterfit",
      keywords: ["combo", "jacket pants", "bundle", "premium"],
      description: "Premium jacket and pants combination with customer choice"
    },
    shipping: {
      weight: 1200,
      dimensions: { width: 50, height: 80, length: 20 },
      requiresShipping: true
    }
  },
  {
    name: "Skull King Jacket + Cap Combo",
    slug: "skull-king-jacket-cap-combo",
    description: "Premium jacket and skull cap combination with customer choice. Elevate your style with this perfect pairing of any jacket and our signature skull cap.",
    shortDescription: "Premium jacket and skull cap combination with customer choice",
    price: 1100,
    comparePrice: 0,
    stockCode: "CF-C002",
    category: "collections",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567899",
    costPrice: 0,
    sku: "CF-C002",
    salesCount: 0,
    images: [
      {
        alt: "Skull King Jacket + Cap Combo",
        url: "/Merch/COMBOSKULLYJACKET.jpeg",
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
      { name: "Customizable", stock: 36, hexCode: "#000000", isAvailable: true }
    ],
    inventory: {
      quantity: 36,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 6
    },
    seo: {
      title: "Skull King Jacket + Cap Combo - Counterfit",
      keywords: ["combo", "jacket cap", "bundle", "premium"],
      description: "Premium jacket and skull cap combination with customer choice"
    },
    shipping: {
      weight: 950,
      dimensions: { width: 48, height: 75, length: 18 },
      requiresShipping: true
    }
  }
];

// ===== COLLECTION PACKAGES =====
const collections = [
  {
    name: "Dynamic Duo Collection",
    slug: "dynamic-duo-collection",
    description: "Premium collection of any two jackets of customer's choice. Build your perfect duo with any combination of our premium jackets for maximum style and value.",
    shortDescription: "Premium collection of any two jackets of customer's choice",
    price: 1900,
    comparePrice: 0,
    stockCode: "CF-D001",
    category: "collections",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567900",
    costPrice: 0,
    sku: "CF-D001",
    salesCount: 0,
    images: [
      {
        alt: "Dynamic Duo Collection",
        url: "/Merch/JACKETDUOCOLLECTION.jpg",
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
      { name: "Customizable", stock: 24, hexCode: "#000000", isAvailable: true }
    ],
    inventory: {
      quantity: 24,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 4
    },
    seo: {
      title: "Dynamic Duo Collection - Counterfit",
      keywords: ["duo collection", "two jackets", "bundle", "premium"],
      description: "Premium collection of any two jackets of customer's choice"
    },
    shipping: {
      weight: 1600,
      dimensions: { width: 55, height: 85, length: 25 },
      requiresShipping: true
    }
  },
  {
    name: "Polar Twins Collection",
    slug: "polar-twins-collection",
    description: "Premium collection of any two jackets of customer's choice. Create your perfect twin set with any combination of our premium jackets for a coordinated look.",
    shortDescription: "Premium collection of any two jackets of customer's choice",
    price: 1900,
    comparePrice: 0,
    stockCode: "CF-D002",
    category: "collections",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567901",
    costPrice: 0,
    sku: "CF-D002",
    salesCount: 0,
    images: [
      {
        alt: "Polar Twins Collection",
        url: "/Merch/WHITEDUOCOLLECTION.jpg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 5, isAvailable: true },
      { size: "M", stock: 7, isAvailable: true },
      { size: "L", stock: 5, isAvailable: true },
      { size: "XL", stock: 3, isAvailable: true }
    ],
    colors: [
      { name: "Customizable", stock: 20, hexCode: "#000000", isAvailable: true }
    ],
    inventory: {
      quantity: 20,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 3
    },
    seo: {
      title: "Polar Twins Collection - Counterfit",
      keywords: ["twins collection", "two jackets", "bundle", "premium"],
      description: "Premium collection of any two jackets of customer's choice"
    },
    shipping: {
      weight: 1600,
      dimensions: { width: 55, height: 85, length: 25 },
      requiresShipping: true
    }
  },
  {
    name: "Trinity Elite Collection",
    slug: "trinity-elite-collection",
    description: "Premium collection of any three jackets of customer's choice. The ultimate collection for those who want it all - select any three jackets for maximum variety and style.",
    shortDescription: "Premium collection of any three jackets of customer's choice",
    price: 2700,
    comparePrice: 0,
    stockCode: "CF-T001",
    category: "collections",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567902",
    costPrice: 0,
    sku: "CF-T001",
    salesCount: 0,
    images: [
      {
        alt: "Trinity Elite Collection",
        url: "/Merch/TRIOCOLLECTION.jpg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 4, isAvailable: true },
      { size: "M", stock: 6, isAvailable: true },
      { size: "L", stock: 4, isAvailable: true },
      { size: "XL", stock: 2, isAvailable: true }
    ],
    colors: [
      { name: "Customizable", stock: 16, hexCode: "#000000", isAvailable: true }
    ],
    inventory: {
      quantity: 16,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 2
    },
    seo: {
      title: "Trinity Elite Collection - Counterfit",
      keywords: ["trinity collection", "three jackets", "bundle", "premium"],
      description: "Premium collection of any three jackets of customer's choice"
    },
    shipping: {
      weight: 2400,
      dimensions: { width: 60, height: 90, length: 30 },
      requiresShipping: true
    }
  },
  {
    name: "Wilderness Elite Collection",
    slug: "wilderness-elite-collection",
    description: "Pre-curated combination of Nature Camo + Black/White jacket combination. This carefully selected duo brings together the best of outdoor aesthetics and urban sophistication.",
    shortDescription: "Pre-curated combination of Nature Camo + Black/White jackets",
    price: 1900,
    comparePrice: 0,
    stockCode: "CF-M001",
    category: "collections",
    status: "active",
    featured: true,
    isNew: true,
    isAvailable: true,
    barcode: "6001234567903",
    costPrice: 0,
    sku: "CF-M001",
    salesCount: 0,
    images: [
      {
        alt: "Wilderness Elite Collection",
        url: "/Merch/DUONATURECAMOORBLACKWHITE MIX.jpeg",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "S", stock: 3, isAvailable: true },
      { size: "M", stock: 5, isAvailable: true },
      { size: "L", stock: 3, isAvailable: true },
      { size: "XL", stock: 2, isAvailable: true }
    ],
    colors: [
      { name: "Pre-selected", stock: 13, hexCode: "#4A5D23", isAvailable: true }
    ],
    inventory: {
      quantity: 13,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 2
    },
    seo: {
      title: "Wilderness Elite Collection - Counterfit",
      keywords: ["wilderness collection", "camo black white", "pre-curated", "premium"],
      description: "Pre-curated combination of Nature Camo + Black/White jacket combination"
    },
    shipping: {
      weight: 1600,
      dimensions: { width: 55, height: 85, length: 25 },
      requiresShipping: true
    }
  }
];

// Combine all products
const allProducts = [...products, ...combos, ...collections];

// Generate the script
console.log('🚀 COUNTERFIT PRODUCT GENERATOR');
console.log('================================\n');

console.log('📋 Total Products to Generate:', allProducts.length);
console.log('🧥 Jackets:', products.filter(p => p.category === 'jackets').length);
console.log('👖 Pants:', products.filter(p => p.category === 'pants').length);
console.log('🧢 Accessories:', products.filter(p => p.category === 'accessories').length);
console.log('🎯 Combos:', combos.length);
console.log('🌟 Collections:', collections.length);

console.log('\n📝 GENERATION SCRIPT:');
console.log('=====================\n');

console.log('// Run this in your admin panel or via API calls\n');
console.log('const products = ' + JSON.stringify(allProducts, null, 2) + ';\n');

console.log('// For each product, make a POST request to /api/admin/products\n');
console.log('products.forEach(async (product) => {');
console.log('  try {');
console.log('    const response = await fetch(\'/api/admin/products\', {');
console.log('      method: \'POST\',');
console.log('      headers: { \'Content-Type\': \'application/json\' },');
console.log('      body: JSON.stringify(product)');
console.log('    });');
console.log('    ');
console.log('    if (response.ok) {');
console.log('      console.log(`✅ Created: ${product.name}`);');
console.log('    } else {');
console.log('      console.log(`❌ Failed: ${product.name}`);');
console.log('    }');
console.log('  } catch (error) {');
console.log('    console.log(`❌ Error: ${product.name} - ${error.message}`);');
console.log('  }');
console.log('});\n');

console.log('🎯 QUICK START:');
console.log('===============\n');
console.log('1. Copy the products array above');
console.log('2. Run the generation script in your admin panel');
console.log('3. All products will be created with complete structure');
console.log('4. Images will reference your /Merch folder');
console.log('5. Product numbers (CF-J001, CF-P001, etc.) are included');
console.log('6. SEO, shipping, and inventory data is pre-configured\n');

console.log('✨ FEATURES INCLUDED:');
console.log('=====================\n');
console.log('✅ Complete product structure (all API fields)');
console.log('✅ Product numbering system (CF-J001, CF-P001, etc.)');
console.log('✅ Professional names and descriptions');
console.log('✅ Pricing structure (R1,000 jackets, R1,200 luxury, etc.)');
console.log('✅ Size and color variants');
console.log('✅ Inventory tracking');
console.log('✅ SEO optimization');
console.log('✅ Shipping information');
console.log('✅ Barcode and SKU numbers');
console.log('✅ Compare price handling (0 = hidden)');
console.log('✅ Featured and new product flags');
console.log('✅ Category organization');
console.log('✅ Image references to your Merch folder\n');

console.log('🚀 Ready to generate your complete Counterfit product catalog!');
