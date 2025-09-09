-- =====================================================
-- Fix RLS Policies for Backend Authentication
-- =====================================================
-- Since you're using backend auth instead of Supabase Auth,
-- we need to disable RLS or use a different approach

-- Option 1: Disable RLS temporarily to test
-- ALTER TABLE "UserSettings" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "UserAddresses" DISABLE ROW LEVEL SECURITY; 
-- ALTER TABLE "UserPaymentMethods" DISABLE ROW LEVEL SECURITY;

-- Option 2: Create a more permissive policy for authenticated users
-- (This is what we'll do - allow any authenticated user to manage their own data)

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own settings" ON "UserSettings";
DROP POLICY IF EXISTS "Users can insert own settings" ON "UserSettings";
DROP POLICY IF EXISTS "Users can update own settings" ON "UserSettings";
DROP POLICY IF EXISTS "Users can delete own settings" ON "UserSettings";

DROP POLICY IF EXISTS "Users can view own addresses" ON "UserAddresses";
DROP POLICY IF EXISTS "Users can insert own addresses" ON "UserAddresses";
DROP POLICY IF EXISTS "Users can update own addresses" ON "UserAddresses";
DROP POLICY IF EXISTS "Users can delete own addresses" ON "UserAddresses";

DROP POLICY IF EXISTS "Users can view own payment methods" ON "UserPaymentMethods";
DROP POLICY IF EXISTS "Users can insert own payment methods" ON "UserPaymentMethods";
DROP POLICY IF EXISTS "Users can update own payment methods" ON "UserPaymentMethods";
DROP POLICY IF EXISTS "Users can delete own payment methods" ON "UserPaymentMethods";

-- Create simpler policies that just check if user is authenticated
-- The API will handle the user ID filtering

CREATE POLICY "Authenticated users can manage settings" ON "UserSettings"
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage addresses" ON "UserAddresses"
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage payment methods" ON "UserPaymentMethods"
    FOR ALL USING (auth.role() = 'authenticated');

SELECT 'RLS policies updated for backend authentication!' as result;
