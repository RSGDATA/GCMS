/* ============================================================
   BRONZE MODEL: br_supabase_musician
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'musician']
) }}

select
    musician_id,
    instrument,
    union_member,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_musician') }}
