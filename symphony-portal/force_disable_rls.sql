-- Force disable RLS and remove all policies
-- Run this in your Supabase SQL editor

-- First, drop ALL policies completely
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies on students table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'students' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.students';
    END LOOP;
    
    -- Drop all policies on musicians table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'musicians' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.musicians';
    END LOOP;
    
    -- Drop all policies on concerts table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'concerts' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.concerts';
    END LOOP;
    
    -- Drop all policies on ticket_purchases table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'ticket_purchases' AND schemaname = 'public') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON public.ticket_purchases';
    END LOOP;
END $$;

-- Now disable RLS
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.musicians DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.concerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_purchases DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('students', 'musicians', 'concerts', 'ticket_purchases');
