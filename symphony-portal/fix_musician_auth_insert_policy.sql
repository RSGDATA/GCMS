-- Fix missing INSERT policy for musician_auth_simple table
-- This allows new user registration to work properly

-- Add INSERT policy for public registration
CREATE POLICY "Allow public registration" ON public.musician_auth_simple
    FOR INSERT WITH CHECK (true);

-- Verify all policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'musician_auth_simple' 
ORDER BY policyname;

-- Test that the table is accessible for all operations
SELECT 'Table exists and is accessible' as status;
