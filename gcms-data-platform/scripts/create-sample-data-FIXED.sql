-- ============================================================
-- GCMS Sample Data for Demo (FIXED - Matches Actual Schema)
-- ============================================================
-- 
-- PURPOSE:
-- Create realistic test data matching the actual database schema
--
-- USAGE:
-- 1. Log into Supabase SQL Editor
-- 2. Copy and paste this entire script
-- 3. Click "Run" or press Cmd+Enter
--
-- ============================================================

BEGIN;

-- ============================================================
-- 1. FISCAL YEARS
-- ============================================================

INSERT INTO public.fiscal_year (name, start_date, end_date)
VALUES 
    ('FY 2024', '2024-01-01', '2024-12-31'),
    ('FY 2025', '2025-01-01', '2025-12-31')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. SEASONS
-- ============================================================

INSERT INTO public.season (fiscal_year_id, name, description)
SELECT 
    fy.fiscal_year_id,
    'Fall 2024',
    'Fall season featuring classical masterworks'
FROM public.fiscal_year fy
WHERE fy.name = 'FY 2024'
ON CONFLICT (fiscal_year_id, name) DO NOTHING;

INSERT INTO public.season (fiscal_year_id, name, description)
SELECT 
    fy.fiscal_year_id,
    'Spring 2025',
    'Spring season with contemporary and traditional works'
FROM public.fiscal_year fy
WHERE fy.name = 'FY 2025'
ON CONFLICT (fiscal_year_id, name) DO NOTHING;

-- ============================================================
-- 3. CONCERTS
-- ============================================================

INSERT INTO public.concert (season_id, title, program_notes, concert_date, venue, total_budget)
SELECT 
    s.season_id,
    'Fall Gala Concert',
    'Opening concert featuring Beethoven Symphony No. 5',
    '2024-10-15'::date,
    'Symphony Hall',
    15000.00
FROM public.season s
WHERE s.name = 'Fall 2024';

INSERT INTO public.concert (season_id, title, program_notes, concert_date, venue, total_budget)
SELECT 
    s.season_id,
    'Holiday Spectacular',
    'Holiday concert featuring festive classics',
    '2024-12-20'::date,
    'Symphony Hall',
    12000.00
FROM public.season s
WHERE s.name = 'Fall 2024';

INSERT INTO public.concert (season_id, title, program_notes, concert_date, venue, total_budget)
SELECT 
    s.season_id,
    'Spring Awakening',
    'Celebrating spring with Vivaldi and Mozart',
    '2025-03-15'::date,
    'Symphony Hall',
    13000.00
FROM public.season s
WHERE s.name = 'Spring 2025';

INSERT INTO public.concert (season_id, title, program_notes, concert_date, venue, total_budget)
SELECT 
    s.season_id,
    'Season Finale',
    'Grand finale featuring Mahler Symphony No. 1',
    '2025-05-20'::date,
    'Symphony Hall',
    18000.00
FROM public.season s
WHERE s.name = 'Spring 2025';

-- ============================================================
-- 4. PEOPLE & MUSICIANS
-- ============================================================

-- Insert people (musicians)
INSERT INTO public.person (first_name, last_name, email, phone, role)
VALUES 
    ('Sarah', 'Johnson', 'sarah.johnson@example.com', '555-0101', 'musician'),
    ('Michael', 'Chen', 'michael.chen@example.com', '555-0102', 'musician'),
    ('Emily', 'Rodriguez', 'emily.rodriguez@example.com', '555-0103', 'musician'),
    ('David', 'Kim', 'david.kim@example.com', '555-0104', 'musician'),
    ('Jessica', 'Williams', 'jessica.williams@example.com', '555-0105', 'musician'),
    ('Robert', 'Brown', 'robert.brown@example.com', '555-0106', 'musician'),
    ('Amanda', 'Davis', 'amanda.davis@example.com', '555-0107', 'musician'),
    ('Christopher', 'Garcia', 'chris.garcia@example.com', '555-0108', 'musician'),
    ('Jennifer', 'Martinez', 'jennifer.martinez@example.com', '555-0109', 'musician'),
    ('Matthew', 'Anderson', 'matthew.anderson@example.com', '555-0110', 'musician')
ON CONFLICT (email) DO NOTHING;

-- Insert musicians (using person_id as musician_id)
INSERT INTO public.musician (musician_id, instrument, union_member)
SELECT 
    p.person_id,
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
        WHEN p.first_name IN ('Sarah', 'Michael', 'David') THEN true
        ELSE false
    END
FROM public.person p
WHERE p.email LIKE '%@example.com'
  AND p.role = 'musician'
ON CONFLICT (musician_id) DO NOTHING;

-- ============================================================
-- 5. PIECES (REPERTOIRE)
-- ============================================================

INSERT INTO public.piece (title, composer, duration_minutes)
VALUES 
    ('Symphony No. 5 in C minor, Op. 67', 'Ludwig van Beethoven', 35),
    ('The Four Seasons: Spring', 'Antonio Vivaldi', 10),
    ('Symphony No. 40 in G minor, K. 550', 'Wolfgang Amadeus Mozart', 30),
    ('Symphony No. 1 in D major', 'Gustav Mahler', 55),
    ('Jingle Bells', 'James Lord Pierpont', 3),
    ('Silent Night', 'Franz Xaver Gruber', 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. CONCERT PIECES (PROGRAMS)
-- ============================================================

-- Fall Gala Concert program
INSERT INTO public.concert_piece (concert_id, piece_id, performance_order)
SELECT 
    c.concert_id,
    p.piece_id,
    1
FROM public.concert c
CROSS JOIN public.piece p
WHERE c.title = 'Fall Gala Concert'
  AND p.title LIKE 'Symphony No. 5%'
ON CONFLICT (concert_id, piece_id) DO NOTHING;

-- Holiday Spectacular program
INSERT INTO public.concert_piece (concert_id, piece_id, performance_order)
SELECT 
    c.concert_id,
    p.piece_id,
    ROW_NUMBER() OVER (ORDER BY p.title)
FROM public.concert c
CROSS JOIN public.piece p
WHERE c.title = 'Holiday Spectacular'
  AND p.title IN ('Jingle Bells', 'Silent Night')
ON CONFLICT (concert_id, piece_id) DO NOTHING;

-- Spring Awakening program
INSERT INTO public.concert_piece (concert_id, piece_id, performance_order)
SELECT 
    c.concert_id,
    p.piece_id,
    ROW_NUMBER() OVER (ORDER BY p.title)
FROM public.concert c
CROSS JOIN public.piece p
WHERE c.title = 'Spring Awakening'
  AND (p.title LIKE '%Vivaldi%' OR p.title LIKE '%Mozart%')
ON CONFLICT (concert_id, piece_id) DO NOTHING;

-- ============================================================
-- 7. REHEARSALS
-- ============================================================

-- Fall Gala rehearsals
INSERT INTO public.rehearsal (concert_id, rehearsal_date, location)
SELECT 
    c.concert_id,
    '2024-10-08 19:00:00'::timestamp,
    'Symphony Hall',
    true,
    50.00
FROM public.concert c
WHERE c.title = 'Fall Gala Concert';

INSERT INTO public.rehearsal (concert_id, rehearsal_date, location)
SELECT 
    c.concert_id,
    '2024-10-13 14:00:00'::timestamp,
    'Symphony Hall',
    true,
    50.00
FROM public.concert c
WHERE c.title = 'Fall Gala Concert';

-- Holiday Spectacular rehearsal
INSERT INTO public.rehearsal (concert_id, rehearsal_date, location)
SELECT 
    c.concert_id,
    '2024-12-15 14:00:00'::timestamp,
    'Symphony Hall',
    true,
    50.00
FROM public.concert c
WHERE c.title = 'Holiday Spectacular';

-- Spring Awakening rehearsal
INSERT INTO public.rehearsal (concert_id, rehearsal_date, location)
SELECT 
    c.concert_id,
    '2025-03-10 19:00:00'::timestamp,
    'Symphony Hall',
    true,
    50.00
FROM public.concert c
WHERE c.title = 'Spring Awakening';

-- ============================================================
-- 8. CONCERT PARTICIPANTS
-- ============================================================

-- Fall Gala Concert participants
INSERT INTO public.concert_participant (concert_id, musician_id, role, pay_type, agreed_amount)
SELECT 
    c.concert_id,
    m.musician_id,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 'principal'
        WHEN p.first_name IN ('Michael', 'Emily') THEN 'section'
        ELSE NULL
    END,
    'per_service',
    CASE 
        WHEN p.first_name = 'Sarah' THEN 150.00
        WHEN p.first_name IN ('Michael', 'Emily', 'David') THEN 125.00
        ELSE 100.00
    END
FROM public.concert c
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Fall Gala Concert'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer')
ON CONFLICT (concert_id, musician_id) DO NOTHING;

-- Holiday Spectacular participants
INSERT INTO public.concert_participant (concert_id, musician_id, role, pay_type, agreed_amount)
SELECT 
    c.concert_id,
    m.musician_id,
    NULL,
    'per_service',
    100.00
FROM public.concert c
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Holiday Spectacular'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda')
ON CONFLICT (concert_id, musician_id) DO NOTHING;

-- ============================================================
-- 9. ATTENDANCE (Rehearsals)
-- ============================================================

-- Attendance for first Fall Gala rehearsal
INSERT INTO public.attendance (rehearsal_id, musician_id, attended, check_in_time)
SELECT 
    r.rehearsal_id,
    m.musician_id,
    CASE 
        WHEN p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher') THEN true
        ELSE false
    END,
    CASE 
        WHEN p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher') 
        THEN '2024-10-08 18:55:00'::timestamp
        ELSE NULL
    END
FROM public.rehearsal r
JOIN public.concert c ON r.concert_id = c.concert_id
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Fall Gala Concert'
  AND r.rehearsal_date = '2024-10-08 19:00:00'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer')
ON CONFLICT (rehearsal_id, musician_id) DO NOTHING;

-- Attendance for second Fall Gala rehearsal (all present)
INSERT INTO public.attendance (rehearsal_id, musician_id, attended, check_in_time)
SELECT 
    r.rehearsal_id,
    m.musician_id,
    true,
    '2024-10-13 13:55:00'::timestamp
FROM public.rehearsal r
JOIN public.concert c ON r.concert_id = c.concert_id
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Fall Gala Concert'
  AND r.rehearsal_date = '2024-10-13 14:00:00'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer')
ON CONFLICT (rehearsal_id, musician_id) DO NOTHING;

-- ============================================================
-- 10. ATTENDANCE (Concerts)
-- ============================================================

-- Fall Gala Concert attendance
INSERT INTO public.attendance (concert_id, musician_id, attended, check_in_time)
SELECT 
    c.concert_id,
    m.musician_id,
    true,
    '2024-10-15 18:30:00'::timestamp
FROM public.concert c
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Fall Gala Concert'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer')
ON CONFLICT (concert_id, musician_id) DO NOTHING;

-- ============================================================
-- 11. PAYMENTS
-- ============================================================

-- Payments for Fall Gala Concert
INSERT INTO public.payment (concert_id, musician_id, gross_amount, deductions, net_amount, paid, payment_date)
SELECT 
    c.concert_id,
    m.musician_id,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 450.00  -- 3 services * 150
        WHEN p.first_name IN ('Michael', 'Emily', 'David') THEN 375.00  -- 3 services * 125
        WHEN p.first_name = 'Jennifer' THEN 200.00  -- Missed 1 rehearsal, so 2 services * 100
        ELSE 300.00  -- 3 services * 100
    END,
    CASE 
        WHEN p.first_name = 'Jennifer' THEN 100.00  -- Deduction for missed rehearsal
        ELSE 0.00
    END,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 450.00
        WHEN p.first_name IN ('Michael', 'Emily', 'David') THEN 375.00
        WHEN p.first_name = 'Jennifer' THEN 100.00
        ELSE 300.00
    END,
    true,
    '2024-11-01'::date
FROM public.concert c
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Fall Gala Concert'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer');

COMMIT;

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================

-- Check fiscal years
SELECT * FROM public.fiscal_year ORDER BY start_date;

-- Check seasons
SELECT s.*, fy.name as fiscal_year_name 
FROM public.season s
JOIN public.fiscal_year fy ON s.fiscal_year_id = fy.fiscal_year_id
ORDER BY fy.start_date;

-- Check concerts
SELECT c.*, s.name as season_name
FROM public.concert c
JOIN public.season s ON c.season_id = s.season_id
ORDER BY c.concert_date;

-- Check musicians
SELECT 
    p.first_name || ' ' || p.last_name as musician_name,
    m.instrument,
    m.union_member
FROM public.musician m
JOIN public.person p ON m.musician_id = p.person_id
ORDER BY p.last_name;

-- Check attendance
SELECT 
    p.first_name || ' ' || p.last_name as musician_name,
    COALESCE(r.rehearsal_date::text, c.concert_date::text) as event_date,
    CASE WHEN r.rehearsal_id IS NOT NULL THEN 'Rehearsal' ELSE 'Concert' END as event_type,
    a.attended,
    a.check_in_time
FROM public.attendance a
JOIN public.musician m ON a.musician_id = m.musician_id
JOIN public.person p ON m.musician_id = p.person_id
LEFT JOIN public.rehearsal r ON a.rehearsal_id = r.rehearsal_id
LEFT JOIN public.concert c ON a.concert_id = c.concert_id
ORDER BY COALESCE(r.rehearsal_date, c.concert_date::timestamp), p.last_name;

-- Check payments
SELECT 
    p.first_name || ' ' || p.last_name as musician_name,
    c.title as concert_name,
    pay.gross_amount,
    pay.deductions,
    pay.net_amount,
    pay.paid,
    pay.payment_date
FROM public.payment pay
JOIN public.musician m ON pay.musician_id = m.musician_id
JOIN public.person p ON m.musician_id = p.person_id
JOIN public.concert c ON pay.concert_id = c.concert_id
ORDER BY c.concert_date, p.last_name;

-- ============================================================
-- SUCCESS!
-- ============================================================
