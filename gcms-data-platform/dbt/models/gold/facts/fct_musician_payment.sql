/* ============================================================
   GOLD FACT MODEL: fct_musician_payment
   ============================================================
   
   PURPOSE:
   The FINAL authoritative pay calculation for musicians.
   This is the single source of truth for payroll.
   
   BUSINESS RULES:
   
   1. LUMP SUM Musicians:
      - Gross = agreed_amount (regardless of attendance)
      - Deductions = (missed_services * per_service_value)
      - Net = Gross - Deductions
   
   2. PER SERVICE Musicians:
      - Gross = attended_services * agreed_amount
      - Deductions = 0 (they only get paid for what they attend)
      - Net = Gross
   
   CHARACTERISTICS:
   - Recomputable (deterministic from source data)
   - Auditable (all logic visible in SQL)
   - Version-controlled (changes tracked in git)
   - Testable (dbt tests ensure correctness)
   
   LAYER: Gold (Analytics/Presentation)
   SOURCES: stg_concert_participant, int_attended_services, int_required_services
   MATERIALIZATION: Table (for performance)
   
   ============================================================ */

{{ config(
    materialized='table',
    tags=['gold', 'fact', 'payroll', 'critical']
) }}

with base as (
    /* --------------------------------------------------------
       BASE DATA
       --------------------------------------------------------
       Join concert participants with their attendance counts
       -------------------------------------------------------- */
    select
        cp.concert_id,
        cp.musician_id,
        cp.pay_type,
        cp.agreed_amount,
        coalesce(att.attended_service_count, 0) as attended_services,
        coalesce(req.required_service_count, 0) as required_services
    from {{ ref('stg_concert_participant') }} cp
    left join {{ ref('int_attended_services') }} att
        on cp.concert_id = att.concert_id
       and cp.musician_id = att.musician_id
    left join {{ ref('int_required_services') }} req
        on cp.concert_id = req.concert_id
),

calculated as (
    /* --------------------------------------------------------
       PAY CALCULATION
       --------------------------------------------------------
       Apply business rules based on pay_type
       -------------------------------------------------------- */
    select
        concert_id,
        musician_id,
        pay_type,
        agreed_amount,
        attended_services,
        required_services,
        
        /* GROSS PAY CALCULATION */
        case
            when pay_type = 'lump_sum' then
                agreed_amount
            when pay_type = 'per_service' then
                attended_services * agreed_amount
            else 0
        end as gross_amount,
        
        /* DEDUCTIONS CALCULATION */
        case
            when pay_type = 'lump_sum' then
                -- Deduct for missed required services
                (required_services - attended_services) 
                * (agreed_amount / nullif(required_services, 0))
            when pay_type = 'per_service' then
                -- No deductions for per-service musicians
                0
            else 0
        end as deductions
        
    from base
)

/* --------------------------------------------------------
   FINAL OUTPUT
   --------------------------------------------------------
   Calculate net amount and add metadata
   -------------------------------------------------------- */
select
    {{ dbt_utils.generate_surrogate_key(['concert_id', 'musician_id']) }} as payment_key,
    concert_id,
    musician_id,
    pay_type,
    agreed_amount,
    attended_services,
    required_services,
    gross_amount,
    coalesce(deductions, 0) as deductions,
    gross_amount - coalesce(deductions, 0) as net_amount,
    current_timestamp() as calculated_at
from calculated

/* ============================================================
   EXAMPLE QUERIES
   ============================================================
   
   -- Total payroll for a concert
   SELECT 
       concert_id,
       SUM(net_amount) as total_payroll
   FROM gold.fct_musician_payment
   GROUP BY concert_id;
   
   -- Musicians with deductions
   SELECT *
   FROM gold.fct_musician_payment
   WHERE deductions > 0
   ORDER BY deductions DESC;
   
   -- Per-service vs lump-sum comparison
   SELECT 
       pay_type,
       COUNT(*) as musician_count,
       AVG(net_amount) as avg_payment,
       SUM(net_amount) as total_payment
   FROM gold.fct_musician_payment
   GROUP BY pay_type;
   
   -- Attendance rate impact on pay
   SELECT 
       musician_id,
       attended_services,
       required_services,
       ROUND(attended_services::FLOAT / NULLIF(required_services, 0) * 100, 2) as attendance_rate,
       net_amount
   FROM gold.fct_musician_payment
   WHERE pay_type = 'lump_sum'
   ORDER BY attendance_rate;
   
   ============================================================ */
