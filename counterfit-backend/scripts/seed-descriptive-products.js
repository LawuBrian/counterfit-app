const { supabase } = require('../lib/supabase');
require('dotenv').config();

// Sample products with descriptive image paths
const sampleProducts = [
  {
    name: "Premium Black Jacket",
    slug: "premium-black-jacket",
    description: "A sophisticated black jacket that combines style with comfort. Perfect for any occasion, this premium piece features high-quality materials and expert craftsmanship.",
    shortDescription: "Sophisticated black jacket with premium materials",
    price: 2500.00,
    comparePrice: 3000.00,
    costPrice: 1250.00,
    stockCode: "CF-JACKET-BLK-001",
    sku: "CF-JACKET-BLK-M",
    barcode: "1234567890123",
    category: "outerwear",
    status: "published",
    featured: true,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "/images/outerwear/BLACKJACKET.jpeg",
        alt: "Premium Black Jacket - Front View",
        isPrimary: true
      },
      {
        url: "/images/outerwear/FURRYGREYJACKET.jpeg",
        alt: "Premium Black Jacket - Alternative Style",
        isPrimary: false
      }
    ],
    sizes: [
      { size: "S", stock: 15, isAvailable: true },
      { size: "M", stock: 25, isAvailable: true },
      { size: "L", stock: 20, isAvailable: true },
      { size: "XL", stock: 12, isAvailable: true }
    ],
    colors: [
      { name: "Black", hexCode: "#000000", stock: 40, isAvailable: true },
      { name: "Grey", hexCode: "#808080", stock: 20, isAvailable: true }
    ],
    inventory: {
      quantity: 72,
      trackQuantity: true,
      lowStockThreshold: 10
    },
    shipping: {
      weight: 800,
      dimensions: { length: 35, width: 30, height: 8 },
      requiresShipping: true
    },
    seo: {
      title: "Premium Black Jacket - Counterfit",
      description: "Sophisticated black jacket with premium materials and expert craftsmanship",
      keywords: ["jacket", "outerwear", "premium", "black", "fashion"]
    },
    totalStock: 72,
    salesCount: 0
  },
  {
    name: "Luxury Grey Jacket",
    slug: "luxury-grey-jacket",
    description: "Experience ultimate luxury with this premium grey jacket. Crafted from the finest materials, it offers both style and comfort for the discerning fashion enthusiast.",
    shortDescription: "Ultimate luxury grey jacket with premium craftsmanship",
    price: 2800.00,
    comparePrice: 3500.00,
    costPrice: 1400.00,
    stockCode: "CF-JACKET-GREY-001",
    sku: "CF-JACKET-GREY-M",
    barcode: "1234567890124",
    category: "outerwear",
    status: "published",
    featured: true,
    isNew: false,
    isAvailable: true,
    images: [
      {
        url: "/images/outerwear/FURRYGREYJACKET.jpeg",
        alt: "Luxury Grey Jacket - Front View",
        isPrimary: true
      },
      {
        url: "/images/outerwear/LUXURYJACKET.jpeg",
        alt: "Luxury Grey Jacket - Luxury Detail",
        isPrimary: false
      }
    ],
    sizes: [
      { size: "S", stock: 12, isAvailable: true },
      { size: "M", stock: 20, isAvailable: true },
      { size: "L", stock: 18, isAvailable: true },
      { size: "XL", stock: 10, isAvailable: true }
    ],
    colors: [
      { name: "Grey", hexCode: "#808080", stock: 35, isAvailable: true },
      { name: "Charcoal", hexCode: "#36454F", stock: 15, isAvailable: true }
    ],
    inventory: {
      quantity: 60,
      trackQuantity: true,
      lowStockThreshold: 8
    },
    shipping: {
      weight: 850,
      dimensions: { length: 36, width: 31, height: 8 },
      requiresShipping: true
    },
    seo: {
      title: "Luxury Grey Jacket - Counterfit",
      description: "Ultimate luxury grey jacket with premium craftsmanship and finest materials",
      keywords: ["jacket", "outerwear", "luxury", "grey", "premium"]
    },
    totalStock: 60,
    salesCount: 0
  },
  {
    name: "Nature Camo Jacket",
    slug: "nature-camo-jacket",
    description: "Blend into your surroundings with this nature-inspired camouflage jacket. Perfect for outdoor enthusiasts who want to stay stylish while embracing the wilderness.",
    shortDescription: "Nature-inspired camouflage jacket for outdoor enthusiasts",
    price: 2200.00,
    comparePrice: 2800.00,
    costPrice: 1100.00,
    stockCode: "CF-JACKET-CAMO-001",
    sku: "CF-JACKET-CAMO-M",
    barcode: "1234567890125",
    category: "outerwear",
    status: "published",
    featured: false,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "/images/outerwear/NATUREJACKET.jpeg",
        alt: "Nature Camo Jacket - Front View",
        isPrimary: true
      },
      {
        url: "/images/outerwear/DUONATURECAMOORBLACKWHITE MIX.jpeg",
        alt: "Nature Camo Jacket - Camo Pattern",
        isPrimary: false
      }
    ],
    sizes: [
      { size: "S", stock: 18, isAvailable: true },
      { size: "M", stock: 22, isAvailable: true },
      { size: "L", stock: 20, isAvailable: true },
      { size: "XL", stock: 15, isAvailable: true }
    ],
    colors: [
      { name: "Camo", hexCode: "#4A5D23", stock: 45, isAvailable: true },
      { name: "Forest Green", hexCode: "#228B22", stock: 20, isAvailable: true }
    ],
    inventory: {
      quantity: 75,
      trackQuantity: true,
      lowStockThreshold: 12
    },
    shipping: {
      weight: 750,
      dimensions: { length: 34, width: 29, height: 7 },
      requiresShipping: true
    },
    seo: {
      title: "Nature Camo Jacket - Counterfit",
      description: "Nature-inspired camouflage jacket perfect for outdoor enthusiasts",
      keywords: ["jacket", "outerwear", "camo", "nature", "outdoor"]
    },
    totalStock: 75,
    salesCount: 0
  },
  {
    name: "Counterfit Pants",
    slug: "counterfit-pants",
    description: "Premium streetwear pants that define the Counterfit aesthetic. Comfortable, stylish, and perfect for any urban setting.",
    shortDescription: "Premium streetwear pants with Counterfit aesthetic",
    price: 1200.00,
    comparePrice: 1500.00,
    costPrice: 600.00,
    stockCode: "CF-PANTS-001",
    sku: "CF-PANTS-BLK-M",
    barcode: "1234567890126",
    category: "bottoms",
    status: "published",
    featured: true,
    isNew: false,
    isAvailable: true,
    images: [
      {
        url: "/images/bottoms/COUNTERFITPANTS.jpeg",
        alt: "Counterfit Pants - Front View",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "30", stock: 20, isAvailable: true },
      { size: "32", stock: 25, isAvailable: true },
      { size: "34", stock: 22, isAvailable: true },
      { size: "36", stock: 18, isAvailable: true }
    ],
    colors: [
      { name: "Black", hexCode: "#000000", stock: 50, isAvailable: true },
      { name: "Navy", hexCode: "#001f3f", stock: 25, isAvailable: true }
    ],
    inventory: {
      quantity: 85,
      trackQuantity: true,
      lowStockThreshold: 15
    },
    shipping: {
      weight: 500,
      dimensions: { length: 32, width: 28, height: 3 },
      requiresShipping: true
    },
    seo: {
      title: "Counterfit Pants - Counterfit",
      description: "Premium streetwear pants that define the Counterfit aesthetic",
      keywords: ["pants", "bottoms", "streetwear", "premium", "urban"]
    },
    totalStock: 85,
    salesCount: 0
  },
  {
    name: "White Duo Collection Top",
    slug: "white-duo-collection-top",
    description: "Part of our exclusive White Duo Collection, this premium top offers sophisticated style and exceptional comfort.",
    shortDescription: "Exclusive white top from the Duo Collection",
    price: 800.00,
    comparePrice: 1000.00,
    costPrice: 400.00,
    stockCode: "CF-TOP-DUO-001",
    sku: "CF-TOP-WHT-M",
    barcode: "1234567890127",
    category: "tops",
    status: "published",
    featured: false,
    isNew: true,
    isAvailable: true,
    images: [
      {
        url: "/images/tops/WHITEDUOCOLLECTION.jpg",
        alt: "White Duo Collection Top - Front View",
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
      { name: "White", hexCode: "#FFFFFF", stock: 40, isAvailable: true },
      { name: "Off-White", hexCode: "#F5F5DC", stock: 20, isAvailable: true }
    ],
    inventory: {
      quantity: 65,
      trackQuantity: true,
      lowStockThreshold: 10
    },
    shipping: {
      weight: 300,
      dimensions: { length: 28, width: 24, height: 2 },
      requiresShipping: true
    },
    seo: {
      title: "White Duo Collection Top - Counterfit",
      description: "Exclusive white top from the premium Duo Collection",
      keywords: ["top", "tops", "white", "duo", "collection", "exclusive"]
    },
    totalStock: 65,
    salesCount: 0
  },
  {
    name: "Premium Skullcap",
    slug: "premium-skullcap",
    description: "A premium skullcap that combines street style with comfort. Perfect for completing any urban look.",
    shortDescription: "Premium skullcap for street style completion",
    price: 300.00,
    comparePrice: 400.00,
    costPrice: 150.00,
    stockCode: "CF-ACC-SKULL-001",
    sku: "CF-SKULL-BLK-OS",
    barcode: "1234567890128",
    category: "accessories",
    status: "published",
    featured: false,
    isNew: false,
    isAvailable: true,
    images: [
      {
        url: "/images/accessories/SKULLCAP.jpg",
        alt: "Premium Skullcap - Front View",
        isPrimary: true
      }
    ],
    sizes: [
      { size: "One Size", stock: 100, isAvailable: true }
    ],
    colors: [
      { name: "Black", hexCode: "#000000", stock: 60, isAvailable: true },
      { name: "Grey", hexCode: "#808080", stock: 40, isAvailable: true }
    ],
    inventory: {
      quantity: 100,
      trackQuantity: true,
      lowStockThreshold: 20
    },
    shipping: {
      weight: 100,
      dimensions: { length: 20, width: 18, height: 2 },
      requiresShipping: true
    },
    seo: {
      title: "Premium Skullcap - Counterfit",
      description: "Premium skullcap that combines street style with comfort",
      keywords: ["skullcap", "accessories", "street style", "urban", "premium"]
    },
    totalStock: 100,
    salesCount: 0
  }
];

// Sample collections with descriptive images
const sampleCollections = [
  {
    name: "Premium Jacket Collection",
    slug: "premium-jacket-collection",
    description: "Our finest selection of premium jackets featuring luxury materials and expert craftsmanship.",
    image: "/images/collections/JACKETDUOCOLLECTION.jpg",
    featured: true,
    status: "published",
    collectionType: "combo",
    basePrice: 2500.00,
    allowCustomSelection: true,
    maxSelections: 3,
    productCategories: [
      {
        name: "jackets",
        maxSelections: 2,
        selectedProducts: []
      }
    ]
  },
  {
    name: "Urban Street Style",
    slug: "urban-street-style",
    description: "Complete urban street style look with coordinated pieces for the modern streetwear enthusiast.",
    image: "/images/collections/DUONATURECAMOORBLACKWHITE MIX.jpeg",
    featured: true,
    status: "published",
    collectionType: "duo",
    basePrice: 1800.00,
    allowCustomSelection: false,
    maxSelections: 2,
    productCategories: [
      {
        name: "jackets",
        maxSelections: 1,
        selectedProducts: []
      },
      {
        name: "pants",
        maxSelections: 1,
        selectedProducts: []
      }
    ]
  },
  {
    name: "Trio Collection",
    slug: "trio-collection",
    description: "Complete three-piece collection offering maximum style and versatility.",
    image: "/images/collections/TRIOCOLLECTION.jpeg",
    featured: false,
    status: "published",
    collectionType: "trio",
    basePrice: 3500.00,
    allowCustomSelection: true,
    maxSelections: 3,
    productCategories: [
      {
        name: "jackets",
        maxSelections: 1,
        selectedProducts: []
      },
      {
        name: "tops",
        maxSelections: 1,
        selectedProducts: []
      },
      {
        name: "bottoms",
        maxSelections: 1,
        selectedProducts: []
      }
    ]
  }
];

async function seedDescriptiveProducts() {
  try {
    console.log('🌱 Seeding database with descriptive image products...');
    
    // Check environment variables
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY is missing!');
      return;
    }

    // Step 1: Clear existing products and collections
    console.log('\n🗑️ Clearing existing data...');
    
    const { error: deleteProductsError } = await supabase
      .from('Product')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Keep admin products
    
    if (deleteProductsError) {
      console.error('❌ Error deleting products:', deleteProductsError);
    } else {
      console.log('✅ Existing products cleared');
    }
    
    const { error: deleteCollectionsError } = await supabase
      .from('Collection')
      .delete()
      .neq('id', '11111111-1111-1111-1111-111111111111') // Keep sample collections
      .neq('id', '22222222-2222-2222-2222-222222222222');
    
    if (deleteCollectionsError) {
      console.error('❌ Error deleting collections:', deleteCollectionsError);
    } else {
      console.log('✅ Existing collections cleared');
    }

    // Step 2: Create collections first
    console.log('\n🎨 Creating collections...');
    
    for (const collection of sampleCollections) {
      const { data: createdCollection, error: collectionError } = await supabase
        .from('Collection')
        .insert(collection)
        .select()
        .single();
      
      if (collectionError) {
        console.error(`❌ Error creating collection ${collection.name}:`, collectionError);
      } else {
        console.log(`✅ Created collection: ${createdCollection.name}`);
      }
    }

    // Step 3: Create products
    console.log('\n📦 Creating products...');
    
    for (const product of sampleProducts) {
      const { data: createdProduct, error: productError } = await supabase
        .from('Product')
        .insert(product)
        .select()
        .single();
      
      if (productError) {
        console.error(`❌ Error creating product ${product.name}:`, productError);
      } else {
        console.log(`✅ Created product: ${createdProduct.name} with ${createdProduct.images?.length || 0} images`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Created ${sampleCollections.length} collections`);
    console.log(`- Created ${sampleProducts.length} products`);
    console.log('\n🔍 Next steps:');
    console.log('1. Check your website - products should now display with descriptive images');
    console.log('2. Verify that all image paths are working correctly');
    console.log('3. Test the admin panel to ensure products can be managed properly');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run the seeding
seedDescriptiveProducts();
