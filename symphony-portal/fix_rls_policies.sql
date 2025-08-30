-- Fix Row Level Security policies for public access
-- Run this in your Supabase SQL editor

-- Drop existing restrictive policies and create more permissive ones for public registration

-- Students table - Allow anonymous registration
DROP POLICY IF EXISTS "Allow public student registration" ON public.students;
DROP POLICY IF EXISTS "Parents can view their own student records" ON public.students;
DROP POLICY IF EXISTS "Parents can update their own student records" ON public.students;

-- Create new permissive policies for students
CREATE POLICY "Allow anonymous student registration" ON public.students
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public to insert students" ON public.students
    FOR INSERT TO public WITH CHECK (true);

-- Musicians table - Allow anonymous registration  
DROP POLICY IF EXISTS "Allow public musician registration" ON public.musicians;
DROP POLICY IF EXISTS "Musicians can view their own records" ON public.musicians;
DROP POLICY IF EXISTS "Musicians can update their own records" ON public.musicians;

-- Create new permissive policies for musicians
CREATE POLICY "Allow anonymous musician registration" ON public.musicians
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public to insert musicians" ON public.musicians
    FOR INSERT TO public WITH CHECK (true);

-- Concerts - Keep public read access
DROP POLICY IF EXISTS "Concerts are viewable by everyone" ON public.concerts;
CREATE POLICY "Allow public to read concerts" ON public.concerts
    FOR SELECT TO anon, public USING (true);

-- Ticket purchases - Allow anonymous purchases
DROP POLICY IF EXISTS "Allow public ticket purchases" ON public.ticket_purchases;
DROP POLICY IF EXISTS "Customers can view their own ticket purchases" ON public.ticket_purchases;

CREATE POLICY "Allow anonymous ticket purchases" ON public.ticket_purchases
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public to insert ticket purchases" ON public.ticket_purchases
    FOR INSERT TO public WITH CHECK (true);
