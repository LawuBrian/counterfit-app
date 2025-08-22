-- Create visitors table for tracking website analytics
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sessionId TEXT UNIQUE NOT NULL,
  ipAddress TEXT,
  userAgent TEXT,
  referrer TEXT,
  pageUrl TEXT NOT NULL,
  pageTitle TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  deviceType TEXT,
  browser TEXT,
  os TEXT,
  screenResolution TEXT,
  language TEXT,
  isReturning BOOLEAN DEFAULT false,
  visitDuration INTEGER,
  pagesViewed INTEGER DEFAULT 1,
  lastActivity TIMESTAMPTZ DEFAULT NOW(),
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitors_sessionId ON visitors(sessionId);
CREATE INDEX IF NOT EXISTS idx_visitors_createdAt ON visitors(createdAt);
CREATE INDEX IF NOT EXISTS idx_visitors_lastActivity ON visitors(lastActivity);
CREATE INDEX IF NOT EXISTS idx_visitors_deviceType ON visitors(deviceType);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);

-- Create a function to update the updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updatedAt column
CREATE TRIGGER update_visitors_updated_at 
    BEFORE UPDATE ON visitors 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO visitors (
  sessionId,
  pageUrl,
  pageTitle,
  deviceType,
  browser,
  os,
  country,
  city,
  timezone,
  pagesViewed,
  visitDuration,
  isReturning
) VALUES 
  (
    'sample_session_1',
    '/',
    'Counterfit - Home',
    'desktop',
    'Chrome',
    'Windows',
    'South Africa',
    'Johannesburg',
    'Africa/Johannesburg',
    3,
    180,
    false
  ),
  (
    'sample_session_2',
    '/shop',
    'Counterfit - Shop',
    'mobile',
    'Safari',
    'iOS',
    'South Africa',
    'Cape Town',
    'Africa/Johannesburg',
    1,
    45,
    true
  )
ON CONFLICT (sessionId) DO NOTHING;

-- Enable Row Level Security (RLS) for security
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create policies for the visitors table
-- Allow public access for tracking (POST requests)
CREATE POLICY "Allow public tracking" ON visitors
  FOR INSERT WITH CHECK (true);

-- Allow public access for duration updates (PUT requests)
CREATE POLICY "Allow public duration updates" ON visitors
  FOR UPDATE USING (true);

-- Allow admin access for analytics (GET requests)
CREATE POLICY "Allow admin analytics" ON visitors
  FOR SELECT USING (true);

-- Grant necessary permissions
GRANT ALL ON visitors TO authenticated;
GRANT ALL ON visitors TO anon;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
