/* ============================================================
   SILVER STAGING MODEL: stg_attendance
   ============================================================
   
   PURPOSE:
   Clean and standardize attendance data.
   Uses the SCD2 version to get current state.
   
   TRANSFORMATIONS:
   - Select only current versions from SCD2 table
   - Standardize column names
   - Clean data types
   
   LAYER: Silver (Staging)
   SOURCE: br_attendance_scd2
   MATERIALIZATION: View
   
   ============================================================ */

{{ config(
    materialized='view',
    tags=['silver', 'staging', 'attendance']
) }}

select
    natural_key as attendance_id,
    rehearsal_id,
    concert_id,
    musician_id,
    attended,
    check_in_time,
    effective_from,
    recorded_at as source_updated_at
from {{ ref('br_attendance_scd2') }}
where is_current = true
