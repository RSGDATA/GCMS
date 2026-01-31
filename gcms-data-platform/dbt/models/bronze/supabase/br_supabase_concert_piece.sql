/* ============================================================
   BRONZE MODEL: br_supabase_concert_piece
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'concert_piece']
) }}

select
    concert_piece_id,
    concert_id,
    piece_id,
    program_order,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_concert_piece') }}
