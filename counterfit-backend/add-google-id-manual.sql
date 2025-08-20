-- Manual SQL script to add Google OAuth support to User table
-- Run this in your Supabase SQL editor

-- Add googleId column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "googleId" VARCHAR(255) UNIQUE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_user_google_id ON "User"("googleId");

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'googleId';

-- Show the updated table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'User'
ORDER BY ordinal_position;
