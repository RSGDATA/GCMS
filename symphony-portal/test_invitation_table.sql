-- Test script to verify invitation system setup
-- Run this in your Supabase SQL Editor to check if everything is working

-- 1. Check if the table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'musician_invitations'
) as table_exists;

-- 2. If table exists, show its structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'musician_invitations'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check existing invitation codes
SELECT invitation_code, email, is_used, expires_at, created_at 
FROM public.musician_invitations 
ORDER BY created_at DESC;

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'musician_invitations'
ORDER BY policyname;

-- 5. Test permissions
SELECT has_table_privilege('anon', 'public.musician_invitations', 'SELECT') as anon_can_select;
SELECT has_table_privilege('authenticated', 'public.musician_invitations', 'SELECT') as auth_can_select;
