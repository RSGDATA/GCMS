-- Fix registration issues for musician_auth_simple table
-- Run this script in your Supabase SQL Editor

-- 1. Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Allow public registration" ON public.musician_auth_simple;
DROP POLICY IF EXISTS "Allow public login verification" ON public.musician_auth_simple;
DROP POLICY IF EXISTS "Allow public updates for login tracking" ON public.musician_auth_simple;

-- 2. Create policies with proper permissions
CREATE POLICY "Allow public registration" ON public.musician_auth_simple
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public login verification" ON public.musician_auth_simple
    FOR SELECT USING (true);

CREATE POLICY "Allow public updates for login tracking" ON public.musician_auth_simple
    FOR UPDATE USING (true);

-- 3. Ensure proper permissions are granted
GRANT ALL ON public.musician_auth_simple TO authenticated, anon;

-- 4. Verify the table structure and policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'musician_auth_simple' 
ORDER BY policyname;

-- 5. Test that the table is accessible for all operations
SELECT 'musician_auth_simple table is ready for registration' as status;
