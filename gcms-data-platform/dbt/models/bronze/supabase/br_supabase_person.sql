/* ============================================================
   BRONZE MODEL: br_supabase_person
   ============================================================ */

{{ config(
    materialized='table',
    tags=['bronze', 'raw', 'supabase', 'person']
) }}

select
    person_id,
    first_name,
    last_name,
    email,
    phone,
    role,
    _airbyte_ab_id,
    _airbyte_emitted_at
from {{ source('raw', 'supabase_person') }}
