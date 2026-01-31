/* ============================================================
   SILVER INTERMEDIATE MODEL: int_service_value
   ============================================================
   
   PURPOSE:
   Calculate per-service value for lump-sum musicians.
   This is used to calculate deductions when they miss services.
   
   BUSINESS RULE:
   - Only applies to musicians with pay_type = 'lump_sum'
   - Per-service value = agreed_amount / required_service_count
   - If no required services, per-service value = 0
   
   LAYER: Silver (Intermediate)
   SOURCE: stg_concert_participant, int_required_services
   MATERIALIZATION: View
   
   ============================================================ */

{{ config(
    materialized='view',
    tags=['silver', 'intermediate', 'business_logic', 'payroll']
) }}

select
    cp.concert_id,
    cp.musician_id,
    cp.agreed_amount,
    rs.required_service_count,
    case
        when rs.required_service_count = 0 then 0
        else cp.agreed_amount / rs.required_service_count
    end as per_service_value
from {{ ref('stg_concert_participant') }} cp
join {{ ref('int_required_services') }} rs
    on cp.concert_id = rs.concert_id
where cp.pay_type = 'lump_sum'
