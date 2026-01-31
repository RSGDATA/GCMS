/* ============================================================
   BRONZE MODEL: br_supabase_piece
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'piece']
) }}

select
    piece_id,
    title,
    composer,
    duration_minutes,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_piece') }}
