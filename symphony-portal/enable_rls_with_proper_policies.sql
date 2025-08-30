-- Enable Row Level Security with proper policies that don't break forms
-- Run this in your Supabase SQL editor

-- First, enable RLS on all tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.musicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_purchases ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
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

-- STUDENTS TABLE POLICIES
-- Allow anyone to register (insert) new students
CREATE POLICY "Enable insert for everyone" ON public.students
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own student records (based on parent email)
CREATE POLICY "Users can view own student records" ON public.students
    FOR SELECT USING (
        auth.jwt() ->> 'email' = parent_email OR 
        auth.role() = 'service_role'
    );

-- Allow users to update their own student records
CREATE POLICY "Users can update own student records" ON public.students
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = parent_email OR 
        auth.role() = 'service_role'
    );

-- MUSICIANS TABLE POLICIES
-- Allow anyone to register (insert) new musicians
CREATE POLICY "Enable insert for everyone" ON public.musicians
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own musician records
CREATE POLICY "Users can view own musician records" ON public.musicians
    FOR SELECT USING (
        auth.jwt() ->> 'email' = email OR 
        auth.role() = 'service_role'
    );

-- Allow users to update their own musician records
CREATE POLICY "Users can update own musician records" ON public.musicians
    FOR UPDATE USING (
        auth.jwt() ->> 'email' = email OR 
        auth.role() = 'service_role'
    );

-- CONCERTS TABLE POLICIES
-- Allow everyone to view concerts (public information)
CREATE POLICY "Enable read access for everyone" ON public.concerts
    FOR SELECT USING (true);

-- Only service role can insert/update/delete concerts
CREATE POLICY "Enable all access for service role only" ON public.concerts
    FOR ALL USING (auth.role() = 'service_role');

-- TICKET PURCHASES TABLE POLICIES
-- Allow anyone to purchase tickets (insert)
CREATE POLICY "Enable insert for everyone" ON public.ticket_purchases
    FOR INSERT WITH CHECK (true);

-- Allow users to view their own ticket purchases
CREATE POLICY "Users can view own ticket purchases" ON public.ticket_purchases
    FOR SELECT USING (
        auth.jwt() ->> 'email' = customer_email OR 
        auth.role() = 'service_role'
    );

-- Only service role can update ticket purchases (for payment processing)
CREATE POLICY "Enable update for service role only" ON public.ticket_purchases
    FOR UPDATE USING (auth.role() = 'service_role');
