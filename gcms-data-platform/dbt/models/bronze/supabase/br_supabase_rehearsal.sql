/* ============================================================
   BRONZE MODEL: br_supabase_rehearsal
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'rehearsal']
) }}

select
    rehearsal_id,
    concert_id,
    rehearsal_date,
    location,
    required,
    service_value,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_rehearsal') }}
