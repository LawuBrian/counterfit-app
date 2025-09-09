-- Fix User Schema and Add Missing Tables
-- Run this in your Supabase SQL editor

-- First, add missing columns to the User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "firstName" TEXT,
ADD COLUMN IF NOT EXISTS "lastName" TEXT,
ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- Create UserSettings table
CREATE TABLE IF NOT EXISTS "UserSettings" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "emailNotifications" BOOLEAN DEFAULT true,
    "smsNotifications" BOOLEAN DEFAULT false,
    "marketingEmails" BOOLEAN DEFAULT true,
    "orderUpdates" BOOLEAN DEFAULT true,
    "newsletter" BOOLEAN DEFAULT false,
    "twoFactorEnabled" BOOLEAN DEFAULT false,
    "preferredLanguage" TEXT DEFAULT 'en',
    "timezone" TEXT DEFAULT 'Africa/Johannesburg',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create UserAddresses table
CREATE TABLE IF NOT EXISTS "UserAddresses" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "type" TEXT NOT NULL CHECK ("type" IN ('shipping', 'billing')),
    "isDefault" BOOLEAN DEFAULT false,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "company" TEXT,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT DEFAULT 'South Africa',
    "phone" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create UserPaymentMethods table
CREATE TABLE IF NOT EXISTS "UserPaymentMethods" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    "type" TEXT NOT NULL CHECK ("type" IN ('card', 'bank_transfer', 'ewallet')),
    "isDefault" BOOLEAN DEFAULT false,
    "nickname" TEXT,
    -- Card details (encrypted/tokenized)
    "cardLast4" TEXT,
    "cardBrand" TEXT,
    "cardExpMonth" INTEGER,
    "cardExpYear" INTEGER,
    "cardHolderName" TEXT,
    -- Bank details
    "bankName" TEXT,
    "accountNumber" TEXT,
    "branchCode" TEXT,
    -- E-wallet details
    "ewalletProvider" TEXT,
    "ewalletNumber" TEXT,
    -- Payment provider tokens
    "providerToken" TEXT,
    "providerId" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON "UserSettings"("userId");
CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON "UserAddresses"("userId");
CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON "UserAddresses"("userId", "isDefault");
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_user_id ON "UserPaymentMethods"("userId");
CREATE INDEX IF NOT EXISTS idx_user_payment_methods_default ON "UserPaymentMethods"("userId", "isDefault");

-- Create unique constraints
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_settings_unique_user ON "UserSettings"("userId");

-- Create triggers to automatically update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all new tables (drop if exists first)
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON "UserSettings";
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON "UserSettings" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON "UserAddresses";
CREATE TRIGGER update_user_addresses_updated_at 
    BEFORE UPDATE ON "UserAddresses" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_payment_methods_updated_at ON "UserPaymentMethods";
CREATE TRIGGER update_user_payment_methods_updated_at 
    BEFORE UPDATE ON "UserPaymentMethods" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAddresses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserPaymentMethods" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for UserSettings (drop if exists first)
DROP POLICY IF EXISTS "Users can view own settings" ON "UserSettings";
CREATE POLICY "Users can view own settings" ON "UserSettings"
    FOR SELECT USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can update own settings" ON "UserSettings";
CREATE POLICY "Users can update own settings" ON "UserSettings"
    FOR UPDATE USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can insert own settings" ON "UserSettings";
CREATE POLICY "Users can insert own settings" ON "UserSettings"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

-- Create RLS policies for UserAddresses (drop if exists first)
DROP POLICY IF EXISTS "Users can view own addresses" ON "UserAddresses";
CREATE POLICY "Users can view own addresses" ON "UserAddresses"
    FOR SELECT USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can insert own addresses" ON "UserAddresses";
CREATE POLICY "Users can insert own addresses" ON "UserAddresses"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can update own addresses" ON "UserAddresses";
CREATE POLICY "Users can update own addresses" ON "UserAddresses"
    FOR UPDATE USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can delete own addresses" ON "UserAddresses";
CREATE POLICY "Users can delete own addresses" ON "UserAddresses"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Create RLS policies for UserPaymentMethods (drop if exists first)
DROP POLICY IF EXISTS "Users can view own payment methods" ON "UserPaymentMethods";
CREATE POLICY "Users can view own payment methods" ON "UserPaymentMethods"
    FOR SELECT USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can insert own payment methods" ON "UserPaymentMethods";
CREATE POLICY "Users can insert own payment methods" ON "UserPaymentMethods"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can update own payment methods" ON "UserPaymentMethods";
CREATE POLICY "Users can update own payment methods" ON "UserPaymentMethods"
    FOR UPDATE USING (auth.uid()::text = "userId");

DROP POLICY IF EXISTS "Users can delete own payment methods" ON "UserPaymentMethods";
CREATE POLICY "Users can delete own payment methods" ON "UserPaymentMethods"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Grant necessary permissions
GRANT ALL ON "UserSettings" TO authenticated;
GRANT ALL ON "UserAddresses" TO authenticated;
GRANT ALL ON "UserPaymentMethods" TO authenticated;

-- Verify the tables were created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('UserSettings', 'UserAddresses', 'UserPaymentMethods')
ORDER BY table_name, ordinal_position;
