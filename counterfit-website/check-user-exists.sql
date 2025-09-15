-- =====================================================
-- Check if User Exists in Supabase
-- =====================================================

-- Check if the user ID from the logs exists in Supabase User table
SELECT 
    id, 
    email, 
    "firstName", 
    "lastName", 
    "createdAt"
FROM "User" 
WHERE id = '6060b8f4-e90f-4e81-b7d5-fa2850c59ec5';

-- Check all users in Supabase User table
SELECT 
    id, 
    email, 
    "firstName", 
    "lastName"
FROM "User" 
LIMIT 5;

-- Count total users
SELECT COUNT(*) as total_users FROM "User";

