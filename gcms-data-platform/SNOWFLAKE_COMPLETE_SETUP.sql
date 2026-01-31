-- ============================================================
-- GCMS Data Platform - Complete Snowflake Setup
-- ============================================================
-- Run this entire script in your Snowflake SQL Editor
-- This will:
-- 1. Add your public key for authentication
-- 2. Create database and warehouse
-- 3. Create schemas with symphony-themed names
-- ============================================================

-- ============================================================
-- STEP 1: Add Public Key for Key Pair Authentication
-- ============================================================

ALTER USER ACCOUNTADMIN SET RSA_PUBLIC_KEY='MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxzv2XOKujHOTB18OdYFm8jSuseZgYzr9ZWxVcp4EVskIgv1yWNjf1y6yd59MEJCxq9rt+ILvzm92E4YjJrQHUp1u6NpuBfuBHnnrE92ujCqWqUY877VjwSMVLIB7EDIvPWAHfoccUpL0p+IZATF9Nye0p6V2M7+xJTpC1Jo/9MGfrjx8l3upLUgLb6UaQIFKmX4XIf0KKcY5QOux0RAKBLVe4hVxQqgXReO05Qs1109VkS+wzCtZ+hzzgbCK+8TQdfHlaJX92/RHWtvQtqqr9bZn2cB3FTCQN5IHbcNKrHD0bpdXtzoJRewg904dfsaJNpk5AcCJEgspxKhb3fahGzi/Z8moE4o9xl6mve8KArQ3tJO6Fdomx0d3eg5YzqqojFrIqelZg9DW0VVoKMEG2JeF4e4Wrtd2oC8Ie/vTaY0NLFwNQYlcvbOqVtEPBCmOeAXX/7T9XTwRD9y3F09dFqTtMKsbvxAENKZ+KVM+BAZTBAjA8vAXA+OsrhA5WHQLFkVPjPQ0UVpK0x9s4sphRlOYijTbH7hmU/t7s3swoxByfn7uoFSy1JUF3M0pbMxhdT6cI3ddy1kaPhvlvgkwPIPBL0M14+8mnahX5ra9U8Vmlur7ewbSnkrXHVF8MxjHn1a5ypeDv8Oy1vqDxq7p1pftQGh/j6TRRZKNzVOwBfMCAwEAAQ==';

-- Verify the key was added
DESC USER ACCOUNTADMIN;

-- ============================================================
-- STEP 2: Create Warehouse
-- ============================================================

CREATE WAREHOUSE IF NOT EXISTS TRANSFORMING
    WAREHOUSE_SIZE = 'X-SMALL'
    AUTO_SUSPEND = 300
    AUTO_RESUME = TRUE
    INITIALLY_SUSPENDED = TRUE
    COMMENT = 'Warehouse for dbt transformations and data processing';

-- Set as default warehouse
USE WAREHOUSE TRANSFORMING;

-- ============================================================
-- STEP 3: Create Database
-- ============================================================

CREATE DATABASE IF NOT EXISTS GCMS_DEV
    COMMENT = 'GCMS Symphony Management Data Platform - Development';

USE DATABASE GCMS_DEV;

-- ============================================================
-- STEP 4: Create Schemas (Symphony Structure)
-- ============================================================

-- MOVEMENT_I: Raw data ingestion (replaces RAW)
CREATE SCHEMA IF NOT EXISTS MOVEMENT_I
    COMMENT = 'First Movement - Raw data ingestion from Supabase via Airbyte';

-- MOVEMENT_II: Historical tracking (replaces BRONZE)
CREATE SCHEMA IF NOT EXISTS MOVEMENT_II
    COMMENT = 'Second Movement - Historical tracking with SCD2, cleaned data';

-- MOVEMENT_III: Business logic (replaces SILVER)
CREATE SCHEMA IF NOT EXISTS MOVEMENT_III
    COMMENT = 'Third Movement - Business logic, staging, and intermediate transformations';

-- FINALE: Analytics and insights (replaces GOLD)
CREATE SCHEMA IF NOT EXISTS FINALE
    COMMENT = 'Finale - Final analytics, dimensions, facts, and insights';

-- ============================================================
-- STEP 5: Grant Permissions
-- ============================================================

GRANT USAGE ON WAREHOUSE TRANSFORMING TO ROLE ACCOUNTADMIN;
GRANT USAGE ON DATABASE GCMS_DEV TO ROLE ACCOUNTADMIN;
GRANT USAGE ON ALL SCHEMAS IN DATABASE GCMS_DEV TO ROLE ACCOUNTADMIN;
GRANT CREATE SCHEMA ON DATABASE GCMS_DEV TO ROLE ACCOUNTADMIN;
GRANT CREATE TABLE ON ALL SCHEMAS IN DATABASE GCMS_DEV TO ROLE ACCOUNTADMIN;
GRANT CREATE VIEW ON ALL SCHEMAS IN DATABASE GCMS_DEV TO ROLE ACCOUNTADMIN;

-- Grant future permissions
GRANT USAGE ON FUTURE SCHEMAS IN DATABASE GCMS_DEV TO ROLE ACCOUNTADMIN;
GRANT CREATE TABLE ON FUTURE SCHEMAS IN DATABASE GCMS_DEV TO ROLE ACCOUNTADMIN;
GRANT CREATE VIEW ON FUTURE SCHEMAS IN DATABASE GCMS_DEV TO ROLE ACCOUNTADMIN;

-- ============================================================
-- STEP 6: Verify Setup
-- ============================================================

-- Show all schemas
SHOW SCHEMAS IN DATABASE GCMS_DEV;

-- Show warehouse
SHOW WAREHOUSES LIKE 'TRANSFORMING';

-- Show current context
SELECT 
    CURRENT_DATABASE() as database,
    CURRENT_SCHEMA() as schema,
    CURRENT_WAREHOUSE() as warehouse,
    CURRENT_ROLE() as role,
    CURRENT_USER() as user;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- Your Snowflake environment is ready!
-- 
-- Created:
-- ✅ Warehouse: TRANSFORMING
-- ✅ Database: GCMS_DEV
-- ✅ Schema: MOVEMENT_I (raw data ingestion)
-- ✅ Schema: MOVEMENT_II (historical tracking)
-- ✅ Schema: MOVEMENT_III (business logic)
-- ✅ Schema: FINALE (analytics & insights)
-- ✅ Public key added for authentication
-- 
-- Next Steps:
-- 1. Configure Airbyte to sync Supabase → MOVEMENT_I
-- 2. Run dbt to transform data through all movements
-- 3. Query FINALE schema for insights!
-- ============================================================
