-- Add new JSON columns to User table for addresses, payment methods, and settings
-- Run this in your Supabase SQL Editor

-- Add addresses column (JSON array)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb;

-- Add paymentMethods column (JSON array) - note the quotes for camelCase
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "paymentMethods" JSONB DEFAULT '[]'::jsonb;

-- Add settings column (JSON object)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{}'::jsonb;

-- Update existing users to have default values
UPDATE "User" 
SET 
  addresses = '[]'::jsonb,
  "paymentMethods" = '[]'::jsonb,
  settings = '{}'::jsonb,
  "updatedAt" = NOW()
WHERE addresses IS NULL OR "paymentMethods" IS NULL OR settings IS NULL;

-- Verify the changes
SELECT 
  id, 
  email,
  addresses IS NOT NULL as has_addresses,
  "paymentMethods" IS NOT NULL as has_payment_methods,
  settings IS NOT NULL as has_settings
FROM "User" 
LIMIT 5;
