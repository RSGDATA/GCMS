-- SQL statements to create the four tables for GCMS Symphony Portal
-- Updated for Supabase free tier (uses public schema)
-- Run these in your Supabase SQL editor

-- 1. Musicians table
CREATE TABLE public.musicians (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    instrument VARCHAR(100) NOT NULL,
    experience_level VARCHAR(20) NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Students table
CREATE TABLE public.students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_email VARCHAR(255) NOT NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(20) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    student_age INTEGER NOT NULL CHECK (student_age > 0 AND student_age < 100),
    student_grade VARCHAR(20) NOT NULL,
    emergency_contact VARCHAR(255) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    medical_conditions TEXT,
    program_interest VARCHAR(50) NOT NULL CHECK (program_interest IN ('orchestra', 'choir', 'band', 'music_theory', 'individual_lessons')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Concerts table
CREATE TABLE public.concerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    ticket_price DECIMAL(10,2) NOT NULL CHECK (ticket_price >= 0),
    available_seats INTEGER NOT NULL CHECK (available_seats >= 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Ticket Purchases table
CREATE TABLE public.ticket_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    concert_id UUID NOT NULL REFERENCES public.concerts(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_musicians_email ON public.musicians(email);
CREATE INDEX idx_students_parent_email ON public.students(parent_email);
CREATE INDEX idx_concerts_date ON public.concerts(date);
CREATE INDEX idx_ticket_purchases_concert_id ON public.ticket_purchases(concert_id);
CREATE INDEX idx_ticket_purchases_status ON public.ticket_purchases(status);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.musicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to concerts (for public viewing)
CREATE POLICY "Concerts are viewable by everyone" ON public.concerts
    FOR SELECT USING (true);

-- Create policies for musicians (they can view and update their own records)
CREATE POLICY "Musicians can view their own records" ON public.musicians
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Musicians can update their own records" ON public.musicians
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- Create policies for students (parents can view and update their own records)
CREATE POLICY "Parents can view their own student records" ON public.students
    FOR SELECT USING (auth.jwt() ->> 'email' = parent_email);

CREATE POLICY "Parents can update their own student records" ON public.students
    FOR UPDATE USING (auth.jwt() ->> 'email' = parent_email);

-- Create policies for ticket purchases (customers can view their own purchases)
CREATE POLICY "Customers can view their own ticket purchases" ON public.ticket_purchases
    FOR SELECT USING (auth.jwt() ->> 'email' = customer_email);

-- Allow public insert for new registrations and ticket purchases
CREATE POLICY "Allow public musician registration" ON public.musicians
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public student registration" ON public.students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public ticket purchases" ON public.ticket_purchases
    FOR INSERT WITH CHECK (true);

-- Create trigger functions to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_musicians_updated_at BEFORE UPDATE ON public.musicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_concerts_updated_at BEFORE UPDATE ON public.concerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
