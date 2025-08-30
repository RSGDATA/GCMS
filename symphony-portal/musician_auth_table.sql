-- Create musician authentication table for secure login
-- This table will store usernames and hashed passwords for musicians

CREATE TABLE IF NOT EXISTS gcms_website.musician_auth (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    musician_id UUID REFERENCES gcms_website.musicians(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_musician_auth_username ON gcms_website.musician_auth(username);
CREATE INDEX IF NOT EXISTS idx_musician_auth_email ON gcms_website.musician_auth(email);
CREATE INDEX IF NOT EXISTS idx_musician_auth_active ON gcms_website.musician_auth(is_active);

-- Enable Row Level Security
ALTER TABLE gcms_website.musician_auth ENABLE ROW LEVEL SECURITY;

-- Create policies for musician authentication
CREATE POLICY "Musicians can view their own auth records" ON gcms_website.musician_auth
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Allow public login verification" ON gcms_website.musician_auth
    FOR SELECT USING (true);

-- Grant permissions
GRANT ALL ON gcms_website.musician_auth TO authenticated, anon;

-- Create trigger for updated_at
CREATE TRIGGER update_musician_auth_updated_at BEFORE UPDATE ON gcms_website.musician_auth
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample musician accounts (you should change these passwords!)
-- Note: In production, passwords should be properly hashed
INSERT INTO gcms_website.musician_auth (username, email, password_hash, is_active) VALUES
('conductor', 'conductor@gcms.org', '$2b$10$rQZ8kHWKtGKVOmBGZF.HLOyxJxGxGxGxGxGxGxGxGxGxGxGxGxGxG', true),
('concertmaster', 'concertmaster@gcms.org', '$2b$10$rQZ8kHWKtGKVOmBGZF.HLOyxJxGxGxGxGxGxGxGxGxGxGxGxGxGxG', true),
('musician1', 'musician1@gcms.org', '$2b$10$rQZ8kHWKtGKVOmBGZF.HLOyxJxGxGxGxGxGxGxGxGxGxGxGxGxGxG', true);

-- For testing purposes, let's also create a simple version with plain text passwords
-- WARNING: This is for development only - never use plain text passwords in production!
CREATE TABLE IF NOT EXISTS gcms_website.musician_auth_simple (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    musician_id UUID REFERENCES gcms_website.musicians(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and grant permissions for simple table
ALTER TABLE gcms_website.musician_auth_simple ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public login verification simple" ON gcms_website.musician_auth_simple
    FOR SELECT USING (true);
GRANT ALL ON gcms_website.musician_auth_simple TO authenticated, anon;

-- Insert test accounts with simple passwords (for development/testing)
INSERT INTO gcms_website.musician_auth_simple (username, email, password, is_active) VALUES
('conductor', 'conductor@gcms.org', 'conductor123', true),
('concertmaster', 'concertmaster@gcms.org', 'concert456', true),
('musician1', 'musician1@gcms.org', 'music789', true),
('admin', 'admin@gcms.org', 'admin123', true);
