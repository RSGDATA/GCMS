/* ============================================================
   SILVER INTERMEDIATE MODEL: int_required_services
   ============================================================
   
   PURPOSE:
   Count how many REQUIRED services exist per concert.
   This is used to calculate per-service value for lump-sum musicians.
   
   BUSINESS RULE:
   Only rehearsals marked as "required = true" count toward
   the service count for pay calculations.
   
   LAYER: Silver (Intermediate)
   SOURCE: stg_rehearsal
   MATERIALIZATION: View
   
   ============================================================ */

{{ config(
    materialized='view',
    tags=['silver', 'intermediate', 'business_logic', 'payroll']
) }}

select
    concert_id,
    count(*) as required_service_count
from {{ ref('stg_rehearsal') }}
where required = true
group by concert_id
