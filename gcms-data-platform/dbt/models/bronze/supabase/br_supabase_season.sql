/* ============================================================
   BRONZE MODEL: br_supabase_season
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'season']
) }}

select
    season_id,
    fiscal_year_id,
    name,
    description,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_season') }}
