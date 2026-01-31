-- ============================================================
-- SNOWFLAKE COST ANALYSIS FOR GCMS DATA PLATFORM
-- Daily Pipeline Cost Estimation
-- ============================================================
-- 
-- Purpose: Calculate actual costs for running the dbt pipeline
-- Use Case: Budget presentation and cost forecasting
-- Run these queries in Snowflake to get real cost data
-- ============================================================

-- ============================================================
-- 1. COMPUTE COST - Last 7 Days of Pipeline Runs
-- ============================================================
-- Shows: How much compute (credits) the pipeline uses per run


--### 🎯 How to Use for Presentation:

--1. __Run Query #8__ in Snowflake for executive summary
--2. __Run Query #4__ for detailed monthly projection
--3. __Run Query #3__ for storage breakdown

SELECT 
    DATE_TRUNC('day', start_time) as run_date,
    warehouse_name,
    COUNT(DISTINCT query_id) as total_queries,
    SUM(execution_time) / 1000 as total_execution_seconds,
    SUM(execution_time) / 1000 / 3600 as total_execution_hours,
    
    -- Credits used (assumes X-Small warehouse = 1 credit/hour)
    -- Adjust multiplier based on your warehouse size:
    -- X-Small=1, Small=2, Medium=4, Large=8, X-Large=16
    (SUM(execution_time) / 1000 / 3600) * 1 as credits_used,
    
    -- Cost (Standard Edition = $2 per credit, adjust for your edition)
    (SUM(execution_time) / 1000 / 3600) * 1 * 2 as estimated_cost_usd,
    
    -- Average per run
    AVG(execution_time) / 1000 as avg_query_seconds
    
FROM snowflake.account_usage.query_history
WHERE 1=1
    AND start_time >= DATEADD(day, -7, CURRENT_TIMESTAMP())
    AND warehouse_name = 'TRANSFORMING'  -- Your dbt warehouse
    AND query_text ILIKE '%dbt%'  -- Filter for dbt queries
    AND execution_status = 'SUCCESS'
GROUP BY 1, 2
ORDER BY 1 DESC;


-- ============================================================
-- 2. DETAILED PIPELINE COST - Today's Run
-- ============================================================
-- Shows: Breakdown of each dbt model's compute cost

SELECT 
    query_text,
    execution_time / 1000 as execution_seconds,
    (execution_time / 1000 / 3600) * 1 * 2 as cost_usd,  -- X-Small @ $2/credit
    bytes_scanned / 1024 / 1024 / 1024 as gb_scanned,
    rows_produced,
    start_time
FROM snowflake.account_usage.query_history
WHERE 1=1
    AND start_time >= DATEADD(day, -1, CURRENT_TIMESTAMP())
    AND warehouse_name = 'TRANSFORMING'
    AND query_text ILIKE '%dbt%'
    AND execution_status = 'SUCCESS'
ORDER BY execution_time DESC
LIMIT 50;


-- ============================================================
-- 3. STORAGE COST - Current Database Size
-- ============================================================
-- Shows: How much storage your data warehouse uses

SELECT 
    table_catalog as database_name,
    table_schema as schema_name,
    
    -- Storage metrics
    SUM(active_bytes) / 1024 / 1024 / 1024 as active_storage_gb,
    SUM(time_travel_bytes) / 1024 / 1024 / 1024 as time_travel_storage_gb,
    SUM(failsafe_bytes) / 1024 / 1024 / 1024 as failsafe_storage_gb,
    
    -- Total storage
    (SUM(active_bytes) + SUM(time_travel_bytes) + SUM(failsafe_bytes)) 
        / 1024 / 1024 / 1024 as total_storage_gb,
    
    -- Monthly cost (Snowflake storage = $23/TB/month on-demand, $40/TB/month capacity)
    -- Using on-demand pricing
    ((SUM(active_bytes) + SUM(time_travel_bytes) + SUM(failsafe_bytes)) 
        / 1024 / 1024 / 1024 / 1024) * 23 as monthly_storage_cost_usd,
    
    -- Row counts
    SUM(row_count) as total_rows
    
FROM snowflake.account_usage.table_storage_metrics
WHERE table_catalog = 'GCMS_DEV'
    AND deleted IS NULL  -- Only active tables
GROUP BY 1, 2
ORDER BY total_storage_gb DESC;


-- ============================================================
-- 4. MONTHLY COST PROJECTION
-- ============================================================
-- Shows: Estimated monthly costs based on current usage

WITH daily_compute AS (
    SELECT 
        AVG(SUM(execution_time) / 1000 / 3600) as avg_daily_hours
    FROM snowflake.account_usage.query_history
    WHERE start_time >= DATEADD(day, -7, CURRENT_TIMESTAMP())
        AND warehouse_name = 'TRANSFORMING'
        AND query_text ILIKE '%dbt%'
        AND execution_status = 'SUCCESS'
    GROUP BY DATE_TRUNC('day', start_time)
),
current_storage AS (
    SELECT 
        SUM(active_bytes + time_travel_bytes + failsafe_bytes) 
            / 1024 / 1024 / 1024 / 1024 as total_tb
    FROM snowflake.account_usage.table_storage_metrics
    WHERE table_catalog = 'GCMS_DEV'
        AND deleted IS NULL
)
SELECT 
    -- Compute costs (daily pipeline runs)
    dc.avg_daily_hours as avg_daily_compute_hours,
    dc.avg_daily_hours * 30 as monthly_compute_hours,
    (dc.avg_daily_hours * 30) * 1 as monthly_credits,  -- X-Small warehouse
    (dc.avg_daily_hours * 30) * 1 * 2 as monthly_compute_cost_usd,  -- $2/credit
    
    -- Storage costs
    cs.total_tb as current_storage_tb,
    cs.total_tb * 23 as monthly_storage_cost_usd,  -- $23/TB/month
    
    -- Total monthly cost
    ((dc.avg_daily_hours * 30) * 1 * 2) + (cs.total_tb * 23) as total_monthly_cost_usd,
    
    -- Annual projection
    (((dc.avg_daily_hours * 30) * 1 * 2) + (cs.total_tb * 23)) * 12 as annual_cost_usd
    
FROM daily_compute dc
CROSS JOIN current_storage cs;


-- ============================================================
-- 5. COST BY LAYER - Which layer costs the most?
-- ============================================================
-- Shows: Compute cost breakdown by Bronze/Silver/Gold layers

SELECT 
    CASE 
        WHEN query_text ILIKE '%MOVEMENT_II%' THEN 'Bronze Layer'
        WHEN query_text ILIKE '%MOVEMENT_III%' THEN 'Silver Layer'
        WHEN query_text ILIKE '%FINALE%' THEN 'Gold Layer'
        ELSE 'Other'
    END as layer,
    
    COUNT(DISTINCT query_id) as query_count,
    SUM(execution_time) / 1000 / 3600 as total_hours,
    (SUM(execution_time) / 1000 / 3600) * 1 * 2 as cost_usd,
    AVG(execution_time) / 1000 as avg_seconds_per_query
    
FROM snowflake.account_usage.query_history
WHERE start_time >= DATEADD(day, -7, CURRENT_TIMESTAMP())
    AND warehouse_name = 'TRANSFORMING'
    AND query_text ILIKE '%dbt%'
    AND execution_status = 'SUCCESS'
GROUP BY 1
ORDER BY cost_usd DESC;


-- ============================================================
-- 6. STORAGE BY LAYER - Which layer uses the most storage?
-- ============================================================

SELECT 
    table_schema as layer,
    COUNT(DISTINCT table_name) as table_count,
    SUM(active_bytes) / 1024 / 1024 / 1024 as storage_gb,
    (SUM(active_bytes) / 1024 / 1024 / 1024 / 1024) * 23 as monthly_cost_usd,
    SUM(row_count) as total_rows,
    AVG(row_count) as avg_rows_per_table
    
FROM snowflake.account_usage.table_storage_metrics
WHERE table_catalog = 'GCMS_DEV'
    AND table_schema IN ('MOVEMENT_I', 'MOVEMENT_II', 'MOVEMENT_III', 'FINALE')
    AND deleted IS NULL
GROUP BY 1
ORDER BY storage_gb DESC;


-- ============================================================
-- 7. COST COMPARISON - Different Warehouse Sizes
-- ============================================================
-- Shows: How much you'd pay with different warehouse sizes

WITH base_usage AS (
    SELECT 
        SUM(execution_time) / 1000 / 3600 as total_hours_per_day
    FROM snowflake.account_usage.query_history
    WHERE start_time >= DATEADD(day, -1, CURRENT_TIMESTAMP())
        AND warehouse_name = 'TRANSFORMING'
        AND query_text ILIKE '%dbt%'
        AND execution_status = 'SUCCESS'
)
SELECT 
    'X-Small' as warehouse_size,
    1 as credits_per_hour,
    bu.total_hours_per_day * 1 as daily_credits,
    bu.total_hours_per_day * 1 * 2 as daily_cost_usd,
    bu.total_hours_per_day * 1 * 2 * 30 as monthly_cost_usd
FROM base_usage bu

UNION ALL

SELECT 
    'Small' as warehouse_size,
    2 as credits_per_hour,
    bu.total_hours_per_day * 2 as daily_credits,
    bu.total_hours_per_day * 2 * 2 as daily_cost_usd,
    bu.total_hours_per_day * 2 * 2 * 30 as monthly_cost_usd
FROM base_usage bu

UNION ALL

SELECT 
    'Medium' as warehouse_size,
    4 as credits_per_hour,
    bu.total_hours_per_day * 4 as daily_credits,
    bu.total_hours_per_day * 4 * 2 as daily_cost_usd,
    bu.total_hours_per_day * 4 * 2 * 30 as monthly_cost_usd
FROM base_usage bu

ORDER BY credits_per_hour;


-- ============================================================
-- 8. SIMPLE SUMMARY FOR PRESENTATION
-- ============================================================
-- Shows: One-line summary for executives

SELECT 
    'GCMS Data Platform - Daily Cost' as metric,
    ROUND((SUM(execution_time) / 1000 / 3600) * 1 * 2, 2) as cost_per_run_usd,
    ROUND((SUM(execution_time) / 1000 / 3600) * 1 * 2 * 30, 2) as monthly_compute_usd,
    ROUND((SELECT SUM(active_bytes) / 1024 / 1024 / 1024 / 1024 * 23 
           FROM snowflake.account_usage.table_storage_metrics 
           WHERE table_catalog = 'GCMS_DEV' AND deleted IS NULL), 2) as monthly_storage_usd,
    ROUND((SUM(execution_time) / 1000 / 3600) * 1 * 2 * 30 + 
          (SELECT SUM(active_bytes) / 1024 / 1024 / 1024 / 1024 * 23 
           FROM snowflake.account_usage.table_storage_metrics 
           WHERE table_catalog = 'GCMS_DEV' AND deleted IS NULL), 2) as total_monthly_usd
FROM snowflake.account_usage.query_history
WHERE start_time >= DATEADD(day, -1, CURRENT_TIMESTAMP())
    AND warehouse_name = 'TRANSFORMING'
    AND query_text ILIKE '%dbt%'
    AND execution_status = 'SUCCESS';


-- ============================================================
-- NOTES FOR PRESENTATION:
-- ============================================================
-- 
-- Snowflake Pricing (Standard Edition):
-- - Compute: $2 per credit (varies by region/edition)
-- - Storage: $23 per TB per month (on-demand)
-- - X-Small Warehouse: 1 credit per hour
-- 
-- Typical Small Data Platform Costs:
-- - Compute: $5-50/month (depends on data volume)
-- - Storage: $1-10/month (for small datasets)
-- - Total: $10-100/month for small operations
-- 
-- Your pipeline is likely on the LOW end since:
-- - Small data volume
-- - Runs once daily
-- - Uses X-Small warehouse
-- - Minimal storage footprint
-- 
-- ============================================================
