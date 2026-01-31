-- ============================================================
-- CLEAN SLATE SCRIPT 1: DROP ALL TABLES
-- ============================================================
-- 
-- PURPOSE: Remove all GCMS project tables to start fresh
-- 
-- USAGE:
-- 1. Open Supabase SQL Editor
-- 2. Copy and paste this entire script
-- 3. Click "Run" or press Cmd+Enter
--
-- SAFETY: Uses CASCADE to handle dependencies automatically
-- Can be run multiple times safely (IF EXISTS)
--
-- ============================================================

BEGIN;

-- Drop tables in reverse dependency order
-- (child tables first, parent tables last)

-- ============================================================
-- PARTICIPATION & PAYMENTS LAYER
-- ============================================================

DROP TABLE IF EXISTS public.tax_document CASCADE;
DROP TABLE IF EXISTS public.media CASCADE;
DROP TABLE IF EXISTS public.contract CASCADE;
DROP TABLE IF EXISTS public.payment CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.rsvp CASCADE;
DROP TABLE IF EXISTS public.concert_participant CASCADE;

-- ============================================================
-- MUSIC & REHEARSALS LAYER
-- ============================================================

DROP TABLE IF EXISTS public.rehearsal CASCADE;
DROP TABLE IF EXISTS public.concert_piece CASCADE;
DROP TABLE IF EXISTS public.piece CASCADE;

-- ============================================================
-- CORE FOUNDATION LAYER
-- ============================================================

DROP TABLE IF EXISTS public.user_profile CASCADE;
DROP TABLE IF EXISTS public.musician CASCADE;
DROP TABLE IF EXISTS public.person CASCADE;
DROP TABLE IF EXISTS public.concert CASCADE;
DROP TABLE IF EXISTS public.season CASCADE;
DROP TABLE IF EXISTS public.fiscal_year CASCADE;

COMMIT;

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Check that all tables are gone
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'fiscal_year', 'season', 'concert', 'person', 'musician', 
    'user_profile', 'piece', 'concert_piece', 'rehearsal',
    'concert_participant', 'rsvp', 'attendance', 'payment',
    'contract', 'tax_document', 'media'
  )
ORDER BY table_name;

-- If this returns 0 rows, all tables have been dropped successfully

-- ============================================================
-- SUCCESS!
-- ============================================================
-- All GCMS tables have been dropped.
-- Ready to run Script 2: CREATE ALL TABLES
-- ============================================================
