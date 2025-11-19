-- Add twoForOne column to Product table
-- This migration adds support for "2 for the price of 1" products

-- Add the column with a default value of false
ALTER TABLE "Product" 
ADD COLUMN IF NOT EXISTS "twoForOne" BOOLEAN DEFAULT false;

-- Update existing products to have twoForOne = false (if any exist)
UPDATE "Product" 
SET "twoForOne" = false 
WHERE "twoForOne" IS NULL;

-- Make sure the column is NOT NULL (after setting defaults)
ALTER TABLE "Product" 
ALTER COLUMN "twoForOne" SET NOT NULL;

-- Add a comment to document the column
COMMENT ON COLUMN "Product"."twoForOne" IS 'Indicates if product is part of "2 for the price of 1" promotion';

