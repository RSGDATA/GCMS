-- Debug script to check invitation system setup
-- Run this in your Supabase SQL Editor to verify everything is working

-- 1. Check if musician_invitations table exists and has data
SELECT 'musician_invitations table check' as test;
SELECT COUNT(*) as total_invitations FROM public.musician_invitations;

-- 2. Show all invitation codes
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

-- 3. Check if musician_auth_simple table has the new columns
SELECT 'musician_auth_simple table structure' as test;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'musician_auth_simple'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check RLS policies for musician_invitations
SELECT 'RLS policies check' as test;
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'musician_invitations'
ORDER BY policyname;

-- 5. Test permissions
SELECT 'Permissions check' as test;
SELECT has_table_privilege('anon', 'public.musician_invitations', 'SELECT') as anon_can_select;
SELECT has_table_privilege('authenticated', 'public.musician_invitations', 'SELECT') as auth_can_select;

-- 6. Create a test invitation code if none exist
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
SELECT 'GCMS-TESTCODE', '', 'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM public.musician_invitations 
    WHERE invitation_code = 'GCMS-TESTCODE'
);

-- 7. Final verification
SELECT 'Final check - use GCMS-TESTCODE to test' as message;
SELECT invitation_code, is_used, expires_at > NOW() as is_valid
FROM public.musician_invitations 
WHERE invitation_code = 'GCMS-TESTCODE';
