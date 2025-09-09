-- Migration script to fix existing order structure
-- Run this in your Supabase SQL editor

-- First, let's see what we have and fix the Order table structure
DO $$ 
BEGIN
    -- Add missing columns to Order table if they don't exist
    
    -- Add paymentStatus column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'paymentStatus') THEN
        ALTER TABLE "Order" ADD COLUMN "paymentStatus" TEXT DEFAULT 'PENDING';
    END IF;
    
    -- Add paymentId column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'paymentId') THEN
        ALTER TABLE "Order" ADD COLUMN "paymentId" TEXT;
    END IF;
    
    -- Add paymentMethod column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'paymentMethod') THEN
        ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT;
    END IF;
    
    -- Add trackingNumber column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'trackingNumber') THEN
        ALTER TABLE "Order" ADD COLUMN "trackingNumber" TEXT;
    END IF;
    
    -- Add carrier column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'carrier') THEN
        ALTER TABLE "Order" ADD COLUMN "carrier" TEXT;
    END IF;
    
    -- Add estimatedDelivery column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'estimatedDelivery') THEN
        ALTER TABLE "Order" ADD COLUMN "estimatedDelivery" TIMESTAMP WITH TIME ZONE;
    END IF;
    
    -- Add notes column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'notes') THEN
        ALTER TABLE "Order" ADD COLUMN "notes" TEXT;
    END IF;
    
    -- Add subtotal column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'subtotal') THEN
        ALTER TABLE "Order" ADD COLUMN "subtotal" DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Add tax column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'tax') THEN
        ALTER TABLE "Order" ADD COLUMN "tax" DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    -- Add shipping column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Order' AND column_name = 'shipping') THEN
        ALTER TABLE "Order" ADD COLUMN "shipping" DECIMAL(10,2) DEFAULT 0;
    END IF;
    
    RAISE NOTICE 'Order table columns updated successfully';
END $$;

-- Now add missing columns to User table
DO $$ 
BEGIN
    -- Add firstName column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'firstName') THEN
        ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
    END IF;
    
    -- Add lastName column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'lastName') THEN
        ALTER TABLE "User" ADD COLUMN "lastName" TEXT;
    END IF;
    
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'phone') THEN
        ALTER TABLE "User" ADD COLUMN "phone" TEXT;
    END IF;
    
    RAISE NOTICE 'User table columns updated successfully';
END $$;

-- Update existing orders to have proper default values
UPDATE "Order" 
SET 
    "subtotal" = COALESCE("subtotal", "totalAmount"),
    "tax" = COALESCE("tax", 0),
    "shipping" = COALESCE("shipping", 0),
    "paymentStatus" = COALESCE("paymentStatus", 'PENDING'),
    "paymentMethod" = COALESCE("paymentMethod", 'yoco')
WHERE "subtotal" IS NULL OR "tax" IS NULL OR "shipping" IS NULL OR "paymentStatus" IS NULL;

-- If you have an existing order that should be marked as paid, update it
-- (Replace 'YOUR_ORDER_ID' with the actual order ID)
-- UPDATE "Order" 
-- SET 
--     "paymentStatus" = 'PAID',
--     "status" = 'CONFIRMED'
-- WHERE "id" = 'YOUR_ORDER_ID';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_user_id ON "Order"("userId");
CREATE INDEX IF NOT EXISTS idx_order_status ON "Order"("status");
CREATE INDEX IF NOT EXISTS idx_order_payment_status ON "Order"("paymentStatus");
CREATE INDEX IF NOT EXISTS idx_order_created_at ON "Order"("createdAt");

-- Verify the structure
SELECT 
    'Order table columns:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order'
ORDER BY ordinal_position;

SELECT 
    'User table columns:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'User'
ORDER BY ordinal_position;

-- Show current orders
SELECT 
    'Current orders:' as info,
    "id",
    "orderNumber",
    "userId",
    "status",
    "paymentStatus",
    "totalAmount",
    "createdAt"
FROM "Order"
ORDER BY "createdAt" DESC;
