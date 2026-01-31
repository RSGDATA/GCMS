/* ============================================================
   BRONZE MODEL: br_supabase_user_profile
   ============================================================
   NOTE: This table is optional. Returns empty result if source
   table doesn't exist to prevent pipeline failures.
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'user_profile', 'optional'],
    on_schema_change='fail'
) }}

-- Return empty result with correct schema
-- This table will be populated when user profile system is implemented
select
    cast(null as varchar) as user_id,
    cast(null as varchar) as person_id,
    cast(null as timestamp) as created_at,
    cast(null as varchar) as _airbyte_ab_id,
    cast(null as timestamp) as _airbyte_emitted_at
where 1=0
