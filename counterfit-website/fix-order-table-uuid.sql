-- Comprehensive Fix for Order Table UUID Generation
-- This script ensures UUID generation works properly

-- 1. Enable UUID extension (multiple ways to ensure it works)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Check if uuid_generate_v4() function exists and works
SELECT 'Testing UUID functions:' as info;
SELECT uuid_generate_v4() as test_uuid_ossp;
SELECT gen_random_uuid() as test_gen_random;

-- 3. Check current Order table structure
SELECT 
    'Current Order table id column:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' AND column_name = 'id';

-- 4. Drop and recreate the default constraint for id column
ALTER TABLE "Order" ALTER COLUMN id DROP DEFAULT;

-- Try uuid_generate_v4() first, fallback to gen_random_uuid()
DO $$
BEGIN
    -- Try to set uuid_generate_v4() as default
    BEGIN
        ALTER TABLE "Order" ALTER COLUMN id SET DEFAULT uuid_generate_v4();
        RAISE NOTICE 'Using uuid_generate_v4() for Order.id default';
    EXCEPTION WHEN OTHERS THEN
        -- Fallback to gen_random_uuid()
        ALTER TABLE "Order" ALTER COLUMN id SET DEFAULT gen_random_uuid();
        RAISE NOTICE 'Using gen_random_uuid() for Order.id default';
    END;
END $$;

-- 5. Verify the new default
SELECT 
    'Updated Order table id column:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' AND column_name = 'id';

-- 6. Test the fix with a simple insert
INSERT INTO "Order" (
    "userId",
    "orderNumber",
    items,
    "totalAmount",
    status,
    "paymentStatus",
    "shippingAddress"
) VALUES (
    '575f412c-c7cb-4d0e-bb8e-224413672e28',
    'TEST-UUID-' || EXTRACT(EPOCH FROM NOW())::bigint,
    '[{"id": "test", "name": "Test", "price": 100, "quantity": 1}]'::jsonb,
    100.00,
    'draft',
    'pending',
    '{"test": "address"}'::jsonb
);

-- 7. Check if the test order was created with a proper UUID
SELECT 
    'Test order created:' as info,
    id,
    "orderNumber",
    length(id::text) as id_length,
    "createdAt"
FROM "Order" 
WHERE "orderNumber" LIKE 'TEST-UUID-%'
ORDER BY "createdAt" DESC 
LIMIT 1;

-- 8. Clean up test order
DELETE FROM "Order" WHERE "orderNumber" LIKE 'TEST-UUID-%';

SELECT '✅ Order table UUID generation has been fixed!' as result;