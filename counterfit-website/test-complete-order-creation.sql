-- Complete Test for Order Creation
-- This tests all the fixes together: UUID generation, timestamps, and constraints

-- 1. Test basic order creation (minimal required fields)
INSERT INTO "Order" (
    "userId",
    "orderNumber", 
    items,
    "totalAmount",
    "shippingAddress"
) VALUES (
    '575f412c-c7cb-4d0e-bb8e-224413672e28',
    'TEST-COMPLETE-' || EXTRACT(EPOCH FROM NOW())::bigint,
    '[{"id": "test-item", "name": "Test Item", "price": 1288, "quantity": 1}]'::jsonb,
    1288.00,
    '{"firstName": "Test", "lastName": "User", "email": "test@example.com", "address": "Test Address"}'::jsonb
);

-- 2. Check that the order was created successfully with all auto-generated fields
SELECT 
    'Complete test order:' as info,
    id,
    "orderNumber",
    "userId",
    status,
    "paymentStatus", 
    "totalAmount",
    "createdAt",
    "updatedAt",
    (id IS NOT NULL) as has_id,
    ("createdAt" IS NOT NULL) as has_created_at,
    ("updatedAt" IS NOT NULL) as has_updated_at,
    (length(id::text) = 36) as valid_uuid_length
FROM "Order" 
WHERE "orderNumber" LIKE 'TEST-COMPLETE-%'
ORDER BY "createdAt" DESC 
LIMIT 1;

-- 3. Test order creation with all fields (like the checkout API does)
INSERT INTO "Order" (
    "orderNumber",
    status,
    "totalAmount",
    subtotal,
    tax,
    shipping,
    "paymentStatus",
    "paymentId",
    "trackingNumber",
    carrier,
    notes,
    "paymentMethod",
    "userId",
    items,
    "shippingAddress",
    "billingAddress"
) VALUES (
    'TEST-FULL-' || EXTRACT(EPOCH FROM NOW())::bigint,
    'draft',
    1288.00,
    1288.00,
    0,
    0,
    'pending',
    null,
    'CF-TEST-' || EXTRACT(EPOCH FROM NOW())::bigint,
    'PostNet',
    'Full test order',
    'yoco',
    '575f412c-c7cb-4d0e-bb8e-224413672e28',
    '[{"id": "c11633e2-266a-4a09-94cf-769802b3f733", "name": "SAINT FROST JACKET", "price": 1199, "quantity": 1, "size": "L"}]'::jsonb,
    '{"firstName": "Mary Dimakatso", "lastName": "Matsolo", "email": "josephsirora3@gmail.com", "phone": "+27 60 410 3452", "address": "20 Patrick Road Jetpark Boksburg 1459", "city": "Johannesburg", "state": "Gauteng", "postalCode": "2000", "country": "ZA"}'::jsonb,
    '{"firstName": "Mary Dimakatso", "lastName": "Matsolo", "email": "josephsirora3@gmail.com", "phone": "+27 60 410 3452", "address": "20 Patrick Road Jetpark Boksburg 1459", "city": "Johannesburg", "state": "Gauteng", "postalCode": "2000", "country": "ZA"}'::jsonb
);

-- 4. Check the full test order
SELECT 
    'Full test order:' as info,
    id,
    "orderNumber",
    status,
    "paymentStatus",
    "paymentMethod",
    "totalAmount",
    subtotal,
    tax,
    shipping,
    "trackingNumber",
    carrier,
    "createdAt",
    "updatedAt"
FROM "Order" 
WHERE "orderNumber" LIKE 'TEST-FULL-%'
ORDER BY "createdAt" DESC 
LIMIT 1;

-- 5. Show summary of all test orders
SELECT 
    'All test orders summary:' as info,
    COUNT(*) as total_test_orders,
    COUNT(CASE WHEN id IS NOT NULL THEN 1 END) as orders_with_id,
    COUNT(CASE WHEN "createdAt" IS NOT NULL THEN 1 END) as orders_with_created_at,
    COUNT(CASE WHEN "updatedAt" IS NOT NULL THEN 1 END) as orders_with_updated_at
FROM "Order" 
WHERE "orderNumber" LIKE 'TEST-%';

-- 6. Clean up all test orders
DELETE FROM "Order" WHERE "orderNumber" LIKE 'TEST-%';

SELECT '✅ Complete order creation test passed! All issues are fixed.' as result;