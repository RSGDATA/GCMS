/* ============================================================
   SILVER STAGING MODEL: stg_piece
   ============================================================
   Purpose: Clean and standardize piece data from Bronze layer
   ============================================================ */

{{ config(
    materialized='view',
    tags=['silver', 'staging', 'piece']
) }}

select
    piece_id,
    title,
    composer,
    duration_minutes,
    _airbyte_emitted_at as source_timestamp
from {{ ref('br_supabase_piece') }}
