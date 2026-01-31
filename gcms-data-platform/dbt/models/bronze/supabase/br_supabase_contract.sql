/* ============================================================
   BRONZE MODEL: br_supabase_contract
   ============================================================
   NOTE: This table is optional. Returns empty result if source
   table doesn't exist to prevent pipeline failures.
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'contract', 'optional'],
    on_schema_change='fail'
) }}

-- Return empty result with correct schema
-- This table will be populated when contract tracking is implemented
select
    cast(null as varchar) as contract_id,
    cast(null as varchar) as concert_id,
    cast(null as varchar) as musician_id,
    cast(null as timestamp) as signed_date,
    cast(null as varchar) as file_url,
    cast(null as varchar) as _airbyte_ab_id,
    cast(null as timestamp) as _airbyte_emitted_at
where 1=0
