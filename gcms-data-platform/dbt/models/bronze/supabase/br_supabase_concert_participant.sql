/* ============================================================
   BRONZE MODEL: br_supabase_concert_participant
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'concert_participant']
) }}

select
    concert_participant_id,
    concert_id,
    musician_id,
    role,
    pay_type,
    agreed_amount,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_concert_participant') }}
