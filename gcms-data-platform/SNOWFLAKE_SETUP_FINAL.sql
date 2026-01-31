-- ============================================================
-- SNOWFLAKE: Create Database and Grant Permissions
-- ============================================================
-- 
-- Run this in Snowflake SQL Worksheet as ACCOUNTADMIN
-- This script uses ROLE-based permissions (Snowflake best practice)
-- 
-- ============================================================

USE ROLE ACCOUNTADMIN;

-- ============================================================
-- STEP 1: Create Warehouse (if it doesn't exist)
-- ============================================================

CREATE WAREHOUSE IF NOT EXISTS TRANSFORMING
  WITH WAREHOUSE_SIZE = 'X-SMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE
  INITIALLY_SUSPENDED = FALSE;

-- ============================================================
-- STEP 2: Create Database and Schemas
-- ============================================================

CREATE DATABASE IF NOT EXISTS GCMS_DEV;

-- Create schemas for all movements (layers) - MUST MATCH dbt_project.yml!
CREATE SCHEMA IF NOT EXISTS GCMS_DEV.MOVEMENT_I;    -- Raw data from Supabase
CREATE SCHEMA IF NOT EXISTS GCMS_DEV.MOVEMENT_II;   -- Bronze layer (dbt)
CREATE SCHEMA IF NOT EXISTS GCMS_DEV.MOVEMENT_III;  -- Silver layer (dbt)
CREATE SCHEMA IF NOT EXISTS GCMS_DEV.FINALE;        -- Gold layer (dbt)

-- ============================================================
-- STEP 2: Create Custom Role
-- ============================================================

CREATE ROLE IF NOT EXISTS GCMS_DEVELOPER;

-- ============================================================
-- STEP 3: Grant Database Permissions to Role
-- ============================================================

GRANT USAGE ON DATABASE GCMS_DEV TO ROLE GCMS_DEVELOPER;

-- ============================================================
-- STEP 4: Grant Schema Permissions to Role
-- ============================================================

-- MOVEMENT_I (Raw data)
GRANT USAGE ON SCHEMA GCMS_DEV.MOVEMENT_I TO ROLE GCMS_DEVELOPER;
GRANT CREATE TABLE ON SCHEMA GCMS_DEV.MOVEMENT_I TO ROLE GCMS_DEVELOPER;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA GCMS_DEV.MOVEMENT_I TO ROLE GCMS_DEVELOPER;
GRANT SELECT, INSERT, UPDATE, DELETE ON FUTURE TABLES IN SCHEMA GCMS_DEV.MOVEMENT_I TO ROLE GCMS_DEVELOPER;

-- MOVEMENT_II (Bronze layer)
GRANT USAGE ON SCHEMA GCMS_DEV.MOVEMENT_II TO ROLE GCMS_DEVELOPER;
GRANT CREATE TABLE ON SCHEMA GCMS_DEV.MOVEMENT_II TO ROLE GCMS_DEVELOPER;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA GCMS_DEV.MOVEMENT_II TO ROLE GCMS_DEVELOPER;
GRANT SELECT, INSERT, UPDATE, DELETE ON FUTURE TABLES IN SCHEMA GCMS_DEV.MOVEMENT_II TO ROLE GCMS_DEVELOPER;

-- MOVEMENT_III (Silver layer)
GRANT USAGE ON SCHEMA GCMS_DEV.MOVEMENT_III TO ROLE GCMS_DEVELOPER;
GRANT CREATE TABLE ON SCHEMA GCMS_DEV.MOVEMENT_III TO ROLE GCMS_DEVELOPER;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA GCMS_DEV.MOVEMENT_III TO ROLE GCMS_DEVELOPER;
GRANT SELECT, INSERT, UPDATE, DELETE ON FUTURE TABLES IN SCHEMA GCMS_DEV.MOVEMENT_III TO ROLE GCMS_DEVELOPER;

-- FINALE (Gold layer)
GRANT USAGE ON SCHEMA GCMS_DEV.FINALE TO ROLE GCMS_DEVELOPER;
GRANT CREATE TABLE ON SCHEMA GCMS_DEV.FINALE TO ROLE GCMS_DEVELOPER;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA GCMS_DEV.FINALE TO ROLE GCMS_DEVELOPER;
GRANT SELECT, INSERT, UPDATE, DELETE ON FUTURE TABLES IN SCHEMA GCMS_DEV.FINALE TO ROLE GCMS_DEVELOPER;

-- ============================================================
-- STEP 5: Grant Warehouse Usage to Role
-- ============================================================

GRANT USAGE ON WAREHOUSE TRANSFORMING TO ROLE GCMS_DEVELOPER;

-- ============================================================
-- STEP 6: Assign Role to User
-- ============================================================

GRANT ROLE GCMS_DEVELOPER TO USER ROBERTGONZALEZ;

-- ============================================================
-- STEP 7: Verify Setup
-- ============================================================

SHOW DATABASES LIKE 'GCMS_DEV';
SHOW SCHEMAS IN DATABASE GCMS_DEV;
SHOW GRANTS TO ROLE GCMS_DEVELOPER;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- ✅ Database: GCMS_DEV created
-- ✅ Schemas: MOVEMENT_I, MOVEMENT_II, MOVEMENT_III, FINALE created
-- ✅ Role: GCMS_DEVELOPER created with full permissions
-- ✅ User: ROBERTGONZALEZ assigned to GCMS_DEVELOPER role
-- 
-- NEXT STEPS:
-- 1. Make sure to use role GCMS_DEVELOPER when connecting
-- 2. Run the Airflow DAG to load and transform data
-- ============================================================
