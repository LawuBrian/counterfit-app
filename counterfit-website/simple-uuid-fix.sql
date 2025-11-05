-- Simple UUID Fix for Order Table
-- This approach uses gen_random_uuid() which is more reliable

-- 1. Enable the pgcrypto extension (more reliable than uuid-ossp)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Update the Order table id column to use gen_random_uuid()
ALTER TABLE "Order" ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Test that it works
SELECT 
    'Order table id column after fix:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' AND column_name = 'id';

-- 4. Test UUID generation
SELECT 'Test UUID:' as info, gen_random_uuid() as sample_uuid;

SELECT '✅ Simple UUID fix applied!' as result;