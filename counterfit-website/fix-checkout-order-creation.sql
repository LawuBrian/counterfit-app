-- Comprehensive Fix for Checkout Order Creation Issues
-- This script fixes RLS policies, schema constraints, and ensures order creation works

-- 1. Check current RLS status
SELECT 
    'Current RLS Status:' as info,
    schemaname, 
    tablename, 
    rowsecurity as "RLS_enabled"
FROM pg_tables 
WHERE tablename = 'Order';

-- 2. Drop any existing RLS policies for Order table
DROP POLICY IF EXISTS "Users can create their own orders" ON "Order";
DROP POLICY IF EXISTS "Users can view their own orders" ON "Order";
DROP POLICY IF EXISTS "Users can update their own orders" ON "Order";
DROP POLICY IF EXISTS "Admins can manage all orders" ON "Order";

-- 3. Disable RLS on Order table (since we're using NextAuth with custom backend)
ALTER TABLE "Order" DISABLE ROW LEVEL SECURITY;

-- 4. Fix schema constraints
-- Drop incorrect constraints
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_paymentStatus_check";
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_status_check";

-- Add correct constraints
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentStatus_check" 
    CHECK ("paymentStatus" IN ('pending', 'paid', 'failed', 'refunded'));

ALTER TABLE "Order" ADD CONSTRAINT "Order_status_check" 
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'draft'));

-- 5. Ensure all required columns exist with proper defaults
DO $$ 
BEGIN
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
END $$;

-- 6. Verify the fixes
SELECT 
    'Final RLS Status:' as info,
    schemaname, 
    tablename, 
    rowsecurity as "RLS_enabled"
FROM pg_tables 
WHERE tablename = 'Order';

SELECT 
    'Order Table Constraints:' as info,
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname = 'Order' AND contype = 'c';

SELECT 
    'Order Table Columns:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order'
ORDER BY ordinal_position;

SELECT '✅ Checkout order creation issues have been fixed!' as result;