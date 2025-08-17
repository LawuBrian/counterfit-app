const { supabase } = require('../lib/supabase');

async function initDatabase() {
  console.log('🚀 Initializing Counterfit database...');

  try {
    // Enable UUID extension
    console.log('🔧 Enabling UUID extension...');
    const { error: uuidError } = await supabase.rpc('exec_sql', {
      sql: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    });

    if (uuidError) {
      console.log('⚠️ UUID extension already exists or not needed');
    } else {
      console.log('✅ UUID extension enabled');
    }

    // Create Users table
    console.log('👥 Creating Users table...');
    const { error: userError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "User" (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          "firstName" VARCHAR(50) NOT NULL,
          "lastName" VARCHAR(50) NOT NULL,
          role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
          avatar VARCHAR(500),
          wishlist TEXT[],
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (userError) {
      console.log('⚠️ Users table already exists or error:', userError.message);
    } else {
      console.log('✅ Users table created');
    }

    // Create Collections table
    console.log('📚 Creating Collections table...');
    const { error: collectionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Collection" (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT,
          image VARCHAR(500),
          featured BOOLEAN DEFAULT false,
          status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (collectionError) {
      console.log('⚠️ Collections table already exists or error:', collectionError.message);
    } else {
      console.log('✅ Collections table created');
    }

    // Create Products table
    console.log('🛍️ Creating Products table...');
    const { error: productError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Product" (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) UNIQUE NOT NULL,
          description TEXT NOT NULL,
          "shortDescription" TEXT,
          price DECIMAL(10,2) NOT NULL,
          "comparePrice" DECIMAL(10,2),
          "costPrice" DECIMAL(10,2),
          "stockCode" VARCHAR(100) UNIQUE,
          sku VARCHAR(100) UNIQUE,
          barcode VARCHAR(100) UNIQUE,
          category VARCHAR(50) NOT NULL,
          status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
          featured BOOLEAN DEFAULT false,
          "isNew" BOOLEAN DEFAULT false,
          "isAvailable" BOOLEAN DEFAULT true,
          images JSONB NOT NULL,
          sizes JSONB NOT NULL,
          colors JSONB NOT NULL,
          inventory JSONB NOT NULL,
          shipping JSONB,
          seo JSONB,
          "totalStock" INTEGER DEFAULT 0,
          "salesCount" INTEGER DEFAULT 0,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (productError) {
      console.log('⚠️ Products table already exists or error:', productError.message);
    } else {
      console.log('✅ Products table created');
    }

    // Create Orders table
    console.log('📦 Creating Orders table...');
    const { error: orderError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS "Order" (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
          "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
          items JSONB NOT NULL,
          "totalAmount" DECIMAL(10,2) NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
          "paymentStatus" VARCHAR(20) DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'paid', 'failed', 'refunded')),
          "paymentMethod" VARCHAR(50),
          "paymentId" VARCHAR(255),
          "trackingNumber" VARCHAR(100),
          carrier VARCHAR(100),
          "estimatedDelivery" TIMESTAMP WITH TIME ZONE,
          "shippingAddress" JSONB NOT NULL,
          "billingAddress" JSONB,
          notes TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (orderError) {
      console.log('⚠️ Orders table already exists or error:', orderError.message);
    } else {
      console.log('✅ Orders table created');
    }

    // Create indexes
    console.log('🔍 Creating database indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);',
      'CREATE INDEX IF NOT EXISTS idx_user_role ON "User"(role);',
      'CREATE INDEX IF NOT EXISTS idx_collection_slug ON "Collection"(slug);',
      'CREATE INDEX IF NOT EXISTS idx_collection_status ON "Collection"(status);',
      'CREATE INDEX IF NOT EXISTS idx_product_slug ON "Product"(slug);',
      'CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"(category);',
      'CREATE INDEX IF NOT EXISTS idx_product_status ON "Product"(status);',
      'CREATE INDEX IF NOT EXISTS idx_order_user_id ON "Order"("userId");',
      'CREATE INDEX IF NOT EXISTS idx_order_number ON "Order"("orderNumber");',
      'CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);'
    ];

    for (const index of indexes) {
      try {
        await supabase.rpc('exec_sql', { sql: index });
      } catch (error) {
        console.log('⚠️ Index creation skipped or error:', error.message);
      }
    }

    console.log('✅ Database initialization completed!');
    console.log('🎉 Your Counterfit database is ready!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.error('💡 Error details:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
