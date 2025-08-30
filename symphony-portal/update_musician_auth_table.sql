-- Update musician_auth_simple table to include first_name, last_name, and phone
-- Run this in your Supabase SQL Editor

-- Add new columns to the musician_auth_simple table
ALTER TABLE public.musician_auth_simple 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- View the updated table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'musician_auth_simple'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- View current data
SELECT id, username, email, first_name, last_name, phone, is_active, created_at
FROM public.musician_auth_simple
ORDER BY created_at DESC;
