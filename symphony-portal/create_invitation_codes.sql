-- Script to create invitation codes for specific email addresses
-- Run this in your Supabase SQL Editor

-- Function to generate a random invitation code
CREATE OR REPLACE FUNCTION generate_invitation_code() RETURNS TEXT AS $$
BEGIN
    RETURN 'GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$ LANGUAGE plpgsql;

-- Example: Create invitation codes for specific email addresses
-- Replace these email addresses with the actual emails you want to invite

INSERT INTO public.musician_invitations (invitation_code, email, invited_by) VALUES
(generate_invitation_code(), 'musician1@example.com', 'admin'),
(generate_invitation_code(), 'musician2@example.com', 'admin'),
(generate_invitation_code(), 'musician3@example.com', 'admin');

-- To create a single invitation for a specific email, use:
-- INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
-- VALUES (generate_invitation_code(), 'your-email@example.com', 'admin');

-- View all current invitations
SELECT 
    invitation_code, 
    email, 
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
