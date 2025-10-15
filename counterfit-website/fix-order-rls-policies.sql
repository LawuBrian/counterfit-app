-- Fix RLS Policies for Order Table
-- This script creates the necessary RLS policies to allow order creation

-- First, check if RLS is enabled on Order table
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS_enabled"
FROM pg_tables 
WHERE tablename = 'Order';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create their own orders" ON "Order";
DROP POLICY IF EXISTS "Users can view their own orders" ON "Order";
DROP POLICY IF EXISTS "Users can update their own orders" ON "Order";
DROP POLICY IF EXISTS "Admins can manage all orders" ON "Order";

-- Create RLS policies for Order table

-- Policy 1: Users can create orders for themselves
CREATE POLICY "Users can create their own orders" ON "Order"
    FOR INSERT
    WITH CHECK (auth.uid()::text = "userId");

-- Policy 2: Users can view their own orders
CREATE POLICY "Users can view their own orders" ON "Order"
    FOR SELECT
    USING (auth.uid()::text = "userId");

-- Policy 3: Users can update their own orders (for status updates, etc.)
CREATE POLICY "Users can update their own orders" ON "Order"
    FOR UPDATE
    USING (auth.uid()::text = "userId")
    WITH CHECK (auth.uid()::text = "userId");

-- Policy 4: Admins can manage all orders
CREATE POLICY "Admins can manage all orders" ON "Order"
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text 
            AND role = 'ADMIN'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Enable RLS on Order table if not already enabled
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

-- Verify policies were created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'Order'
ORDER BY policyname;

SELECT 'Order RLS policies created successfully!' as result;