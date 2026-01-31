/* ============================================================
   SILVER STAGING MODEL: stg_rehearsal
   ============================================================
   
   PURPOSE:
   Clean and standardize rehearsal data.
   No business logic - just cleaning and type standardization.
   
   TRANSFORMATIONS:
   - Coalesce service_value to 0 (handle nulls)
   - Standardize column names
   - Cast types appropriately
   
   LAYER: Silver (Staging)
   SOURCE: br_supabase_rehearsal
   MATERIALIZATION: View
   
   ============================================================ */

{{ config(
    materialized='view',
    tags=['silver', 'staging', 'rehearsal']
) }}

select
    rehearsal_id,
    concert_id,
    rehearsal_date,
    location,
    required,
    coalesce(service_value, 0) as service_value,
    _airbyte_emitted_at as source_updated_at
from {{ ref('br_supabase_rehearsal') }}
