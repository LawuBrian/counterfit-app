-- =====================================================
-- Check Current Schema Status
-- =====================================================
-- Run this to see what exists and what might be missing

-- Check if User table columns exist
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'User' 
    AND column_name IN ('firstName', 'lastName', 'phone')
ORDER BY column_name;

-- Check if UserSettings table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'UserSettings'
) as "UserSettings_exists";

-- Check if UserAddresses table exists  
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'UserAddresses'
) as "UserAddresses_exists";

-- Check if UserPaymentMethods table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'UserPaymentMethods'
) as "UserPaymentMethods_exists";

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS_enabled"
FROM pg_tables 
WHERE tablename IN ('UserSettings', 'UserAddresses', 'UserPaymentMethods');

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as "command_type"
FROM pg_policies 
WHERE tablename IN ('UserSettings', 'UserAddresses', 'UserPaymentMethods')
ORDER BY tablename, policyname;
