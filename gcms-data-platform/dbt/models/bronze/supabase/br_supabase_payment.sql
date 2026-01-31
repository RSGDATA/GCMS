/* ============================================================
   BRONZE MODEL: br_supabase_payment
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'payment']
) }}

select
    payment_id,
    concert_id,
    musician_id,
    gross_amount,
    deductions,
    net_amount,
    paid,
    payment_date,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_payment') }}
