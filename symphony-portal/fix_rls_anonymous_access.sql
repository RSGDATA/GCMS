-- Fix RLS policies to allow anonymous form submissions
-- Run this in your Supabase SQL editor

-- Drop the problematic policies and create simpler ones
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.students;
DROP POLICY IF EXISTS "Users can view own student records" ON public.students;
DROP POLICY IF EXISTS "Users can update own student records" ON public.students;

DROP POLICY IF EXISTS "Enable insert for everyone" ON public.musicians;
DROP POLICY IF EXISTS "Users can view own musician records" ON public.musicians;
DROP POLICY IF EXISTS "Users can update own musician records" ON public.musicians;

DROP POLICY IF EXISTS "Enable read access for everyone" ON public.concerts;
DROP POLICY IF EXISTS "Enable all access for service role only" ON public.concerts;

DROP POLICY IF EXISTS "Enable insert for everyone" ON public.ticket_purchases;
DROP POLICY IF EXISTS "Users can view own ticket purchases" ON public.ticket_purchases;
DROP POLICY IF EXISTS "Enable update for service role only" ON public.ticket_purchases;

-- STUDENTS TABLE - Allow anonymous registration and authenticated access
CREATE POLICY "Allow anonymous student registration" ON public.students
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view own students" ON public.students
    FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = parent_email);

CREATE POLICY "Allow service role full access to students" ON public.students
    FOR ALL TO service_role USING (true);

-- MUSICIANS TABLE - Allow anonymous registration and authenticated access
CREATE POLICY "Allow anonymous musician registration" ON public.musicians
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view own musician records" ON public.musicians
    FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Allow service role full access to musicians" ON public.musicians
    FOR ALL TO service_role USING (true);

-- CONCERTS TABLE - Public read access
CREATE POLICY "Allow public concert viewing" ON public.concerts
    FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow service role full access to concerts" ON public.concerts
    FOR ALL TO service_role USING (true);

-- TICKET PURCHASES TABLE - Allow anonymous purchases
CREATE POLICY "Allow anonymous ticket purchases" ON public.ticket_purchases
    FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view own purchases" ON public.ticket_purchases
    FOR SELECT TO authenticated USING (auth.jwt() ->> 'email' = customer_email);

CREATE POLICY "Allow service role full access to ticket purchases" ON public.ticket_purchases
    FOR ALL TO service_role USING (true);
