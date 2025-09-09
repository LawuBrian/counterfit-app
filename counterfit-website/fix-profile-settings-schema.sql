-- =====================================================
-- Fix Profile, Settings, Addresses & Payment Methods
-- =====================================================
-- This script ensures all user-related tables exist with proper RLS policies
-- Run this in Supabase SQL Editor

-- Ensure User table has required columns
DO $$ 
BEGIN 
    -- Add firstName column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='firstName') THEN
        ALTER TABLE "User" ADD COLUMN "firstName" TEXT;
    END IF;
    
    -- Add lastName column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='lastName') THEN
        ALTER TABLE "User" ADD COLUMN "lastName" TEXT;
    END IF;
    
    -- Add phone column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='phone') THEN
        ALTER TABLE "User" ADD COLUMN "phone" TEXT;
    END IF;
END $$;

-- Create UserSettings table if not exists
CREATE TABLE IF NOT EXISTS "UserSettings" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "emailNotifications" BOOLEAN DEFAULT true,
    "smsNotifications" BOOLEAN DEFAULT false,
    "marketingEmails" BOOLEAN DEFAULT true,
    "orderUpdates" BOOLEAN DEFAULT true,
    "newsletter" BOOLEAN DEFAULT false,
    "twoFactorAuth" BOOLEAN DEFAULT false,
    "privacyLevel" TEXT DEFAULT 'public',
    "language" TEXT DEFAULT 'en',
    "currency" TEXT DEFAULT 'ZAR',
    "timezone" TEXT DEFAULT 'Africa/Johannesburg',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create UserAddresses table if not exists
CREATE TABLE IF NOT EXISTS "UserAddresses" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('shipping', 'billing')),
    "isDefault" BOOLEAN DEFAULT false,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    company TEXT,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    province TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    country TEXT DEFAULT 'South Africa',
    phone TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create UserPaymentMethods table if not exists
CREATE TABLE IF NOT EXISTS "UserPaymentMethods" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('card', 'bank', 'ewallet')),
    "isDefault" BOOLEAN DEFAULT false,
    nickname TEXT,
    "cardLast4" TEXT,
    "cardBrand" TEXT,
    "cardExpMonth" INTEGER,
    "cardExpYear" INTEGER,
    "cardHolderName" TEXT,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "branchCode" TEXT,
    "ewalletProvider" TEXT,
    "ewalletNumber" TEXT,
    "providerToken" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAddresses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserPaymentMethods" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own settings" ON "UserSettings";
DROP POLICY IF EXISTS "Users can insert own settings" ON "UserSettings";
DROP POLICY IF EXISTS "Users can update own settings" ON "UserSettings";
DROP POLICY IF EXISTS "Users can delete own settings" ON "UserSettings";

DROP POLICY IF EXISTS "Users can view own addresses" ON "UserAddresses";
DROP POLICY IF EXISTS "Users can insert own addresses" ON "UserAddresses";
DROP POLICY IF EXISTS "Users can update own addresses" ON "UserAddresses";
DROP POLICY IF EXISTS "Users can delete own addresses" ON "UserAddresses";

DROP POLICY IF EXISTS "Users can view own payment methods" ON "UserPaymentMethods";
DROP POLICY IF EXISTS "Users can insert own payment methods" ON "UserPaymentMethods";
DROP POLICY IF EXISTS "Users can update own payment methods" ON "UserPaymentMethods";
DROP POLICY IF EXISTS "Users can delete own payment methods" ON "UserPaymentMethods";

-- Create RLS policies for UserSettings
CREATE POLICY "Users can view own settings" ON "UserSettings"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own settings" ON "UserSettings"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own settings" ON "UserSettings"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own settings" ON "UserSettings"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Create RLS policies for UserAddresses
CREATE POLICY "Users can view own addresses" ON "UserAddresses"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own addresses" ON "UserAddresses"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own addresses" ON "UserAddresses"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own addresses" ON "UserAddresses"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Create RLS policies for UserPaymentMethods
CREATE POLICY "Users can view own payment methods" ON "UserPaymentMethods"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own payment methods" ON "UserPaymentMethods"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own payment methods" ON "UserPaymentMethods"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own payment methods" ON "UserPaymentMethods"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "UserSettings_userId_idx" ON "UserSettings"("userId");
CREATE INDEX IF NOT EXISTS "UserAddresses_userId_idx" ON "UserAddresses"("userId");
CREATE INDEX IF NOT EXISTS "UserPaymentMethods_userId_idx" ON "UserPaymentMethods"("userId");

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON "UserSettings";
DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON "UserAddresses";
DROP TRIGGER IF EXISTS update_user_payment_methods_updated_at ON "UserPaymentMethods";

-- Create or replace the trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updatedAt
CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON "UserSettings"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_addresses_updated_at
    BEFORE UPDATE ON "UserAddresses"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_payment_methods_updated_at
    BEFORE UPDATE ON "UserPaymentMethods"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON "UserSettings" TO authenticated;
GRANT ALL ON "UserAddresses" TO authenticated;
GRANT ALL ON "UserPaymentMethods" TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Profile, Settings, Addresses & Payment Methods schema updated successfully!';
    RAISE NOTICE '📋 Tables created: UserSettings, UserAddresses, UserPaymentMethods';
    RAISE NOTICE '🔒 RLS policies enabled for all tables';
    RAISE NOTICE '⚡ Triggers created for automatic timestamp updates';
    RAISE NOTICE '📊 Indexes created for better performance';
END $$;
