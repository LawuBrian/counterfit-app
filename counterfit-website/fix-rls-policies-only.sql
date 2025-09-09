-- =====================================================
-- Fix RLS Policies Only (if tables already exist)
-- =====================================================
-- Run this if tables exist but APIs are failing

-- Enable RLS on tables (in case it's disabled)
ALTER TABLE "UserSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserAddresses" ENABLE ROW LEVEL SECURITY; 
ALTER TABLE "UserPaymentMethods" ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to fix any issues
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

-- Create working RLS policies
CREATE POLICY "Users can view own settings" ON "UserSettings"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own settings" ON "UserSettings"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own settings" ON "UserSettings"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own settings" ON "UserSettings"
    FOR DELETE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can view own addresses" ON "UserAddresses"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own addresses" ON "UserAddresses"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own addresses" ON "UserAddresses"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own addresses" ON "UserAddresses"
    FOR DELETE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can view own payment methods" ON "UserPaymentMethods"
    FOR SELECT USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own payment methods" ON "UserPaymentMethods"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own payment methods" ON "UserPaymentMethods"
    FOR UPDATE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own payment methods" ON "UserPaymentMethods"
    FOR DELETE USING (auth.uid()::text = "userId");

-- Grant permissions
GRANT ALL ON "UserSettings" TO authenticated;
GRANT ALL ON "UserAddresses" TO authenticated;
GRANT ALL ON "UserPaymentMethods" TO authenticated;

SELECT 'RLS policies updated successfully!' as result;
