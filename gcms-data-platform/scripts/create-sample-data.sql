-- ============================================================
-- GCMS Sample Data for Demo
-- ============================================================
-- 
-- PURPOSE:
-- Create realistic test data to demonstrate the data platform
--
-- USAGE:
-- 1. Log into Supabase: https://supabase.com/dashboard/project/stttpmepakavlubbsqaq
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" or press Cmd+Enter
--
-- WHAT THIS CREATES:
-- - 2 fiscal years (2024, 2025)
-- - 2 seasons (Fall 2024, Spring 2025)
-- - 4 concerts
-- - 10 musicians
-- - 15+ attendance records
-- - 5 contracts
-- - Sample payments
--
-- ============================================================

BEGIN;

-- ============================================================
-- 1. FISCAL YEARS
-- ============================================================

INSERT INTO public.fiscal_year (name, start_date, end_date, is_active)
VALUES 
    ('FY 2024', '2024-01-01', '2024-12-31', false),
    ('FY 2025', '2025-01-01', '2025-12-31', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. SEASONS
-- ============================================================

INSERT INTO public.season (name, fiscal_year_id, start_date, end_date, is_active)
SELECT 
    'Fall 2024',
    fy.id,
    '2024-09-01'::date,
    '2024-12-31'::date,
    false
FROM public.fiscal_year fy
WHERE fy.name = 'FY 2024'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.season (name, fiscal_year_id, start_date, end_date, is_active)
SELECT 
    'Spring 2025',
    fy.id,
    '2025-01-01'::date,
    '2025-05-31'::date,
    true
FROM public.fiscal_year fy
WHERE fy.name = 'FY 2025'
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 3. CONCERTS
-- ============================================================

INSERT INTO public.concert (
    name, 
    season_id, 
    concert_date, 
    venue, 
    concert_type,
    description
)
SELECT 
    'Fall Gala Concert',
    s.id,
    '2024-10-15 19:30:00'::timestamp,
    'Symphony Hall',
    'gala',
    'Opening concert of the Fall 2024 season featuring Beethoven Symphony No. 5'
FROM public.season s
WHERE s.name = 'Fall 2024'
ON CONFLICT DO NOTHING;

INSERT INTO public.concert (
    name, 
    season_id, 
    concert_date, 
    venue, 
    concert_type,
    description
)
SELECT 
    'Holiday Spectacular',
    s.id,
    '2024-12-20 19:30:00'::timestamp,
    'Symphony Hall',
    'regular',
    'Holiday concert featuring festive classics'
FROM public.season s
WHERE s.name = 'Fall 2024'
ON CONFLICT DO NOTHING;

INSERT INTO public.concert (
    name, 
    season_id, 
    concert_date, 
    venue, 
    concert_type,
    description
)
SELECT 
    'Spring Awakening',
    s.id,
    '2025-03-15 19:30:00'::timestamp,
    'Symphony Hall',
    'regular',
    'Celebrating spring with Vivaldi and Mozart'
FROM public.season s
WHERE s.name = 'Spring 2025'
ON CONFLICT DO NOTHING;

INSERT INTO public.concert (
    name, 
    season_id, 
    concert_date, 
    venue, 
    concert_type,
    description
)
SELECT 
    'Season Finale',
    s.id,
    '2025-05-20 19:30:00'::timestamp,
    'Symphony Hall',
    'gala',
    'Grand finale featuring Mahler Symphony No. 1'
FROM public.season s
WHERE s.name = 'Spring 2025'
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. PEOPLE & MUSICIANS
-- ============================================================

-- Insert people
INSERT INTO public.person (first_name, last_name, email, phone)
VALUES 
    ('Sarah', 'Johnson', 'sarah.johnson@example.com', '555-0101'),
    ('Michael', 'Chen', 'michael.chen@example.com', '555-0102'),
    ('Emily', 'Rodriguez', 'emily.rodriguez@example.com', '555-0103'),
    ('David', 'Kim', 'david.kim@example.com', '555-0104'),
    ('Jessica', 'Williams', 'jessica.williams@example.com', '555-0105'),
    ('Robert', 'Brown', 'robert.brown@example.com', '555-0106'),
    ('Amanda', 'Davis', 'amanda.davis@example.com', '555-0107'),
    ('Christopher', 'Garcia', 'chris.garcia@example.com', '555-0108'),
    ('Jennifer', 'Martinez', 'jennifer.martinez@example.com', '555-0109'),
    ('Matthew', 'Anderson', 'matthew.anderson@example.com', '555-0110')
ON CONFLICT (email) DO NOTHING;

-- Insert musicians
INSERT INTO public.musician (person_id, instrument, section, is_active)
SELECT 
    p.id,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 'Violin'
        WHEN p.first_name = 'Michael' THEN 'Violin'
        WHEN p.first_name = 'Emily' THEN 'Viola'
        WHEN p.first_name = 'David' THEN 'Cello'
        WHEN p.first_name = 'Jessica' THEN 'Cello'
        WHEN p.first_name = 'Robert' THEN 'Bass'
        WHEN p.first_name = 'Amanda' THEN 'Flute'
        WHEN p.first_name = 'Christopher' THEN 'Clarinet'
        WHEN p.first_name = 'Jennifer' THEN 'Oboe'
        WHEN p.first_name = 'Matthew' THEN 'Horn'
    END,
    CASE 
        WHEN p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica') THEN 'Strings'
        WHEN p.first_name IN ('Amanda', 'Christopher', 'Jennifer') THEN 'Woodwinds'
        WHEN p.first_name = 'Matthew' THEN 'Brass'
        ELSE 'Other'
    END,
    true
FROM public.person p
WHERE p.email LIKE '%@example.com'
ON CONFLICT DO NOTHING;

-- ============================================================
-- 5. REHEARSALS
-- ============================================================

-- Fall 2024 rehearsals
INSERT INTO public.rehearsal (season_id, rehearsal_date, location, rehearsal_type)
SELECT 
    s.id,
    '2024-10-08 19:00:00'::timestamp,
    'Symphony Hall',
    'full_orchestra'
FROM public.season s
WHERE s.name = 'Fall 2024'
ON CONFLICT DO NOTHING;

INSERT INTO public.rehearsal (season_id, rehearsal_date, location, rehearsal_type)
SELECT 
    s.id,
    '2024-10-13 14:00:00'::timestamp,
    'Symphony Hall',
    'full_orchestra'
FROM public.season s
WHERE s.name = 'Fall 2024'
ON CONFLICT DO NOTHING;

INSERT INTO public.rehearsal (season_id, rehearsal_date, location, rehearsal_type)
SELECT 
    s.id,
    '2024-12-15 14:00:00'::timestamp,
    'Symphony Hall',
    'full_orchestra'
FROM public.season s
WHERE s.name = 'Fall 2024'
ON CONFLICT DO NOTHING;

-- Spring 2025 rehearsals
INSERT INTO public.rehearsal (season_id, rehearsal_date, location, rehearsal_type)
SELECT 
    s.id,
    '2025-03-10 19:00:00'::timestamp,
    'Symphony Hall',
    'full_orchestra'
FROM public.season s
WHERE s.name = 'Spring 2025'
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. ATTENDANCE (Rehearsals)
-- ============================================================

-- Attendance for first Fall rehearsal (most musicians present)
INSERT INTO public.attendance (musician_id, rehearsal_id, status, notes)
SELECT 
    m.id,
    r.id,
    CASE 
        WHEN p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher') THEN 'present'
        WHEN p.first_name = 'Jennifer' THEN 'excused'
        ELSE 'absent'
    END,
    CASE 
        WHEN p.first_name = 'Jennifer' THEN 'Family emergency'
        WHEN p.first_name NOT IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer') THEN 'No notice'
        ELSE NULL
    END
FROM public.musician m
JOIN public.person p ON m.person_id = p.id
CROSS JOIN public.rehearsal r
WHERE r.rehearsal_date = '2024-10-08 19:00:00'
ON CONFLICT DO NOTHING;

-- Attendance for second Fall rehearsal (all present)
INSERT INTO public.attendance (musician_id, rehearsal_id, status)
SELECT 
    m.id,
    r.id,
    'present'
FROM public.musician m
CROSS JOIN public.rehearsal r
WHERE r.rehearsal_date = '2024-10-13 14:00:00'
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. CONCERT PARTICIPANTS
-- ============================================================

-- Fall Gala Concert participants
INSERT INTO public.concert_participant (musician_id, concert_id, role, confirmed)
SELECT 
    m.id,
    c.id,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 'concertmaster'
        ELSE 'performer'
    END,
    true
FROM public.musician m
JOIN public.person p ON m.person_id = p.id
CROSS JOIN public.concert c
WHERE c.name = 'Fall Gala Concert'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer')
ON CONFLICT DO NOTHING;

-- Holiday Spectacular participants
INSERT INTO public.concert_participant (musician_id, concert_id, role, confirmed)
SELECT 
    m.id,
    c.id,
    'performer',
    true
FROM public.musician m
JOIN public.person p ON m.person_id = p.id
CROSS JOIN public.concert c
WHERE c.name = 'Holiday Spectacular'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. CONTRACTS
-- ============================================================

-- Create contracts for Fall 2024 season
INSERT INTO public.contract (
    musician_id,
    season_id,
    contract_type,
    base_rate,
    rehearsal_rate,
    concert_rate,
    start_date,
    end_date,
    status
)
SELECT 
    m.id,
    s.id,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 'principal'
        WHEN p.first_name IN ('Michael', 'Emily', 'David') THEN 'section_leader'
        ELSE 'regular'
    END,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 150.00
        WHEN p.first_name IN ('Michael', 'Emily', 'David') THEN 125.00
        ELSE 100.00
    END,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 75.00
        WHEN p.first_name IN ('Michael', 'Emily', 'David') THEN 60.00
        ELSE 50.00
    END,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 150.00
        WHEN p.first_name IN ('Michael', 'Emily', 'David') THEN 125.00
        ELSE 100.00
    END,
    s.start_date,
    s.end_date,
    'active'
FROM public.musician m
JOIN public.person p ON m.person_id = p.id
CROSS JOIN public.season s
WHERE s.name = 'Fall 2024'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. SAMPLE PAYMENTS (Optional - shows payment history)
-- ============================================================

INSERT INTO public.payment (
    musician_id,
    season_id,
    amount,
    payment_date,
    payment_type,
    description,
    status
)
SELECT 
    m.id,
    s.id,
    225.00, -- 2 rehearsals + 1 concert for regular musician
    '2024-11-01'::date,
    'direct_deposit',
    'Payment for Fall Gala Concert and rehearsals',
    'completed'
FROM public.musician m
JOIN public.person p ON m.person_id = p.id
CROSS JOIN public.season s
WHERE s.name = 'Fall 2024'
  AND p.first_name = 'Jessica'
ON CONFLICT DO NOTHING;

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Run these to verify data was created:

-- Check fiscal years
SELECT * FROM public.fiscal_year ORDER BY start_date;

-- Check seasons
SELECT s.*, fy.name as fiscal_year_name 
FROM public.season s
JOIN public.fiscal_year fy ON s.fiscal_year_id = fy.id
ORDER BY s.start_date;

-- Check concerts
SELECT c.*, s.name as season_name
FROM public.concert c
JOIN public.season s ON c.season_id = s.id
ORDER BY c.concert_date;

-- Check musicians
SELECT 
    p.first_name || ' ' || p.last_name as musician_name,
    m.instrument,
    m.section,
    m.is_active
FROM public.musician m
JOIN public.person p ON m.person_id = p.id
ORDER BY m.section, p.last_name;

-- Check attendance
SELECT 
    p.first_name || ' ' || p.last_name as musician_name,
    r.rehearsal_date,
    a.status,
    a.notes
FROM public.attendance a
JOIN public.musician m ON a.musician_id = m.id
JOIN public.person p ON m.person_id = p.id
JOIN public.rehearsal r ON a.rehearsal_id = r.id
ORDER BY r.rehearsal_date, p.last_name;

-- Check concert participants
SELECT 
    p.first_name || ' ' || p.last_name as musician_name,
    c.name as concert_name,
    cp.role,
    cp.confirmed
FROM public.concert_participant cp
JOIN public.musician m ON cp.musician_id = m.id
JOIN public.person p ON m.person_id = p.id
JOIN public.concert c ON cp.concert_id = c.id
ORDER BY c.concert_date, p.last_name;

-- Check contracts
SELECT 
    p.first_name || ' ' || p.last_name as musician_name,
    s.name as season_name,
    ct.contract_type,
    ct.base_rate,
    ct.rehearsal_rate,
    ct.concert_rate,
    ct.status
FROM public.contract ct
JOIN public.musician m ON ct.musician_id = m.id
JOIN public.person p ON m.person_id = p.id
JOIN public.season s ON ct.season_id = s.id
ORDER BY s.start_date, p.last_name;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- 
-- You now have realistic sample data for your demo:
-- - 10 musicians with different instruments
-- - 4 concerts across 2 seasons
-- - Attendance records showing who came to rehearsals
-- - Concert participants showing who performed
-- - Contracts with different payment rates
-- - Sample payment history
--
-- Next steps:
-- 1. Run dbt models to transform this data
-- 2. Check the Gold layer for payroll calculations
-- 3. Practice your demo!
--
-- ============================================================
