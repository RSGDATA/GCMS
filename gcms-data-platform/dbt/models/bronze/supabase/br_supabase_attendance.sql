/* ============================================================
   BRONZE MODEL: br_supabase_attendance
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'attendance']
) }}

select
    attendance_id,
    rehearsal_id,
    concert_id,
    musician_id,
    attended,
    check_in_time,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_attendance') }}
