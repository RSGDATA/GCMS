-- ============================================================
-- ADD MISSING DATA FOR SPRING AWAKENING AND SUMMER FESTIVAL
-- This script adds concert participants, payments, and rehearsals
-- for the 2 concerts that currently have no data
-- ============================================================

USE DATABASE GCMS_DEV;
USE SCHEMA MOVEMENT_I;

-- Get the concert IDs we need to populate
-- Spring Awakening: e94ffdc0-99f5-4a38-a78f-e4e428420615
-- Summer Festival: b31b2263-43a2-41c6-8689-280b3afbe604

-- ============================================================
-- 1. ADD CONCERT PARTICIPANTS FOR SPRING AWAKENING
-- ============================================================

-- Add 5 musicians to Spring Awakening concert
INSERT INTO SUPABASE_CONCERT_PARTICIPANT (
    concert_participant_id, concert_id, musician_id, 
    _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT
)
SELECT 
    UUID_STRING() as concert_participant_id,
    'e94ffdc0-99f5-4a38-a78f-e4e428420615' as concert_id,
    musician_id,
    'manual_insert_' || UUID_STRING() as _AIRBYTE_AB_ID,
    CURRENT_TIMESTAMP() as _AIRBYTE_EMITTED_AT,
    CURRENT_TIMESTAMP() as _AIRBYTE_NORMALIZED_AT
FROM (
    SELECT musician_id FROM BR_SUPABASE_MUSICIAN LIMIT 5
);

-- ============================================================
-- 2. ADD PAYMENTS FOR SPRING AWAKENING
-- ============================================================

INSERT INTO SUPABASE_PAYMENT (
    payment_id, musician_id, concert_id, pay_type, 
    agreed_amount, deductions, net_amount, payment_date,
    _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT
)
SELECT 
    UUID_STRING() as payment_id,
    cp.musician_id,
    cp.concert_id,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) = 1 THEN 'lump_sum'
        ELSE 'per_service'
    END as pay_type,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) = 1 THEN 500.00
        ELSE 125.00
    END as agreed_amount,
    0.00 as deductions,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) = 1 THEN 500.00
        ELSE 250.00
    END as net_amount,
    '2025-03-15'::DATE as payment_date,
    'manual_insert_' || UUID_STRING() as _AIRBYTE_AB_ID,
    CURRENT_TIMESTAMP() as _AIRBYTE_EMITTED_AT,
    CURRENT_TIMESTAMP() as _AIRBYTE_NORMALIZED_AT
FROM SUPABASE_CONCERT_PARTICIPANT cp
WHERE cp.concert_id = 'e94ffdc0-99f5-4a38-a78f-e4e428420615';

-- ============================================================
-- 3. ADD REHEARSALS FOR SPRING AWAKENING
-- ============================================================

INSERT INTO SUPABASE_REHEARSAL (
    rehearsal_id, concert_id, rehearsal_date, required, service_value,
    _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT
)
VALUES
    (UUID_STRING(), 'e94ffdc0-99f5-4a38-a78f-e4e428420615', '2025-03-13'::TIMESTAMP, TRUE, 125.00,
     'manual_insert_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    (UUID_STRING(), 'e94ffdc0-99f5-4a38-a78f-e4e428420615', '2025-03-15'::TIMESTAMP, TRUE, 125.00,
     'manual_insert_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- ============================================================
-- 4. ADD ATTENDANCE FOR SPRING AWAKENING
-- ============================================================

INSERT INTO SUPABASE_ATTENDANCE (
    attendance_id, rehearsal_id, musician_id, attended,
    _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT
)
SELECT 
    UUID_STRING() as attendance_id,
    r.rehearsal_id,
    cp.musician_id,
    TRUE as attended,
    'manual_insert_' || UUID_STRING() as _AIRBYTE_AB_ID,
    CURRENT_TIMESTAMP() as _AIRBYTE_EMITTED_AT,
    CURRENT_TIMESTAMP() as _AIRBYTE_NORMALIZED_AT
FROM SUPABASE_REHEARSAL r
CROSS JOIN SUPABASE_CONCERT_PARTICIPANT cp
WHERE r.concert_id = 'e94ffdc0-99f5-4a38-a78f-e4e428420615'
  AND cp.concert_id = 'e94ffdc0-99f5-4a38-a78f-e4e428420615';

-- ============================================================
-- 5. ADD CONCERT PARTICIPANTS FOR SUMMER FESTIVAL
-- ============================================================

INSERT INTO SUPABASE_CONCERT_PARTICIPANT (
    concert_participant_id, concert_id, musician_id,
    _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT
)
SELECT 
    UUID_STRING() as concert_participant_id,
    'b31b2263-43a2-41c6-8689-280b3afbe604' as concert_id,
    musician_id,
    'manual_insert_' || UUID_STRING() as _AIRBYTE_AB_ID,
    CURRENT_TIMESTAMP() as _AIRBYTE_EMITTED_AT,
    CURRENT_TIMESTAMP() as _AIRBYTE_NORMALIZED_AT
FROM (
    SELECT musician_id FROM BR_SUPABASE_MUSICIAN LIMIT 5 OFFSET 5
);

-- ============================================================
-- 6. ADD PAYMENTS FOR SUMMER FESTIVAL
-- ============================================================

INSERT INTO SUPABASE_PAYMENT (
    payment_id, musician_id, concert_id, pay_type,
    agreed_amount, deductions, net_amount, payment_date,
    _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT
)
SELECT 
    UUID_STRING() as payment_id,
    cp.musician_id,
    cp.concert_id,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) <= 2 THEN 'lump_sum'
        ELSE 'per_service'
    END as pay_type,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) <= 2 THEN 450.00
        ELSE 120.00
    END as agreed_amount,
    0.00 as deductions,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) <= 2 THEN 450.00
        ELSE 240.00
    END as net_amount,
    '2025-06-20'::DATE as payment_date,
    'manual_insert_' || UUID_STRING() as _AIRBYTE_AB_ID,
    CURRENT_TIMESTAMP() as _AIRBYTE_EMITTED_AT,
    CURRENT_TIMESTAMP() as _AIRBYTE_NORMALIZED_AT
FROM SUPABASE_CONCERT_PARTICIPANT cp
WHERE cp.concert_id = 'b31b2263-43a2-41c6-8689-280b3afbe604';

-- ============================================================
-- 7. ADD REHEARSALS FOR SUMMER FESTIVAL
-- ============================================================

INSERT INTO SUPABASE_REHEARSAL (
    rehearsal_id, concert_id, rehearsal_date, required, service_value,
    _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT
)
VALUES
    (UUID_STRING(), 'b31b2263-43a2-41c6-8689-280b3afbe604', '2025-06-18'::TIMESTAMP, TRUE, 120.00,
     'manual_insert_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    (UUID_STRING(), 'b31b2263-43a2-41c6-8689-280b3afbe604', '2025-06-20'::TIMESTAMP, TRUE, 120.00,
     'manual_insert_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- ============================================================
-- 8. ADD ATTENDANCE FOR SUMMER FESTIVAL
-- ============================================================

INSERT INTO SUPABASE_ATTENDANCE (
    attendance_id, rehearsal_id, musician_id, attended,
    _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT
)
SELECT 
    UUID_STRING() as attendance_id,
    r.rehearsal_id,
    cp.musician_id,
    TRUE as attended,
    'manual_insert_' || UUID_STRING() as _AIRBYTE_AB_ID,
    CURRENT_TIMESTAMP() as _AIRBYTE_EMITTED_AT,
    CURRENT_TIMESTAMP() as _AIRBYTE_NORMALIZED_AT
FROM SUPABASE_REHEARSAL r
CROSS JOIN SUPABASE_CONCERT_PARTICIPANT cp
WHERE r.concert_id = 'b31b2263-43a2-41c6-8689-280b3afbe604'
  AND cp.concert_id = 'b31b2263-43a2-41c6-8689-280b3afbe604';

-- ============================================================
-- VERIFY THE DATA WAS INSERTED
-- ============================================================

SELECT 'Concert Participants' as data_type, concert_id, COUNT(*) as count
FROM SUPABASE_CONCERT_PARTICIPANT
WHERE concert_id IN ('e94ffdc0-99f5-4a38-a78f-e4e428420615', 'b31b2263-43a2-41c6-8689-280b3afbe604')
GROUP BY concert_id

UNION ALL

SELECT 'Payments' as data_type, concert_id, COUNT(*) as count
FROM SUPABASE_PAYMENT
WHERE concert_id IN ('e94ffdc0-99f5-4a38-a78f-e4e428420615', 'b31b2263-43a2-41c6-8689-280b3afbe604')
GROUP BY concert_id

UNION ALL

SELECT 'Rehearsals' as data_type, concert_id, COUNT(*) as count
FROM SUPABASE_REHEARSAL
WHERE concert_id IN ('e94ffdc0-99f5-4a38-a78f-e4e428420615', 'b31b2263-43a2-41c6-8689-280b3afbe604')
GROUP BY concert_id

ORDER BY data_type, concert_id;
