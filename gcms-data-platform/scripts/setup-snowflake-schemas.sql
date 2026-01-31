-- ============================================================
-- Snowflake Schema Setup Script
-- ============================================================
-- 
-- PURPOSE:
-- Create all required schemas for the GCMS data platform
--
-- USAGE:
-- 1. Log into Snowflake Web UI
-- 2. Open a new Worksheet
-- 3. Copy and paste this entire script
-- 4. Update DATABASE_NAME if different from GCMS_DEV
-- 5. Run the script
--
-- OR via SnowSQL:
-- snowsql -a your_account -u your_username -f scripts/setup-snowflake-schemas.sql
--
-- ============================================================

-- Set context
USE ROLE ACCOUNTADMIN;  -- Or your admin role

-- ============================================================
-- Step 1: Create Database (if needed)
-- ============================================================

CREATE DATABASE IF NOT EXISTS GCMS_DEV
  COMMENT = 'GCMS Data Platform - Development Environment';

USE DATABASE GCMS_DEV;

-- ============================================================
-- Step 2: Create Schemas
-- ============================================================

-- RAW Schema: For Airbyte ingestion
CREATE SCHEMA IF NOT EXISTS RAW
  COMMENT = 'Raw data from Airbyte ingestion - exact copy of Supabase tables';

-- BRONZE Schema: For dbt Bronze layer
CREATE SCHEMA IF NOT EXISTS BRONZE
  COMMENT = 'Bronze layer - raw mirrors and SCD2 history tables with bi-temporal tracking';

-- SILVER Schema: For dbt Silver layer
CREATE SCHEMA IF NOT EXISTS SILVER
  COMMENT = 'Silver layer - staging and intermediate models with business rules applied';

-- GOLD Schema: For dbt Gold layer
CREATE SCHEMA IF NOT EXISTS GOLD
  COMMENT = 'Gold layer - facts and dimensions optimized for analytics and reporting';

-- ============================================================
-- Step 3: Verify Schemas Created
-- ============================================================

SHOW SCHEMAS IN DATABASE GCMS_DEV;

-- You should see:
-- RAW, BRONZE, SILVER, GOLD (plus INFORMATION_SCHEMA and PUBLIC)

-- ============================================================
-- Step 4: Create Roles (Optional but Recommended)
-- ============================================================

-- Create transformer role for dbt
CREATE ROLE IF NOT EXISTS TRANSFORMER
  COMMENT = 'Role for dbt transformations';

-- Create reader role for analytics
CREATE ROLE IF NOT EXISTS READER
  COMMENT = 'Read-only access to Gold layer';

-- ============================================================
-- Step 5: Grant Permissions to TRANSFORMER Role
-- ============================================================

-- Database permissions
GRANT USAGE ON DATABASE GCMS_DEV TO ROLE TRANSFORMER;

-- Schema permissions
GRANT USAGE ON SCHEMA RAW TO ROLE TRANSFORMER;
GRANT USAGE ON SCHEMA BRONZE TO ROLE TRANSFORMER;
GRANT USAGE ON SCHEMA SILVER TO ROLE TRANSFORMER;
GRANT USAGE ON SCHEMA GOLD TO ROLE TRANSFORMER;

-- Table creation permissions
GRANT CREATE TABLE ON SCHEMA RAW TO ROLE TRANSFORMER;
GRANT CREATE TABLE ON SCHEMA BRONZE TO ROLE TRANSFORMER;
GRANT CREATE TABLE ON SCHEMA SILVER TO ROLE TRANSFORMER;
GRANT CREATE TABLE ON SCHEMA GOLD TO ROLE TRANSFORMER;

-- View creation permissions
GRANT CREATE VIEW ON SCHEMA BRONZE TO ROLE TRANSFORMER;
GRANT CREATE VIEW ON SCHEMA SILVER TO ROLE TRANSFORMER;
GRANT CREATE VIEW ON SCHEMA GOLD TO ROLE TRANSFORMER;

-- Future grants (for tables created later)
GRANT SELECT ON FUTURE TABLES IN SCHEMA RAW TO ROLE TRANSFORMER;
GRANT SELECT, INSERT, UPDATE, DELETE ON FUTURE TABLES IN SCHEMA BRONZE TO ROLE TRANSFORMER;
GRANT SELECT, INSERT, UPDATE, DELETE ON FUTURE TABLES IN SCHEMA SILVER TO ROLE TRANSFORMER;
GRANT SELECT, INSERT, UPDATE, DELETE ON FUTURE TABLES IN SCHEMA GOLD TO ROLE TRANSFORMER;

-- ============================================================
-- Step 6: Grant Permissions to READER Role
-- ============================================================

-- Database and schema permissions
GRANT USAGE ON DATABASE GCMS_DEV TO ROLE READER;
GRANT USAGE ON SCHEMA GOLD TO ROLE READER;

-- Read-only access to Gold layer
GRANT SELECT ON ALL TABLES IN SCHEMA GOLD TO ROLE READER;
GRANT SELECT ON ALL VIEWS IN SCHEMA GOLD TO ROLE READER;
GRANT SELECT ON FUTURE TABLES IN SCHEMA GOLD TO ROLE READER;
GRANT SELECT ON FUTURE VIEWS IN SCHEMA GOLD TO ROLE READER;

-- ============================================================
-- Step 7: Assign Roles to Users
-- ============================================================

-- Replace 'YOUR_USERNAME' with your actual Snowflake username
-- GRANT ROLE TRANSFORMER TO USER YOUR_USERNAME;
-- GRANT ROLE READER TO USER YOUR_USERNAME;

-- Example:
-- GRANT ROLE TRANSFORMER TO USER ROBERT_GONZALEZ;
-- GRANT ROLE READER TO USER ANALYTICS_USER;

-- ============================================================
-- Step 8: Create Warehouse (if needed)
-- ============================================================

CREATE WAREHOUSE IF NOT EXISTS TRANSFORMING
  WAREHOUSE_SIZE = 'X-SMALL'
  AUTO_SUSPEND = 300  -- Suspend after 5 minutes of inactivity
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = FALSE
  COMMENT = 'Warehouse for dbt transformations';

-- Grant warehouse usage
GRANT USAGE ON WAREHOUSE TRANSFORMING TO ROLE TRANSFORMER;
GRANT USAGE ON WAREHOUSE TRANSFORMING TO ROLE READER;

-- ============================================================
-- Step 9: Verification Queries
-- ============================================================

-- Check schemas
SHOW SCHEMAS IN DATABASE GCMS_DEV;

-- Check roles
SHOW ROLES LIKE 'TRANSFORMER';
SHOW ROLES LIKE 'READER';

-- Check warehouse
SHOW WAREHOUSES LIKE 'TRANSFORMING';

-- Check grants for TRANSFORMER role
SHOW GRANTS TO ROLE TRANSFORMER;

-- Check grants for READER role
SHOW GRANTS TO ROLE READER;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- 
-- Your Snowflake environment is now ready for:
-- 1. Airbyte to load data into RAW schema
-- 2. dbt to transform data through BRONZE → SILVER → GOLD
-- 3. Analytics users to query GOLD layer
--
-- Next steps:
-- 1. Update your .env file with these credentials
-- 2. Update dbt/profiles.yml with Snowflake connection
-- 3. Run: dbt debug (to test connection)
-- 4. Run: dbt run (to build models)
--
-- ============================================================
