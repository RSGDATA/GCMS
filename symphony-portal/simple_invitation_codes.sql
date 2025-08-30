-- Simple invitation code generation (no emails required)
-- Run this in your Supabase SQL Editor

-- Function to generate a random invitation code
CREATE OR REPLACE FUNCTION generate_invitation_code() RETURNS TEXT AS $$
BEGIN
    RETURN 'GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Generate some test invitation codes (no email required)
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) VALUES
(generate_invitation_code(), '', 'admin'),
(generate_invitation_code(), '', 'admin'),
(generate_invitation_code(), '', 'admin');

-- To generate a single invitation code, use:
-- INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
-- VALUES (generate_invitation_code(), '', 'admin');

-- View all invitation codes
SELECT 
    invitation_code, 
    is_used, 
    expires_at, 
    created_at,
    CASE 
        WHEN expires_at < NOW() THEN 'EXPIRED'
        WHEN is_used = true THEN 'USED'
        ELSE 'ACTIVE'
    END as status
FROM public.musician_invitations 
ORDER BY created_at DESC;
