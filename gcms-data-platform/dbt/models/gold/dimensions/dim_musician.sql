/* ============================================================
   GOLD DIMENSION MODEL: dim_musician
   ============================================================
   
   PURPOSE:
   Reporting-friendly view of musicians with their details.
   Denormalized for easy consumption by BI tools.
   
   LAYER: Gold (Dimension)
   SOURCES: br_supabase_musician, br_supabase_person
   MATERIALIZATION: Table
   
   ============================================================ */

{{ config(
    materialized='table',
    tags=['gold', 'dimension', 'musician', 'reporting']
) }}

select
    m.musician_id,
    p.first_name,
    p.last_name,
    p.first_name || ' ' || p.last_name as full_name,
    m.instrument,
    m.union_member,
    p.email,
    p.phone,
    p.role,
    current_timestamp() as dimension_updated_at
from {{ ref('br_supabase_musician') }} m
join {{ ref('br_supabase_person') }} p
    on m.musician_id = p.person_id

/* ============================================================
   EXAMPLE QUERIES
   ============================================================
   
   -- All musicians by instrument
   SELECT instrument, COUNT(*) as musician_count
   FROM gold.dim_musician
   GROUP BY instrument
   ORDER BY musician_count DESC;
   
   -- Union vs non-union musicians
   SELECT 
       union_member,
       COUNT(*) as count
   FROM gold.dim_musician
   GROUP BY union_member;
   
   -- Join with payments for reporting
   SELECT 
       m.full_name,
       m.instrument,
       m.union_member,
       p.net_amount
   FROM gold.dim_musician m
   JOIN gold.fct_musician_payment p
       ON m.musician_id = p.musician_id;
   
   ============================================================ */
