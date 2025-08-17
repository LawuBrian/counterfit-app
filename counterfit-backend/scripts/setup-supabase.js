const { supabase } = require('../lib/supabase');
const bcrypt = require('bcryptjs');

async function setupSupabase() {
  console.log('🚀 Setting up Supabase database...');

  try {
    // Test connection first
    console.log('🔍 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('Product')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message);
      return;
    }

    console.log('✅ Supabase connection successful');

    // Create sample collections
    console.log('📚 Creating sample collections...');
    const collections = [
      {
        name: 'Platform Series',
        slug: 'platform-series',
        description: 'Elevated streetwear that puts you on another level',
        featured: true,
        status: 'published'
      },
      {
        name: 'Dynamic Motion',
        slug: 'dynamic-motion',
        description: 'Athletic-inspired pieces that blur the line between performance and style',
        featured: true,
        status: 'published'
      },
      {
        name: 'Urban Essentials',
        slug: 'urban-essentials',
        description: 'Everyday pieces that define your urban aesthetic',
        featured: false,
        status: 'published'
      }
    ];

    for (const collection of collections) {
      const { error } = await supabase
        .from('Collection')
        .upsert(collection, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Failed to create collection ${collection.name}:`, error.message);
      } else {
        console.log(`✅ Created collection: ${collection.name}`);
      }
    }

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = {
      email: 'admin@counterfit.co.za',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    };

    const { error: adminError } = await supabase
      .from('User')
      .upsert(adminUser, { onConflict: 'email' });

    if (adminError) {
      console.error('❌ Failed to create admin user:', adminError.message);
    } else {
      console.log('✅ Created admin user: admin@counterfit.co.za (password: admin123)');
    }

    // Create sample products
    console.log('🛍️ Creating sample products...');
    const products = [
      {
        name: 'Premium Black Jacket',
        slug: 'premium-black-jacket',
        description: 'A sophisticated black jacket perfect for any occasion. Made with premium materials and expert craftsmanship.',
        shortDescription: 'Premium black jacket for sophisticated style',
        price: 1299.99,
        comparePrice: 1599.99,
        category: 'outerwear',
        status: 'published',
        featured: true,
        isNew: true,
        isAvailable: true,
        images: [
          {
            url: '/images/blackjacket.jpg',
            alt: 'Premium Black Jacket',
            isPrimary: true
          }
        ],
        sizes: [
          { size: 'S', available: true },
          { size: 'M', available: true },
          { size: 'L', available: true },
          { size: 'XL', available: false }
        ],
        colors: [
          { name: 'Black', hex: '#000000', available: true }
        ],
        inventory: {
          total: 15,
          reserved: 0,
          available: 15
        },
        totalStock: 15,
        salesCount: 0
      },
      {
        name: 'Camo Performance Jacket',
        slug: 'camo-performance-jacket',
        description: 'High-performance camouflage jacket designed for both style and functionality. Perfect for outdoor activities.',
        shortDescription: 'Performance camo jacket for outdoor style',
        price: 899.99,
        comparePrice: 1099.99,
        category: 'outerwear',
        status: 'published',
        featured: true,
        isNew: false,
        isAvailable: true,
        images: [
          {
            url: '/images/camo-jacket.jpg',
            alt: 'Camo Performance Jacket',
            isPrimary: true
          }
        ],
        sizes: [
          { size: 'S', available: true },
          { size: 'M', available: true },
          { size: 'L', available: true }
        ],
        colors: [
          { name: 'Camo', hex: '#4A5D23', available: true }
        ],
        inventory: {
          total: 12,
          reserved: 0,
          available: 12
        },
        totalStock: 12,
        salesCount: 0
      }
    ];

    for (const product of products) {
      const { error } = await supabase
        .from('Product')
        .upsert(product, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Failed to create product ${product.name}:`, error.message);
      } else {
        console.log(`✅ Created product: ${product.name}`);
      }
    }

    console.log('🎉 Supabase setup completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Collections: 3 created');
    console.log('- Admin user: admin@counterfit.co.za (password: admin123)');
    console.log('- Products: 2 created');
    console.log('\n🔑 Next steps:');
    console.log('1. Test the API endpoints');
    console.log('2. Update your frontend to use the new Supabase routes');
    console.log('3. Configure Row Level Security (RLS) in Supabase if needed');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupSupabase()
    .then(() => {
      console.log('Setup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup script failed:', error);
      process.exit(1);
    });
}

module.exports = { setupSupabase };
