-- Counterfit Waitlist Table Setup
-- Run this in your Supabase SQL editor

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a unique index on email for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create an index on created_at for sorting and analytics
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_waitlist_updated_at 
    BEFORE UPDATE ON waitlist 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert into the waitlist
CREATE POLICY "Allow public insert" ON waitlist
    FOR INSERT WITH CHECK (true);

-- Create a policy that allows reading only for authenticated users (optional, for admin access)
-- Uncomment the following lines if you want to restrict read access to authenticated users only
-- CREATE POLICY "Allow authenticated read" ON waitlist
--     FOR SELECT USING (auth.role() = 'authenticated');

-- For now, allow public read access (you can restrict this later)
CREATE POLICY "Allow public read" ON waitlist
    FOR SELECT USING (true);

-- Insert some sample data for testing (optional)
-- INSERT INTO waitlist (email, first_name, last_name, phone) VALUES
--     ('test@example.com', 'John', 'Doe', '+1234567890'),
--     ('jane@example.com', 'Jane', 'Smith', '+0987654321');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON waitlist TO anon, authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Verify the table was created
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist'
ORDER BY ordinal_position;
