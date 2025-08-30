-- SQL statements to create the four tables for GCMS Symphony Portal
-- Run these in your Supabase SQL editor

-- Create a custom schema for website data capture
CREATE SCHEMA IF NOT EXISTS gcms_website;

-- Grant usage on the schema to authenticated and anon users
GRANT USAGE ON SCHEMA gcms_website TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA gcms_website TO authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA gcms_website TO authenticated, anon;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA gcms_website GRANT ALL ON TABLES TO authenticated, anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA gcms_website GRANT ALL ON SEQUENCES TO authenticated, anon;

-- 1. Musicians table
CREATE TABLE gcms_website.musicians (
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
CREATE TABLE gcms_website.students (
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
CREATE TABLE gcms_website.concerts (
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
CREATE TABLE gcms_website.ticket_purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    concert_id UUID NOT NULL REFERENCES gcms_website.concerts(id) ON DELETE CASCADE,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_musicians_email ON gcms_website.musicians(email);
CREATE INDEX idx_students_parent_email ON gcms_website.students(parent_email);
CREATE INDEX idx_concerts_date ON gcms_website.concerts(date);
CREATE INDEX idx_ticket_purchases_concert_id ON gcms_website.ticket_purchases(concert_id);
CREATE INDEX idx_ticket_purchases_status ON gcms_website.ticket_purchases(status);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE gcms_website.musicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE gcms_website.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE gcms_website.concerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE gcms_website.ticket_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to concerts (for public viewing)
CREATE POLICY "Concerts are viewable by everyone" ON gcms_website.concerts
    FOR SELECT USING (true);

-- Create policies for musicians (they can view and update their own records)
CREATE POLICY "Musicians can view their own records" ON gcms_website.musicians
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Musicians can update their own records" ON gcms_website.musicians
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- Create policies for students (parents can view and update their own records)
CREATE POLICY "Parents can view their own student records" ON gcms_website.students
    FOR SELECT USING (auth.jwt() ->> 'email' = parent_email);

CREATE POLICY "Parents can update their own student records" ON gcms_website.students
    FOR UPDATE USING (auth.jwt() ->> 'email' = parent_email);

-- Create policies for ticket purchases (customers can view their own purchases)
CREATE POLICY "Customers can view their own ticket purchases" ON gcms_website.ticket_purchases
    FOR SELECT USING (auth.jwt() ->> 'email' = customer_email);

-- Allow public insert for new registrations and ticket purchases
CREATE POLICY "Allow public musician registration" ON gcms_website.musicians
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public student registration" ON gcms_website.students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public ticket purchases" ON gcms_website.ticket_purchases
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
CREATE TRIGGER update_musicians_updated_at BEFORE UPDATE ON gcms_website.musicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON gcms_website.students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_concerts_updated_at BEFORE UPDATE ON gcms_website.concerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
