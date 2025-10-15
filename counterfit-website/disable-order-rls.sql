-- Disable RLS for Order Table
-- Since we're using NextAuth with custom backend authentication,
-- we need to disable RLS for the Order table and handle security at the application level

-- Check current RLS status
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS_enabled"
FROM pg_tables 
WHERE tablename = 'Order';

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can create their own orders" ON "Order";
DROP POLICY IF EXISTS "Users can view their own orders" ON "Order";
DROP POLICY IF EXISTS "Users can update their own orders" ON "Order";
DROP POLICY IF EXISTS "Admins can manage all orders" ON "Order";

-- Disable RLS on Order table
ALTER TABLE "Order" DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as "RLS_enabled"
FROM pg_tables 
WHERE tablename = 'Order';

SELECT 'Order RLS disabled successfully! Application will handle security.' as result;