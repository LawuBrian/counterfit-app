-- =====================================================
-- Test User APIs - Simple Queries
-- =====================================================
-- Run these individually to test what's working

-- 1. Test if we can query User table with required columns
SELECT 
    id, 
    email, 
    COALESCE("firstName", 'NOT_SET') as firstName,
    COALESCE("lastName", 'NOT_SET') as lastName, 
    COALESCE(phone, 'NOT_SET') as phone,
    "createdAt"
FROM "User" 
LIMIT 3;

-- 2. Test UserSettings table (if it exists)
SELECT COUNT(*) as settings_count FROM "UserSettings";

-- 3. Test UserAddresses table (if it exists)  
SELECT COUNT(*) as addresses_count FROM "UserAddresses";

-- 4. Test UserPaymentMethods table (if it exists)
SELECT COUNT(*) as payment_methods_count FROM "UserPaymentMethods";

-- 5. Check if we can insert a test setting (replace USER_ID with actual user ID)
-- INSERT INTO "UserSettings" ("userId", "emailNotifications") 
-- VALUES ('your-user-id-here', true)
-- ON CONFLICT ("userId") DO NOTHING;
