-- =====================================================
-- Disable RLS for Backend Authentication
-- =====================================================
-- Since you're using backend auth and the Supabase client 
-- is not authenticated, we need to disable RLS and rely 
-- on API-level filtering

-- Disable RLS on all user tables
ALTER TABLE "UserSettings" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAddresses" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "UserPaymentMethods" DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies (they're not needed anymore)
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON "UserSettings";
DROP POLICY IF EXISTS "Authenticated users can manage addresses" ON "UserAddresses";
DROP POLICY IF EXISTS "Authenticated users can manage payment methods" ON "UserPaymentMethods";

-- The API routes will handle user filtering with .eq('userId', session.user.id)

SELECT 'RLS disabled - APIs will handle user filtering!' as result;
