/* ============================================================
   SILVER INTERMEDIATE MODEL: int_attended_services
   ============================================================
   
   PURPOSE:
   Count how many REQUIRED services each musician actually attended.
   This is used to calculate deductions for lump-sum musicians
   and total pay for per-service musicians.
   
   BUSINESS RULE:
   - Only count rehearsals marked as "required = true"
   - Only count where "attended = true"
   - Join attendance to rehearsal to get the required flag
   
   LAYER: Silver (Intermediate)
   SOURCE: stg_attendance, stg_rehearsal
   MATERIALIZATION: View
   
   ============================================================ */

{{ config(
    materialized='view',
    tags=['silver', 'intermediate', 'business_logic', 'payroll']
) }}

select
    r.concert_id,
    a.musician_id,
    count(*) as attended_service_count
from {{ ref('stg_attendance') }} a
join {{ ref('stg_rehearsal') }} r
    on a.rehearsal_id = r.rehearsal_id
where r.required = true
  and a.attended = true
group by
    r.concert_id,
    a.musician_id
