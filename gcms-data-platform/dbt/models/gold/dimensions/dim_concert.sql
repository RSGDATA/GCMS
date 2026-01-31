/* ============================================================
   GOLD DIMENSION MODEL: dim_concert
   ============================================================
   
   PURPOSE:
   Reporting-friendly view of concerts with season and fiscal year.
   Denormalized for easy consumption by BI tools.
   
   LAYER: Gold (Dimension)
   SOURCES: br_supabase_concert, br_supabase_season, br_supabase_fiscal_year
   MATERIALIZATION: Table
   
   ============================================================ */

{{ config(
    materialized='table',
    tags=['gold', 'dimension', 'concert', 'reporting']
) }}

select
    c.concert_id,
    c.title,
    c.concert_date,
    c.venue,
    c.total_budget,
    c.program_notes,
    s.season_id,
    s.name as season_name,
    s.description as season_description,
    fy.fiscal_year_id,
    fy.name as fiscal_year_name,
    fy.start_date as fiscal_year_start,
    fy.end_date as fiscal_year_end,
    current_timestamp() as dimension_updated_at
from {{ ref('br_supabase_concert') }} c
join {{ ref('br_supabase_season') }} s
    on c.season_id = s.season_id
join {{ ref('br_supabase_fiscal_year') }} fy
    on s.fiscal_year_id = fy.fiscal_year_id

/* ============================================================
   EXAMPLE QUERIES
   ============================================================
   
   -- Concerts by fiscal year
   SELECT 
       fiscal_year_name,
       COUNT(*) as concert_count,
       SUM(total_budget) as total_budget
   FROM gold.dim_concert
   GROUP BY fiscal_year_name
   ORDER BY fiscal_year_name;
   
   -- Concerts by season
   SELECT 
       season_name,
       COUNT(*) as concert_count
   FROM gold.dim_concert
   GROUP BY season_name;
   
   -- Join with payments for concert-level reporting
   SELECT 
       c.title,
       c.concert_date,
       c.season_name,
       c.fiscal_year_name,
       COUNT(p.musician_id) as musician_count,
       SUM(p.net_amount) as total_payroll,
       c.total_budget,
       c.total_budget - SUM(p.net_amount) as budget_remaining
   FROM gold.dim_concert c
   LEFT JOIN gold.fct_musician_payment p
       ON c.concert_id = p.concert_id
   GROUP BY 
       c.concert_id,
       c.title,
       c.concert_date,
       c.season_name,
       c.fiscal_year_name,
       c.total_budget;
   
   -- Upcoming concerts
   SELECT *
   FROM gold.dim_concert
   WHERE concert_date >= CURRENT_DATE
   ORDER BY concert_date;
   
   ============================================================ */
