-- Supabase Database Schema for Counterfit Backend
-- This file contains the SQL to create all necessary tables

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS "User" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(50) NOT NULL,
    "lastName" VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    avatar VARCHAR(500),
    wishlist TEXT[], -- Array of product IDs
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collections table
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

-- Products table
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
    images JSONB NOT NULL, -- Array of image objects
    sizes JSONB NOT NULL, -- Array of size objects
    colors JSONB NOT NULL, -- Array of color objects
    inventory JSONB NOT NULL, -- Inventory object
    shipping JSONB, -- Shipping object
    seo JSONB, -- SEO object
    "totalStock" INTEGER,
    "salesCount" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS "Order" (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "userId" UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
    items JSONB NOT NULL, -- Array of order items
    "totalAmount" DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    "paymentStatus" VARCHAR(20) DEFAULT 'pending' CHECK (paymentStatus IN ('pending', 'paid', 'failed', 'refunded')),
    "paymentMethod" VARCHAR(50),
    "paymentId" VARCHAR(255),
    "trackingNumber" VARCHAR(100),
    carrier VARCHAR(100),
    "estimatedDelivery" TIMESTAMP WITH TIME ZONE,
    "shippingAddress" JSONB NOT NULL, -- Shipping address object
    "billingAddress" JSONB, -- Billing address object
    notes TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_user_role ON "User"(role);
CREATE INDEX IF NOT EXISTS idx_collection_slug ON "Collection"(slug);
CREATE INDEX IF NOT EXISTS idx_collection_status ON "Collection"(status);
CREATE INDEX IF NOT EXISTS idx_product_slug ON "Product"(slug);
CREATE INDEX IF NOT EXISTS idx_product_category ON "Product"(category);
CREATE INDEX IF NOT EXISTS idx_product_status ON "Product"(status);
CREATE INDEX IF NOT EXISTS idx_order_user_id ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_order_number ON "Order"("orderNumber");
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collection_updated_at BEFORE UPDATE ON "Collection" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON "Product" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "Order" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
-- You can uncomment these lines to add initial data

-- Sample collections
INSERT INTO "Collection" (name, slug, description, featured, status) VALUES
('Platform Series', 'platform-series', 'Elevated streetwear that puts you on another level', true, 'published'),
('Dynamic Motion', 'dynamic-motion', 'Athletic-inspired pieces that blur the line between performance and style', true, 'published')
ON CONFLICT (slug) DO NOTHING;

-- Sample admin user (password: admin123)
INSERT INTO "User" (email, password, "firstName", "lastName", role) VALUES
('admin@counterfit.co.za', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Kq8Kq8', 'Admin', 'User', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
