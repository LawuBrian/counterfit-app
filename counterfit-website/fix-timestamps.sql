-- Fix Timestamp Columns for Order Table
-- Ensure createdAt and updatedAt have proper defaults and constraints

-- 1. Check current timestamp column structure
SELECT 
    'Current timestamp columns:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' AND column_name IN ('createdAt', 'updatedAt')
ORDER BY column_name;

-- 2. Fix the updatedAt column to have proper default
ALTER TABLE "Order" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "Order" ALTER COLUMN "createdAt" SET DEFAULT NOW();

-- 3. Make sure both columns are NOT NULL
ALTER TABLE "Order" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "Order" ALTER COLUMN "createdAt" SET NOT NULL;

-- 4. Update any existing rows that might have null timestamps
UPDATE "Order" 
SET 
    "updatedAt" = COALESCE("updatedAt", NOW()),
    "createdAt" = COALESCE("createdAt", NOW())
WHERE "updatedAt" IS NULL OR "createdAt" IS NULL;

-- 5. Verify the fix
SELECT 
    'Fixed timestamp columns:' as info,
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Order' AND column_name IN ('createdAt', 'updatedAt')
ORDER BY column_name;

-- 6. Test with a simple insert (should auto-populate timestamps)
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
    'TEST-TIMESTAMP-' || EXTRACT(EPOCH FROM NOW())::bigint,
    '[{"id": "test", "name": "Test", "price": 100, "quantity": 1}]'::jsonb,
    100.00,
    'draft',
    'pending',
    '{"test": "address"}'::jsonb
);

-- 7. Check the test order has proper timestamps
SELECT 
    'Test order with timestamps:' as info,
    id,
    "orderNumber",
    "createdAt",
    "updatedAt",
    ("updatedAt" IS NOT NULL) as has_updated_at,
    ("createdAt" IS NOT NULL) as has_created_at
FROM "Order" 
WHERE "orderNumber" LIKE 'TEST-TIMESTAMP-%'
ORDER BY "createdAt" DESC 
LIMIT 1;

-- 8. Clean up test order
DELETE FROM "Order" WHERE "orderNumber" LIKE 'TEST-TIMESTAMP-%';

SELECT '✅ Timestamp columns fixed successfully!' as result;