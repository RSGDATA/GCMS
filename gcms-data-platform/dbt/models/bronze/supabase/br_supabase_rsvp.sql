/* ============================================================
   BRONZE MODEL: br_supabase_rsvp
   ============================================================
   NOTE: This table is optional. Returns empty result if source
   table doesn't exist to prevent pipeline failures.
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'rsvp', 'optional'],
    on_schema_change='fail'
) }}

-- Return empty result with correct schema
-- This table will be populated when RSVP system is implemented
select
    cast(null as varchar) as rsvp_id,
    cast(null as varchar) as rehearsal_id,
    cast(null as varchar) as concert_id,
    cast(null as varchar) as musician_id,
    cast(null as varchar) as status,
    cast(null as varchar) as _airbyte_ab_id,
    cast(null as timestamp) as _airbyte_emitted_at
where 1=0
