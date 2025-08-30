-- Create invitation system for contractor registration
-- This allows admins to send invitation codes that contractors can use to register

-- Create invitation codes table
CREATE TABLE IF NOT EXISTS public.musician_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invitation_code VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    invited_by VARCHAR(255) DEFAULT 'admin',
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'), -- expires in 30 days
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_musician_invitations_code ON public.musician_invitations(invitation_code);
CREATE INDEX IF NOT EXISTS idx_musician_invitations_email ON public.musician_invitations(email);
CREATE INDEX IF NOT EXISTS idx_musician_invitations_used ON public.musician_invitations(is_used);

-- Enable RLS
ALTER TABLE public.musician_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (needed for registration)
CREATE POLICY "Allow public invitation verification" ON public.musician_invitations
    FOR SELECT USING (true);

CREATE POLICY "Allow public invitation updates" ON public.musician_invitations
    FOR UPDATE USING (true);

CREATE POLICY "Allow public invitation inserts" ON public.musician_invitations
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.musician_invitations TO authenticated, anon;

-- Function to generate random invitation codes
CREATE OR REPLACE FUNCTION generate_invitation_code() RETURNS TEXT AS $$
BEGIN
    RETURN 'GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Insert some sample invitation codes for testing
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) VALUES
('GCMS-TEST001', 'contractor1@example.com', 'admin'),
('GCMS-TEST002', 'contractor2@example.com', 'admin'),
('GCMS-DEMO123', 'demo@example.com', 'admin');

-- View current invitations
SELECT invitation_code, email, is_used, expires_at, created_at 
FROM public.musician_invitations 
ORDER BY created_at DESC;
