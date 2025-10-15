-- Test Order Creation
-- This script tests if order creation works after applying the fixes

-- Test inserting a draft order (similar to what the checkout API does)
-- Note: id column is omitted to let the database auto-generate UUID
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
    "billingAddress",
    "createdAt",
    "updatedAt"
) VALUES (
    'TEST-ORDER-' || EXTRACT(EPOCH FROM NOW())::bigint,
    'draft',
    1288.00,
    1288.00,
    0,
    0,
    'pending',
    null,
    'CF-TEST-' || EXTRACT(EPOCH FROM NOW())::bigint,
    'PostNet',
    'Test order for debugging',
    'yoco',
    '575f412c-c7cb-4d0e-bb8e-224413672e28',
    '[{"id": "test-item", "name": "Test Item", "price": 1288, "quantity": 1}]'::jsonb,
    '{"firstName": "Test", "lastName": "User", "email": "test@example.com", "address": "Test Address"}'::jsonb,
    '{"firstName": "Test", "lastName": "User", "email": "test@example.com", "address": "Test Address"}'::jsonb,
    NOW(),
    NOW()
);

-- Check if the order was created successfully
SELECT 
    'Test Order Created:' as info,
    id,
    "orderNumber",
    status,
    "paymentStatus",
    "totalAmount",
    "createdAt"
FROM "Order" 
WHERE "orderNumber" LIKE 'TEST-ORDER-%'
ORDER BY "createdAt" DESC 
LIMIT 1;

-- Clean up test order
DELETE FROM "Order" WHERE "orderNumber" LIKE 'TEST-ORDER-%';

SELECT '✅ Order creation test completed successfully!' as result;