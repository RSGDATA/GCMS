-- ============================================================
-- CLEAN SLATE SCRIPT 4: VERIFICATION QUERIES
-- ============================================================
-- 
-- PURPOSE: Beautiful, formatted queries to verify and showcase data
-- 
-- USAGE:
-- 1. Run Scripts 1, 2, and 3 first
-- 2. Open Supabase SQL Editor
-- 3. Run each section individually to see results
-- 4. Use these queries for demos and presentations
--
-- ============================================================

-- ============================================================
-- SECTION 1: FISCAL STRUCTURE
-- ============================================================

-- Fiscal Years Overview
SELECT 
    name as fiscal_year,
    start_date,
    end_date,
    (end_date - start_date) as days_in_year
FROM public.fiscal_year 
ORDER BY start_date;

-- Seasons by Fiscal Year
SELECT 
    fy.name as fiscal_year,
    s.name as season,
    s.description,
    COUNT(c.concert_id) as concert_count
FROM public.season s
JOIN public.fiscal_year fy ON s.fiscal_year_id = fy.fiscal_year_id
LEFT JOIN public.concert c ON s.season_id = c.season_id
GROUP BY fy.fiscal_year_id, fy.name, s.season_id, s.name, s.description
ORDER BY fy.start_date, s.name;

-- ============================================================
-- SECTION 2: CONCERT SCHEDULE
-- ============================================================

-- Complete Concert Schedule
SELECT 
    c.concert_date,
    c.title as concert,
    c.venue,
    s.name as season,
    fy.name as fiscal_year,
    c.total_budget,
    COUNT(DISTINCT cp.musician_id) as musicians_hired,
    COUNT(DISTINCT piece.piece_id) as pieces_programmed
FROM public.concert c
JOIN public.season s ON c.season_id = s.season_id
JOIN public.fiscal_year fy ON s.fiscal_year_id = fy.fiscal_year_id
LEFT JOIN public.concert_participant cp ON c.concert_id = cp.concert_id
LEFT JOIN public.concert_piece cpiece ON c.concert_id = cpiece.concert_id
LEFT JOIN public.piece ON cpiece.piece_id = piece.piece_id
GROUP BY c.concert_id, c.concert_date, c.title, c.venue, s.name, fy.name, c.total_budget
ORDER BY c.concert_date;

-- Concert Programs (What's Being Played)
SELECT 
    c.title as concert,
    c.concert_date,
    cp.program_order,
    p.title as piece,
    p.composer,
    p.duration_minutes || ' min' as duration
FROM public.concert c
JOIN public.concert_piece cp ON c.concert_id = cp.concert_id
JOIN public.piece p ON cp.piece_id = p.piece_id
ORDER BY c.concert_date, cp.program_order;

-- ============================================================
-- SECTION 3: MUSICIAN ROSTER
-- ============================================================

-- Complete Musician Roster
SELECT 
    p.first_name || ' ' || p.last_name as musician_name,
    m.instrument,
    CASE WHEN m.union_member THEN 'Union' ELSE 'Non-Union' END as union_status,
    p.email,
    p.phone,
    COUNT(DISTINCT cp.concert_id) as concerts_booked
FROM public.musician m
JOIN public.person p ON m.musician_id = p.person_id
LEFT JOIN public.concert_participant cp ON m.musician_id = cp.musician_id
GROUP BY p.person_id, p.first_name, p.last_name, m.instrument, m.union_member, p.email, p.phone
ORDER BY m.instrument, p.last_name;

-- Musicians by Instrument Section
SELECT 
    m.instrument,
    COUNT(*) as musician_count,
    SUM(CASE WHEN m.union_member THEN 1 ELSE 0 END) as union_members,
    SUM(CASE WHEN NOT m.union_member THEN 1 ELSE 0 END) as non_union
FROM public.musician m
GROUP BY m.instrument
ORDER BY musician_count DESC, m.instrument;

-- ============================================================
-- SECTION 4: REHEARSAL SCHEDULE
-- ============================================================

-- Rehearsal Schedule with Details
SELECT 
    c.title as concert,
    r.rehearsal_date,
    TO_CHAR(r.rehearsal_date, 'Day, Mon DD at HH12:MI AM') as formatted_date,
    r.location,
    CASE WHEN r.required THEN 'Required' ELSE 'Optional' END as attendance_type,
    '$' || r.service_value as service_value,
    COUNT(DISTINCT a.musician_id) as musicians_attended
FROM public.rehearsal r
JOIN public.concert c ON r.concert_id = c.concert_id
LEFT JOIN public.attendance a ON r.rehearsal_id = a.rehearsal_id AND a.attended = true
GROUP BY c.title, r.rehearsal_id, r.rehearsal_date, r.location, r.required, r.service_value
ORDER BY r.rehearsal_date;

-- ============================================================
-- SECTION 5: ATTENDANCE TRACKING
-- ============================================================

-- Attendance Summary by Musician
SELECT 
    p.first_name || ' ' || p.last_name as musician,
    m.instrument,
    COUNT(DISTINCT CASE WHEN a.attended THEN a.attendance_id END) as services_attended,
    COUNT(DISTINCT a.attendance_id) as total_services,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN a.attended THEN a.attendance_id END) / 
          NULLIF(COUNT(DISTINCT a.attendance_id), 0), 1) || '%' as attendance_rate
FROM public.musician m
JOIN public.person p ON m.musician_id = p.person_id
LEFT JOIN public.attendance a ON m.musician_id = a.musician_id
GROUP BY p.person_id, p.first_name, p.last_name, m.instrument
HAVING COUNT(DISTINCT a.attendance_id) > 0
ORDER BY attendance_rate DESC, p.last_name;

-- Detailed Attendance Log
SELECT 
    p.first_name || ' ' || p.last_name as musician,
    c.title as concert,
    COALESCE(
        TO_CHAR(r.rehearsal_date, 'Mon DD, YYYY HH12:MI AM'),
        TO_CHAR(c.concert_date, 'Mon DD, YYYY') || ' (Concert)'
    ) as event,
    CASE WHEN r.rehearsal_id IS NOT NULL THEN 'Rehearsal' ELSE 'Concert' END as event_type,
    CASE WHEN a.attended THEN '✓ Present' ELSE '✗ Absent' END as status,
    TO_CHAR(a.check_in_time, 'HH12:MI AM') as check_in
FROM public.attendance a
JOIN public.musician m ON a.musician_id = m.musician_id
JOIN public.person p ON m.musician_id = p.person_id
LEFT JOIN public.rehearsal r ON a.rehearsal_id = r.rehearsal_id
LEFT JOIN public.concert c ON COALESCE(a.concert_id, r.concert_id) = c.concert_id
ORDER BY 
    COALESCE(r.rehearsal_date, c.concert_date::timestamp),
    p.last_name;

-- ============================================================
-- SECTION 6: PAYMENT ANALYSIS
-- ============================================================

-- Payment Summary by Concert
SELECT 
    c.title as concert,
    c.concert_date,
    c.total_budget,
    COUNT(DISTINCT pay.musician_id) as musicians_paid,
    '$' || SUM(pay.gross_amount)::NUMERIC(10,2) as total_gross,
    '$' || SUM(pay.deductions)::NUMERIC(10,2) as total_deductions,
    '$' || SUM(pay.net_amount)::NUMERIC(10,2) as total_net,
    '$' || (c.total_budget - SUM(pay.net_amount))::NUMERIC(10,2) as budget_remaining,
    ROUND(100.0 * SUM(pay.net_amount) / c.total_budget, 1) || '%' as budget_used
FROM public.concert c
LEFT JOIN public.payment pay ON c.concert_id = pay.concert_id
GROUP BY c.concert_id, c.title, c.concert_date, c.total_budget
ORDER BY c.concert_date;

-- Individual Musician Payments
SELECT 
    p.first_name || ' ' || p.last_name as musician,
    m.instrument,
    c.title as concert,
    cp.pay_type,
    '$' || cp.agreed_amount as agreed_amount,
    '$' || pay.gross_amount as gross,
    '$' || pay.deductions as deductions,
    '$' || pay.net_amount as net_payment,
    CASE WHEN pay.paid THEN '✓ Paid' ELSE '○ Pending' END as payment_status,
    pay.payment_date
FROM public.payment pay
JOIN public.musician m ON pay.musician_id = m.musician_id
JOIN public.person p ON m.musician_id = p.person_id
JOIN public.concert c ON pay.concert_id = c.concert_id
JOIN public.concert_participant cp ON pay.concert_id = cp.concert_id 
    AND pay.musician_id = cp.musician_id
ORDER BY c.concert_date, pay.net_amount DESC;

-- Payment Type Analysis
SELECT 
    cp.pay_type,
    COUNT(DISTINCT cp.musician_id) as musicians,
    '$' || AVG(pay.gross_amount)::NUMERIC(10,2) as avg_gross,
    '$' || AVG(pay.deductions)::NUMERIC(10,2) as avg_deductions,
    '$' || AVG(pay.net_amount)::NUMERIC(10,2) as avg_net,
    '$' || SUM(pay.net_amount)::NUMERIC(10,2) as total_paid
FROM public.concert_participant cp
JOIN public.payment pay ON cp.concert_id = pay.concert_id 
    AND cp.musician_id = pay.musician_id
GROUP BY cp.pay_type
ORDER BY cp.pay_type;

-- Musicians with Deductions (Missed Services)
SELECT 
    p.first_name || ' ' || p.last_name as musician,
    c.title as concert,
    '$' || pay.gross_amount as gross,
    '$' || pay.deductions as deductions,
    '$' || pay.net_amount as net,
    ROUND(100.0 * pay.deductions / NULLIF(pay.gross_amount, 0), 1) || '%' as deduction_rate,
    'Missed required service(s)' as reason
FROM public.payment pay
JOIN public.musician m ON pay.musician_id = m.musician_id
JOIN public.person p ON m.musician_id = p.person_id
JOIN public.concert c ON pay.concert_id = c.concert_id
WHERE pay.deductions > 0
ORDER BY pay.deductions DESC;

-- ============================================================
-- SECTION 7: BUSINESS INTELLIGENCE
-- ============================================================

-- Concert Profitability Analysis
SELECT 
    c.title as concert,
    c.concert_date,
    '$' || c.total_budget as budget,
    '$' || COALESCE(SUM(pay.net_amount), 0)::NUMERIC(10,2) as musician_costs,
    '$' || (c.total_budget - COALESCE(SUM(pay.net_amount), 0))::NUMERIC(10,2) as remaining_budget,
    ROUND(100.0 * COALESCE(SUM(pay.net_amount), 0) / c.total_budget, 1) || '%' as cost_percentage,
    COUNT(DISTINCT cp.musician_id) as musicians_hired,
    COUNT(DISTINCT r.rehearsal_id) as rehearsals_scheduled
FROM public.concert c
LEFT JOIN public.payment pay ON c.concert_id = pay.concert_id
LEFT JOIN public.concert_participant cp ON c.concert_id = cp.concert_id
LEFT JOIN public.rehearsal r ON c.concert_id = r.concert_id
GROUP BY c.concert_id, c.title, c.concert_date, c.total_budget
ORDER BY c.concert_date;

-- Musician Earnings Summary
SELECT 
    p.first_name || ' ' || p.last_name as musician,
    m.instrument,
    CASE WHEN m.union_member THEN 'Union' ELSE 'Non-Union' END as status,
    COUNT(DISTINCT pay.concert_id) as concerts_performed,
    '$' || SUM(pay.gross_amount)::NUMERIC(10,2) as total_gross,
    '$' || SUM(pay.deductions)::NUMERIC(10,2) as total_deductions,
    '$' || SUM(pay.net_amount)::NUMERIC(10,2) as total_earnings,
    '$' || AVG(pay.net_amount)::NUMERIC(10,2) as avg_per_concert
FROM public.musician m
JOIN public.person p ON m.musician_id = p.person_id
LEFT JOIN public.payment pay ON m.musician_id = pay.musician_id
WHERE pay.payment_id IS NOT NULL
GROUP BY p.person_id, p.first_name, p.last_name, m.instrument, m.union_member
ORDER BY SUM(pay.net_amount) DESC;

-- Service Attendance vs Payment Correlation
SELECT 
    p.first_name || ' ' || p.last_name as musician,
    c.title as concert,
    cp.pay_type,
    COUNT(DISTINCT CASE WHEN a.attended THEN a.attendance_id END) as services_attended,
    COUNT(DISTINCT a.attendance_id) as total_services,
    '$' || pay.net_amount as payment_received,
    CASE 
        WHEN cp.pay_type = 'lump_sum' THEN 'Fixed payment minus deductions'
        WHEN cp.pay_type = 'per_service' THEN 'Paid per service attended'
    END as payment_model
FROM public.concert_participant cp
JOIN public.musician m ON cp.musician_id = m.musician_id
JOIN public.person p ON m.musician_id = p.person_id
JOIN public.concert c ON cp.concert_id = c.concert_id
LEFT JOIN public.attendance a ON cp.musician_id = a.musician_id 
    AND (a.concert_id = c.concert_id OR a.rehearsal_id IN (
        SELECT rehearsal_id FROM public.rehearsal WHERE concert_id = c.concert_id
    ))
LEFT JOIN public.payment pay ON cp.concert_id = pay.concert_id 
    AND cp.musician_id = pay.musician_id
GROUP BY p.person_id, p.first_name, p.last_name, c.title, cp.pay_type, pay.net_amount
HAVING COUNT(DISTINCT a.attendance_id) > 0
ORDER BY c.concert_date, pay.net_amount DESC;

-- ============================================================
-- SECTION 8: DATA QUALITY CHECKS
-- ============================================================

-- Verify All Tables Have Data
SELECT 
    'fiscal_year' as table_name,
    COUNT(*) as row_count
FROM public.fiscal_year
UNION ALL
SELECT 'season', COUNT(*) FROM public.season
UNION ALL
SELECT 'concert', COUNT(*) FROM public.concert
UNION ALL
SELECT 'person', COUNT(*) FROM public.person
UNION ALL
SELECT 'musician', COUNT(*) FROM public.musician
UNION ALL
SELECT 'piece', COUNT(*) FROM public.piece
UNION ALL
SELECT 'concert_piece', COUNT(*) FROM public.concert_piece
UNION ALL
SELECT 'rehearsal', COUNT(*) FROM public.rehearsal
UNION ALL
SELECT 'concert_participant', COUNT(*) FROM public.concert_participant
UNION ALL
SELECT 'attendance', COUNT(*) FROM public.attendance
UNION ALL
SELECT 'payment', COUNT(*) FROM public.payment
ORDER BY table_name;

-- Verify Payment Calculations (net = gross - deductions)
SELECT 
    p.first_name || ' ' || p.last_name as musician,
    c.title as concert,
    pay.gross_amount,
    pay.deductions,
    pay.net_amount,
    pay.gross_amount - pay.deductions as calculated_net,
    CASE 
        WHEN pay.net_amount = (pay.gross_amount - pay.deductions) THEN '✓ Correct'
        ELSE '✗ ERROR'
    END as validation
FROM public.payment pay
JOIN public.musician m ON pay.musician_id = m.musician_id
JOIN public.person p ON m.musician_id = p.person_id
JOIN public.concert c ON pay.concert_id = c.concert_id
ORDER BY validation DESC, c.concert_date;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- All verification queries complete.
-- Data is loaded and ready for pipeline testing!
-- ============================================================
