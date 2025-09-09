-- =====================================================
-- Debug User ID Mismatch
-- =====================================================

-- Check what user IDs look like in your User table
SELECT 
    id as user_table_id,
    email,
    LENGTH(id) as id_length,
    CASE 
        WHEN id ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN 'UUID format'
        WHEN id ~ '^[a-zA-Z0-9_-]+$' THEN 'Custom string'
        ELSE 'Other format'
    END as id_format
FROM "User" 
LIMIT 5;

-- Check what auth.uid() returns (this is what RLS policies use)
SELECT 
    auth.uid() as auth_user_id,
    LENGTH(auth.uid()::text) as auth_id_length,
    CASE 
        WHEN auth.uid()::text ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN 'UUID format'
        WHEN auth.uid()::text ~ '^[a-zA-Z0-9_-]+$' THEN 'Custom string'
        ELSE 'Other format'
    END as auth_id_format;
