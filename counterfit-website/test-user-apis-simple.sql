-- =====================================================
-- Simple Test for User APIs
-- =====================================================

-- 1. Check if RLS is disabled (should show 'f' for false)
SELECT schemaname, tablename, rowsecurity as "RLS_enabled" 
FROM pg_tables 
WHERE tablename IN ('UserSettings', 'UserAddresses', 'UserPaymentMethods');

-- 2. Test inserting a simple record (replace with your actual user ID)
-- INSERT INTO "UserSettings" ("userId", "emailNotifications") 
-- VALUES ('6060b8f4-e90f-4e81-b7d5-fa2850c59ec5', true);

-- 3. Check if we can read the tables
SELECT COUNT(*) as settings_count FROM "UserSettings";
SELECT COUNT(*) as addresses_count FROM "UserAddresses";  
SELECT COUNT(*) as payment_methods_count FROM "UserPaymentMethods";

-- 4. Check table permissions
SELECT table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name IN ('UserSettings', 'UserAddresses', 'UserPaymentMethods')
AND grantee = 'authenticated';

