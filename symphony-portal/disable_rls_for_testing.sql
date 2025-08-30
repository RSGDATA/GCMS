-- Temporarily disable RLS for testing
-- Run this in your Supabase SQL editor to allow form submissions

-- Disable RLS on all tables for testing
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.musicians DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.concerts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_purchases DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean slate
DROP POLICY IF EXISTS "Allow public student registration" ON public.students;
DROP POLICY IF EXISTS "Parents can view their own student records" ON public.students;
DROP POLICY IF EXISTS "Parents can update their own student records" ON public.students;
DROP POLICY IF EXISTS "Allow anonymous student registration" ON public.students;
DROP POLICY IF EXISTS "Allow public to insert students" ON public.students;

DROP POLICY IF EXISTS "Allow public musician registration" ON public.musicians;
DROP POLICY IF EXISTS "Musicians can view their own records" ON public.musicians;
DROP POLICY IF EXISTS "Musicians can update their own records" ON public.musicians;
DROP POLICY IF EXISTS "Allow anonymous musician registration" ON public.musicians;
DROP POLICY IF EXISTS "Allow public to insert musicians" ON public.musicians;

DROP POLICY IF EXISTS "Concerts are viewable by everyone" ON public.concerts;
DROP POLICY IF EXISTS "Allow public to read concerts" ON public.concerts;

DROP POLICY IF EXISTS "Allow public ticket purchases" ON public.ticket_purchases;
DROP POLICY IF EXISTS "Customers can view their own ticket purchases" ON public.ticket_purchases;
DROP POLICY IF EXISTS "Allow anonymous ticket purchases" ON public.ticket_purchases;
DROP POLICY IF EXISTS "Allow public to insert ticket purchases" ON public.ticket_purchases;

-- Note: With RLS disabled, anyone can read/write to these tables
-- This is for testing only - you should re-enable RLS with proper policies later
