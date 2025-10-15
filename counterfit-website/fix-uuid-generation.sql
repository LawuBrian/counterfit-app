-- Fix UUID Generation Issue for Order Table
-- The id column is not auto-generating UUIDs properly

-- 1. First, ensure the UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Check current table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' AND column_name = 'id';

-- 3. Fix the id column to properly auto-generate UUIDs
ALTER TABLE "Order" ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 4. Verify the fix
SELECT 
    'Updated Order table id column:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' AND column_name = 'id';

-- 5. Test UUID generation
SELECT 
    'Test UUID generation:' as info,
    uuid_generate_v4() as sample_uuid;

SELECT '✅ UUID generation fixed for Order table!' as result;