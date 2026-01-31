/* ============================================================
   BRONZE MODEL: br_supabase_concert
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'concert']
) }}

select
    concert_id,
    season_id,
    title,
    program_notes,
    concert_date,
    venue,
    total_budget,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_concert') }}
