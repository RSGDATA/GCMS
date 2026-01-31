-- ============================================================
-- CLEAN SLATE SCRIPT 3: INSERT SAMPLE DATA
-- ============================================================
-- 
-- PURPOSE: Load realistic demo data for testing the complete pipeline
-- 
-- DEMONSTRATES:
-- ✅ Lump sum vs per-service payment models
-- ✅ Required vs optional rehearsals
-- ✅ Union vs non-union musicians
-- ✅ Missed services and deductions
-- ✅ Multiple concerts across seasons
-- ✅ Complete attendance tracking
-- ✅ Realistic payment calculations
--
-- USAGE:
-- 1. Run Script 1 (DROP ALL) first
-- 2. Run Script 2 (CREATE TABLES) second
-- 3. Open Supabase SQL Editor
-- 4. Copy and paste this entire script
-- 5. Click "Run" or press Cmd+Enter
--
-- ============================================================

BEGIN;

-- ============================================================
-- 1. FISCAL YEARS
-- ============================================================

INSERT INTO public.fiscal_year (name, start_date, end_date)
VALUES 
    ('FY 2024', '2024-01-01', '2024-12-31'),
    ('FY 2025', '2025-01-01', '2025-12-31');

-- ============================================================
-- 2. SEASONS
-- ============================================================

INSERT INTO public.season (fiscal_year_id, name, description)
SELECT 
    fy.fiscal_year_id,
    'Fall 2024',
    'Fall season featuring classical masterworks and contemporary pieces'
FROM public.fiscal_year fy
WHERE fy.name = 'FY 2024';

INSERT INTO public.season (fiscal_year_id, name, description)
SELECT 
    fy.fiscal_year_id,
    'Spring 2025',
    'Spring season celebrating renewal with Vivaldi, Mozart, and Mahler'
FROM public.fiscal_year fy
WHERE fy.name = 'FY 2025';

-- ============================================================
-- 3. CONCERTS
-- ============================================================

INSERT INTO public.concert (season_id, title, program_notes, concert_date, venue, total_budget)
SELECT 
    s.season_id,
    'Fall Gala Concert',
    'Opening concert featuring Beethoven Symphony No. 5 - a powerful statement of triumph over adversity',
    '2024-10-15'::date,
    'Symphony Hall',
    15000.00
FROM public.season s
WHERE s.name = 'Fall 2024';

INSERT INTO public.concert (season_id, title, program_notes, concert_date, venue, total_budget)
SELECT 
    s.season_id,
    'Holiday Spectacular',
    'Festive holiday concert featuring beloved classics and seasonal favorites',
    '2024-12-20'::date,
    'Symphony Hall',
    12000.00
FROM public.season s
WHERE s.name = 'Fall 2024';

INSERT INTO public.concert (season_id, title, program_notes, concert_date, venue, total_budget)
SELECT 
    s.season_id,
    'Spring Awakening',
    'Celebrating spring with Vivaldi Four Seasons and Mozart Symphony No. 40',
    '2025-03-15'::date,
    'Symphony Hall',
    13000.00
FROM public.season s
WHERE s.name = 'Spring 2025';

INSERT INTO public.concert (season_id, title, program_notes, concert_date, venue, total_budget)
SELECT 
    s.season_id,
    'Season Finale',
    'Grand finale featuring Mahler Symphony No. 1 "Titan"',
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
    ('Matthew', 'Anderson', 'matthew.anderson@example.com', '555-0110', 'musician');

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
WHERE p.role = 'musician';

-- ============================================================
-- 5. PIECES (REPERTOIRE)
-- ============================================================

INSERT INTO public.piece (title, composer, duration_minutes)
VALUES 
    ('Symphony No. 5 in C minor, Op. 67', 'Ludwig van Beethoven', 35),
    ('The Four Seasons: Spring', 'Antonio Vivaldi', 10),
    ('Symphony No. 40 in G minor, K. 550', 'Wolfgang Amadeus Mozart', 30),
    ('Symphony No. 1 in D major "Titan"', 'Gustav Mahler', 55),
    ('Jingle Bells', 'James Lord Pierpont', 3),
    ('Silent Night', 'Franz Xaver Gruber', 4),
    ('O Holy Night', 'Adolphe Adam', 5);

-- ============================================================
-- 6. CONCERT PIECES (PROGRAMS)
-- ============================================================

-- Fall Gala Concert program
INSERT INTO public.concert_piece (concert_id, piece_id, program_order)
SELECT 
    c.concert_id,
    p.piece_id,
    1
FROM public.concert c
CROSS JOIN public.piece p
WHERE c.title = 'Fall Gala Concert'
  AND p.title LIKE 'Symphony No. 5%';

-- Holiday Spectacular program
INSERT INTO public.concert_piece (concert_id, piece_id, program_order)
SELECT 
    c.concert_id,
    p.piece_id,
    ROW_NUMBER() OVER (ORDER BY p.title)::INTEGER
FROM public.concert c
CROSS JOIN public.piece p
WHERE c.title = 'Holiday Spectacular'
  AND p.title IN ('Jingle Bells', 'Silent Night', 'O Holy Night');

-- Spring Awakening program
INSERT INTO public.concert_piece (concert_id, piece_id, program_order)
SELECT 
    c.concert_id,
    p.piece_id,
    ROW_NUMBER() OVER (ORDER BY p.title)::INTEGER
FROM public.concert c
CROSS JOIN public.piece p
WHERE c.title = 'Spring Awakening'
  AND (p.title LIKE '%Vivaldi%' OR p.title LIKE '%Mozart%');

-- Season Finale program
INSERT INTO public.concert_piece (concert_id, piece_id, program_order)
SELECT 
    c.concert_id,
    p.piece_id,
    1
FROM public.concert c
CROSS JOIN public.piece p
WHERE c.title = 'Season Finale'
  AND p.title LIKE '%Mahler%';

-- ============================================================
-- 7. REHEARSALS
-- ============================================================

-- Fall Gala rehearsals (2 required rehearsals)
INSERT INTO public.rehearsal (concert_id, rehearsal_date, location, required, service_value)
SELECT 
    c.concert_id,
    '2024-10-08 19:00:00'::timestamp,
    'Symphony Hall',
    true,
    50.00
FROM public.concert c
WHERE c.title = 'Fall Gala Concert';

INSERT INTO public.rehearsal (concert_id, rehearsal_date, location, required, service_value)
SELECT 
    c.concert_id,
    '2024-10-13 14:00:00'::timestamp,
    'Symphony Hall',
    true,
    50.00
FROM public.concert c
WHERE c.title = 'Fall Gala Concert';

-- Holiday Spectacular rehearsal (1 required)
INSERT INTO public.rehearsal (concert_id, rehearsal_date, location, required, service_value)
SELECT 
    c.concert_id,
    '2024-12-15 14:00:00'::timestamp,
    'Symphony Hall',
    true,
    50.00
FROM public.concert c
WHERE c.title = 'Holiday Spectacular';

-- Spring Awakening rehearsals (1 required, 1 optional)
INSERT INTO public.rehearsal (concert_id, rehearsal_date, location, required, service_value)
SELECT 
    c.concert_id,
    '2025-03-10 19:00:00'::timestamp,
    'Symphony Hall',
    true,
    50.00
FROM public.concert c
WHERE c.title = 'Spring Awakening';

INSERT INTO public.rehearsal (concert_id, rehearsal_date, location, required, service_value)
SELECT 
    c.concert_id,
    '2025-03-12 19:00:00'::timestamp,
    'Symphony Hall',
    false,  -- Optional rehearsal
    25.00
FROM public.concert c
WHERE c.title = 'Spring Awakening';

-- ============================================================
-- 8. CONCERT PARTICIPANTS
-- ============================================================

-- Fall Gala Concert participants (mix of lump_sum and per_service)
INSERT INTO public.concert_participant (concert_id, musician_id, role, pay_type, agreed_amount)
SELECT 
    c.concert_id,
    m.musician_id,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 'principal'
        WHEN p.first_name IN ('Michael', 'Emily') THEN 'section'
        ELSE NULL
    END,
    CASE
        WHEN p.first_name IN ('Sarah', 'David') THEN 'lump_sum'
        ELSE 'per_service'
    END,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 500.00  -- Lump sum for principal
        WHEN p.first_name = 'David' THEN 400.00  -- Lump sum for cello
        WHEN p.first_name IN ('Michael', 'Emily') THEN 125.00  -- Per service
        ELSE 100.00  -- Per service
    END
FROM public.concert c
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Fall Gala Concert'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer');

-- Holiday Spectacular participants (all per_service)
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
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda');

-- ============================================================
-- 9. ATTENDANCE (Rehearsals)
-- ============================================================

-- Attendance for first Fall Gala rehearsal (Jennifer missed it)
INSERT INTO public.attendance (rehearsal_id, musician_id, attended, check_in_time)
SELECT 
    r.rehearsal_id,
    m.musician_id,
    CASE 
        WHEN p.first_name = 'Jennifer' THEN false
        ELSE true
    END,
    CASE 
        WHEN p.first_name = 'Jennifer' THEN NULL
        ELSE '2024-10-08 18:55:00'::timestamp
    END
FROM public.rehearsal r
JOIN public.concert c ON r.concert_id = c.concert_id
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Fall Gala Concert'
  AND r.rehearsal_date = '2024-10-08 19:00:00'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer');

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
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer');

-- Attendance for Holiday Spectacular rehearsal
INSERT INTO public.attendance (rehearsal_id, musician_id, attended, check_in_time)
SELECT 
    r.rehearsal_id,
    m.musician_id,
    true,
    '2024-12-15 13:50:00'::timestamp
FROM public.rehearsal r
JOIN public.concert c ON r.concert_id = c.concert_id
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Holiday Spectacular'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda');

-- ============================================================
-- 10. ATTENDANCE (Concerts)
-- ============================================================

-- Fall Gala Concert attendance (all present)
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
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Amanda', 'Christopher', 'Jennifer');

-- Holiday Spectacular concert attendance
INSERT INTO public.attendance (concert_id, musician_id, attended, check_in_time)
SELECT 
    c.concert_id,
    m.musician_id,
    true,
    '2024-12-20 18:45:00'::timestamp
FROM public.concert c
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Holiday Spectacular'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda');

-- ============================================================
-- 11. PAYMENTS
-- ============================================================

-- Payments for Fall Gala Concert
-- Sarah: Lump sum $500, no deductions (attended all)
-- David: Lump sum $400, no deductions (attended all)
-- Michael, Emily: Per service, 3 services each (2 rehearsals + concert)
-- Jessica, Amanda, Christopher: Per service, 3 services each
-- Jennifer: Per service, 2 services (missed 1 rehearsal), $50 deduction

INSERT INTO public.payment (concert_id, musician_id, gross_amount, deductions, net_amount, paid, payment_date)
SELECT 
    c.concert_id,
    m.musician_id,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 500.00
        WHEN p.first_name = 'David' THEN 400.00
        WHEN p.first_name IN ('Michael', 'Emily') THEN 375.00  -- 3 services * 125
        WHEN p.first_name = 'Jennifer' THEN 200.00  -- 2 services * 100
        ELSE 300.00  -- 3 services * 100
    END,
    CASE 
        WHEN p.first_name = 'Jennifer' THEN 100.00  -- Deduction for missed required rehearsal
        ELSE 0.00
    END,
    CASE 
        WHEN p.first_name = 'Sarah' THEN 500.00
        WHEN p.first_name = 'David' THEN 400.00
        WHEN p.first_name IN ('Michael', 'Emily') THEN 375.00
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

-- Payments for Holiday Spectacular (all per service, 2 services: 1 rehearsal + concert)
INSERT INTO public.payment (concert_id, musician_id, gross_amount, deductions, net_amount, paid, payment_date)
SELECT 
    c.concert_id,
    m.musician_id,
    200.00,  -- 2 services * 100
    0.00,
    200.00,
    false,  -- Not yet paid
    NULL
FROM public.concert c
CROSS JOIN public.musician m
JOIN public.person p ON m.musician_id = p.person_id
WHERE c.title = 'Holiday Spectacular'
  AND p.first_name IN ('Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Amanda');

COMMIT;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- Sample data has been loaded successfully.
-- Ready to run Script 4: VERIFICATION QUERIES
-- ============================================================
