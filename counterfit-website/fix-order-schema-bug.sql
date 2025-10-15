-- Fix Order Table Schema Bug
-- The paymentStatus CHECK constraint is incorrectly referencing 'status' instead of 'paymentStatus'

-- First check current constraints
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname = 'Order' AND contype = 'c';

-- Drop the incorrect constraint if it exists
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_paymentStatus_check";

-- Add the correct constraint for paymentStatus
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentStatus_check" 
    CHECK ("paymentStatus" IN ('pending', 'paid', 'failed', 'refunded'));

-- Also ensure the status constraint is correct
ALTER TABLE "Order" DROP CONSTRAINT IF EXISTS "Order_status_check";
ALTER TABLE "Order" ADD CONSTRAINT "Order_status_check" 
    CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'draft'));

-- Verify constraints are correct
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname = 'Order' AND contype = 'c';

SELECT 'Order table constraints fixed successfully!' as result;