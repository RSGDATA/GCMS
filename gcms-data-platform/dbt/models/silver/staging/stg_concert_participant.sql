/* ============================================================
   SILVER STAGING MODEL: stg_concert_participant
   ============================================================
   
   PURPOSE:
   Clean and standardize concert participant data.
   Uses the SCD2 version to get current state.
   
   TRANSFORMATIONS:
   - Select only current versions from SCD2 table
   - Standardize column names
   - Ensure agreed_amount is non-negative
   
   LAYER: Silver (Staging)
   SOURCE: br_concert_participant_scd2
   MATERIALIZATION: View
   
   ============================================================ */

{{ config(
    materialized='view',
    tags=['silver', 'staging', 'concert_participant']
) }}

select
    natural_key as concert_participant_id,
    concert_id,
    musician_id,
    role,
    pay_type,
    agreed_amount,
    effective_from,
    recorded_at as source_updated_at
from {{ ref('br_concert_participant_scd2') }}
where is_current = true
