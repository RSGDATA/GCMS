-- ============================================================
-- DIM_CONCERT Query Showcase
-- Demonstrating how to use the Concert Dimension Table
-- ============================================================

-- Set context
USE DATABASE GCMS_DEV;
USE SCHEMA MOVEMENT_II_FINALE;
USE WAREHOUSE TRANSFORMING;

-- ============================================================
-- QUERY 1: Basic Concert Information
-- View all concerts with key details
-- ============================================================
SELECT 
    TITLE as concert_name,
    CONCERT_DATE,
    VENUE,
    TOTAL_BUDGET,
    SEASON_NAME,
    FISCAL_YEAR_NAME
FROM DIM_CONCERT
ORDER BY CONCERT_DATE DESC;

-- Expected Output: 2 concerts (Fall Gala Concert, Holiday Spectacular)


-- ============================================================
-- QUERY 2: Concert Financial Summary
-- Analyze concert budgets by season
-- ============================================================
SELECT 
    SEASON_NAME,
    COUNT(*) as number_of_concerts,
    SUM(TOTAL_BUDGET) as total_season_budget,
    AVG(TOTAL_BUDGET) as avg_concert_budget,
    MIN(TOTAL_BUDGET) as smallest_budget,
    MAX(TOTAL_BUDGET) as largest_budget
FROM DIM_CONCERT
GROUP BY SEASON_NAME
ORDER BY total_season_budget DESC;

-- Use Case: Budget planning and season financial analysis


-- ============================================================
-- QUERY 3: Concert Calendar View
-- Show concerts with formatted dates and venue information
-- ============================================================
SELECT 
    TITLE,
    TO_CHAR(CONCERT_DATE, 'Day, Month DD, YYYY') as formatted_date,
    VENUE,
    SEASON_NAME,
    CONCAT('$', TO_CHAR(TOTAL_BUDGET, '999,999')) as budget_display
FROM DIM_CONCERT
ORDER BY CONCERT_DATE;

-- Use Case: Creating a public-facing concert calendar


-- ============================================================
-- QUERY 4: Fiscal Year Analysis
-- Compare concerts across fiscal years
-- ============================================================
SELECT 
    FISCAL_YEAR_NAME,
    FISCAL_YEAR_START,
    FISCAL_YEAR_END,
    COUNT(*) as concerts_in_year,
    SUM(TOTAL_BUDGET) as total_year_budget,
    LISTAGG(TITLE, ', ') WITHIN GROUP (ORDER BY CONCERT_DATE) as concert_list
FROM DIM_CONCERT
GROUP BY 
    FISCAL_YEAR_NAME,
    FISCAL_YEAR_START,
    FISCAL_YEAR_END
ORDER BY FISCAL_YEAR_START DESC;

-- Use Case: Annual reporting and year-over-year comparisons


-- ============================================================
-- QUERY 5: Venue Utilization
-- Analyze which venues are used most frequently
-- ============================================================
SELECT 
    VENUE,
    COUNT(*) as number_of_concerts,
    SUM(TOTAL_BUDGET) as total_venue_budget,
    AVG(TOTAL_BUDGET) as avg_budget_per_concert,
    LISTAGG(TITLE, ' | ') WITHIN GROUP (ORDER BY CONCERT_DATE) as concerts_held
FROM DIM_CONCERT
GROUP BY VENUE
ORDER BY number_of_concerts DESC;

-- Use Case: Venue planning and contract negotiations


-- ============================================================
-- QUERY 6: Concert Details with Program Notes
-- Full concert information for program booklets
-- ============================================================
SELECT 
    TITLE,
    TO_CHAR(CONCERT_DATE, 'YYYY-MM-DD') as date,
    VENUE,
    PROGRAM_NOTES,
    SEASON_NAME,
    SEASON_DESCRIPTION
FROM DIM_CONCERT
ORDER BY CONCERT_DATE;

-- Use Case: Generating program booklets and marketing materials


-- ============================================================
-- QUERY 7: Upcoming vs Past Concerts
-- Categorize concerts by timing (using current date)
-- ============================================================
SELECT 
    CASE 
        WHEN CONCERT_DATE > CURRENT_DATE() THEN 'Upcoming'
        WHEN CONCERT_DATE = CURRENT_DATE() THEN 'Today'
        ELSE 'Past'
    END as concert_status,
    COUNT(*) as concert_count,
    SUM(TOTAL_BUDGET) as total_budget
FROM DIM_CONCERT
GROUP BY concert_status
ORDER BY 
    CASE concert_status
        WHEN 'Today' THEN 1
        WHEN 'Upcoming' THEN 2
        WHEN 'Past' THEN 3
    END;

-- Use Case: Dashboard showing concert timeline


-- ============================================================
-- QUERY 8: Season Performance Metrics
-- Detailed season analysis with concert details
-- ============================================================
SELECT 
    SEASON_NAME,
    SEASON_DESCRIPTION,
    COUNT(DISTINCT CONCERT_ID) as total_concerts,
    MIN(CONCERT_DATE) as season_start_date,
    MAX(CONCERT_DATE) as season_end_date,
    DATEDIFF(day, MIN(CONCERT_DATE), MAX(CONCERT_DATE)) as season_duration_days,
    SUM(TOTAL_BUDGET) as total_season_budget
FROM DIM_CONCERT
GROUP BY 
    SEASON_NAME,
    SEASON_DESCRIPTION
ORDER BY MIN(CONCERT_DATE) DESC;

-- Use Case: Season planning and retrospective analysis


-- ============================================================
-- QUERY 9: Concert Dimension with Payments (JOIN Example)
-- Combine concert info with payment facts
-- ============================================================
SELECT 
    c.TITLE as concert_name,
    c.CONCERT_DATE,
    c.VENUE,
    c.TOTAL_BUDGET,
    COUNT(DISTINCT p.MUSICIAN_ID) as musicians_paid,
    SUM(p.GROSS_AMOUNT) as total_musician_payments,
    SUM(p.NET_AMOUNT) as total_net_payments,
    c.TOTAL_BUDGET - COALESCE(SUM(p.GROSS_AMOUNT), 0) as remaining_budget
FROM DIM_CONCERT c
LEFT JOIN FCT_MUSICIAN_PAYMENT p 
    ON c.CONCERT_ID = p.CONCERT_ID
GROUP BY 
    c.TITLE,
    c.CONCERT_DATE,
    c.VENUE,
    c.TOTAL_BUDGET
ORDER BY c.CONCERT_DATE DESC;

-- Use Case: Budget vs actual spending analysis


-- ============================================================
-- QUERY 9B: Concert with Musician Names (Advanced JOIN)
-- Include musician names in the payment analysis
-- ============================================================
SELECT 
    c.TITLE as concert_name,
    c.CONCERT_DATE,
    c.VENUE,
    c.TOTAL_BUDGET,
    COUNT(DISTINCT p.MUSICIAN_ID) as musicians_paid,
    LISTAGG(DISTINCT m.FULL_NAME, ', ') WITHIN GROUP (ORDER BY m.FULL_NAME) as musician_names,
    SUM(p.GROSS_AMOUNT) as total_musician_payments,
    SUM(p.NET_AMOUNT) as total_net_payments,
    c.TOTAL_BUDGET - COALESCE(SUM(p.GROSS_AMOUNT), 0) as remaining_budget
FROM DIM_CONCERT c
LEFT JOIN FCT_MUSICIAN_PAYMENT p 
    ON c.CONCERT_ID = p.CONCERT_ID
LEFT JOIN DIM_MUSICIAN m
    ON p.MUSICIAN_ID = m.MUSICIAN_ID
GROUP BY 
    c.TITLE,
    c.CONCERT_DATE,
    c.VENUE,
    c.TOTAL_BUDGET
ORDER BY c.CONCERT_DATE DESC;

-- Use Case: Detailed budget analysis with musician attribution


-- ============================================================
-- QUERY 10: Concert Search by Keywords
-- Find concerts by title or program notes
-- ============================================================
SELECT 
    TITLE,
    CONCERT_DATE,
    VENUE,
    PROGRAM_NOTES
FROM DIM_CONCERT
WHERE 
    LOWER(TITLE) LIKE '%holiday%'
    OR LOWER(PROGRAM_NOTES) LIKE '%beethoven%'
ORDER BY CONCERT_DATE;

-- Use Case: Content search for website or archives


-- ============================================================
-- QUERY 11: Monthly Concert Distribution
-- See how concerts are distributed throughout the year
-- ============================================================
SELECT 
    TO_CHAR(CONCERT_DATE, 'YYYY-MM') as year_month,
    TO_CHAR(CONCERT_DATE, 'Month') as month_name,
    COUNT(*) as concerts_in_month,
    SUM(TOTAL_BUDGET) as monthly_budget,
    LISTAGG(TITLE, ', ') WITHIN GROUP (ORDER BY CONCERT_DATE) as concerts
FROM DIM_CONCERT
GROUP BY 
    TO_CHAR(CONCERT_DATE, 'YYYY-MM'),
    TO_CHAR(CONCERT_DATE, 'Month')
ORDER BY year_month;

-- Use Case: Seasonal planning and resource allocation


-- ============================================================
-- QUERY 12: Concert Dimension Freshness Check
-- Monitor when dimension was last updated
-- ============================================================
SELECT 
    TITLE,
    CONCERT_DATE,
    DIMENSION_UPDATED_AT,
    DATEDIFF(hour, DIMENSION_UPDATED_AT, CURRENT_TIMESTAMP()) as hours_since_update
FROM DIM_CONCERT
ORDER BY DIMENSION_UPDATED_AT DESC;

-- Use Case: Data quality monitoring and ETL validation


-- ============================================================
-- QUERY 13: Budget Efficiency Analysis
-- Calculate budget per concert day
-- ============================================================
SELECT 
    TITLE,
    CONCERT_DATE,
    TOTAL_BUDGET,
    DATEDIFF(day, FISCAL_YEAR_START, CONCERT_DATE) as days_into_fiscal_year,
    TOTAL_BUDGET / NULLIF(DATEDIFF(day, FISCAL_YEAR_START, CONCERT_DATE), 0) as budget_per_day_metric
FROM DIM_CONCERT
ORDER BY CONCERT_DATE;

-- Use Case: Financial planning and budget pacing


-- ============================================================
-- QUERY 14: Complete Concert Profile
-- All available information for a specific concert
-- ============================================================
SELECT 
    -- Concert Details
    CONCERT_ID,
    TITLE,
    CONCERT_DATE,
    VENUE,
    TOTAL_BUDGET,
    PROGRAM_NOTES,
    
    -- Season Context
    SEASON_NAME,
    SEASON_DESCRIPTION,
    
    -- Fiscal Year Context
    FISCAL_YEAR_NAME,
    FISCAL_YEAR_START,
    FISCAL_YEAR_END,
    
    -- Metadata
    DIMENSION_UPDATED_AT
FROM DIM_CONCERT
WHERE TITLE = 'Fall Gala Concert';

-- Use Case: Detailed concert information lookup


-- ============================================================
-- QUERY 15: Concert Comparison
-- Compare two concerts side by side
-- ============================================================
SELECT 
    'Fall Gala Concert' as comparison_type,
    TITLE,
    CONCERT_DATE,
    TOTAL_BUDGET,
    VENUE
FROM DIM_CONCERT
WHERE TITLE IN ('Fall Gala Concert', 'Holiday Spectacular')
ORDER BY CONCERT_DATE;

-- Use Case: Comparative analysis for planning


-- ============================================================
-- BONUS: Create a Concert Summary View
-- Reusable view for common concert queries
-- ============================================================
CREATE OR REPLACE VIEW VW_CONCERT_SUMMARY AS
SELECT 
    CONCERT_ID,
    TITLE,
    TO_CHAR(CONCERT_DATE, 'YYYY-MM-DD') as concert_date_formatted,
    VENUE,
    CONCAT('$', TO_CHAR(TOTAL_BUDGET, '999,999')) as budget_display,
    SEASON_NAME,
    FISCAL_YEAR_NAME,
    CASE 
        WHEN CONCERT_DATE > CURRENT_DATE() THEN 'Upcoming'
        WHEN CONCERT_DATE = CURRENT_DATE() THEN 'Today'
        ELSE 'Past'
    END as status
FROM DIM_CONCERT;

-- Use the view:
SELECT * FROM VW_CONCERT_SUMMARY ORDER BY concert_date_formatted DESC;

-- ============================================================
-- End of DIM_CONCERT Query Showcase
-- ============================================================
