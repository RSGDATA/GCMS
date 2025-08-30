-- Create musician authentication table for secure login (PUBLIC SCHEMA VERSION)
-- This version creates tables in the public schema for Supabase free tier

-- Create the simple authentication table (for development/testing)
CREATE TABLE IF NOT EXISTS public.musician_auth_simple (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_musician_auth_simple_username ON public.musician_auth_simple(username);
CREATE INDEX IF NOT EXISTS idx_musician_auth_simple_email ON public.musician_auth_simple(email);
CREATE INDEX IF NOT EXISTS idx_musician_auth_simple_active ON public.musician_auth_simple(is_active);

-- Enable Row Level Security
ALTER TABLE public.musician_auth_simple ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (needed for login)
CREATE POLICY "Allow public login verification" ON public.musician_auth_simple
    FOR SELECT USING (true);

CREATE POLICY "Allow public updates for login tracking" ON public.musician_auth_simple
    FOR UPDATE USING (true);

-- Grant permissions to authenticated and anonymous users
GRANT ALL ON public.musician_auth_simple TO authenticated, anon;

-- Create trigger function for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_musician_auth_simple_updated_at ON public.musician_auth_simple;
CREATE TRIGGER update_musician_auth_simple_updated_at 
    BEFORE UPDATE ON public.musician_auth_simple
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert test accounts with simple passwords (for development/testing)
-- First, delete any existing test data to avoid conflicts
DELETE FROM public.musician_auth_simple WHERE username IN ('conductor', 'concertmaster', 'musician1', 'admin');

-- Insert fresh test data
INSERT INTO public.musician_auth_simple (username, email, password, is_active) VALUES
('conductor', 'conductor@gcms.org', 'conductor123', true),
('concertmaster', 'concertmaster@gcms.org', 'concert456', true),
('musician1', 'musician1@gcms.org', 'music789', true),
('admin', 'admin@gcms.org', 'admin123', true);

-- Verify the data was inserted
SELECT username, email, is_active, created_at FROM public.musician_auth_simple ORDER BY username;
