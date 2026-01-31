/* ============================================================
   BRONZE MODEL: br_supabase_fiscal_year
   ============================================================
   
   PURPOSE:
   Raw mirror of Supabase fiscal_year table.
   No transformations, no business logic.
   
   LAYER: Bronze (Raw Truth)
   SOURCE: raw.supabase_fiscal_year (Airbyte)
   MATERIALIZATION: Table
   
   PRINCIPLE:
   This is the immutable source of truth.
   Changes in Supabase are reflected here exactly as received.
   
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'fiscal_year']
) }}

select
    fiscal_year_id,
    name,
    start_date,
    end_date,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_fiscal_year') }}
