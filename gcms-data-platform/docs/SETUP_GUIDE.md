# GCMS Data Platform - Setup Guide

**Complete guide for connecting to your Supabase and Snowflake instances**

---

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Supabase Project**
  - Project created at supabase.com
  - Project URL and API keys available
  - Database connection string accessible
  
- [ ] **Snowflake Account**
  - Account created and accessible
  - Username and password
  - Warehouse created (or permission to create one)
  - Database created (or permission to create one)

- [ ] **Local Tools**
  - Docker Desktop installed and running
  - Supabase CLI installed: `brew install supabase/tap/supabase`
  - dbt installed at: `/Users/robertgonzalez/Library/Python/3.9/bin/dbt`
  - Git installed

- [ ] **Project Files**
  - Repository cloned to: `/Users/robertgonzalez/Projects/GCMS/gcms-data-platform`

---

## 🚀 Setup Path Options

Choose your setup path based on your needs:

### **Path A: Simple (dbt Only)** ⭐ Recommended for First Time
- Fastest way to see results
- Test dbt transformations locally
- No Docker/Airflow complexity
- Perfect for development and testing

### **Path B: Full Stack (Docker + Airflow)**
- Complete production-like environment
- Automated orchestration
- Requires more setup time
- Best for production deployment

---

## 🎯 Path A: Simple Setup (dbt Only)

### Step 1: Gather Your Credentials

#### From Supabase Dashboard:

1. **Go to your Supabase project**
2. **Settings → API**
   - Copy `URL` (e.g., `https://xxxxx.supabase.co`)
   - Copy `service_role` key (NOT the anon key)
3. **Settings → Database → Connection String**
   - Copy the connection string
   - Format: `postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres`

#### From Snowflake:

1. **Account Identifier**
   - Format: `account.region.cloud` (e.g., `xy12345.us-east-1`)
   - Find in: Account → Account Locator
2. **Credentials**
   - Your username
   - Your password
3. **Warehouse Name**
   - Existing warehouse or create new: `TRANSFORMING`
4. **Database Name**
   - Existing database or create new: `GCMS_DEV`

### Step 2: Create Your .env File

```bash
# Navigate to project
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform

# Copy template
cp .env.example .env

# Edit with your credentials
code .env  # or nano .env, vim .env, etc.
```

**Fill in these critical values in `.env`:**

```bash
# ============================================================
# SUPABASE CONFIGURATION
# ============================================================
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_CONNECTION_STRING=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres

# ============================================================
# SNOWFLAKE CONFIGURATION
# ============================================================
SNOWFLAKE_ACCOUNT=xy12345.us-east-1
SNOWFLAKE_USER=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=TRANSFORMING
SNOWFLAKE_DATABASE=GCMS_DEV
SNOWFLAKE_ROLE=ACCOUNTADMIN  # or your role

# Schema names (keep these as-is)
SNOWFLAKE_RAW_SCHEMA=raw
SNOWFLAKE_BRONZE_SCHEMA=bronze
SNOWFLAKE_SILVER_SCHEMA=silver
SNOWFLAKE_GOLD_SCHEMA=gold
```

### Step 3: Apply Supabase Migrations

Your Supabase database needs the schema (tables, relationships, etc.):

```bash
# Navigate to supabase directory
cd supabase

# Link to your project (replace with your project ref)
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push

# You should see:
# ✓ Applied migration 20250101000001_extensions.sql
# ✓ Applied migration 20250101000002_core_foundation.sql
# ✓ Applied migration 20250101000003_music_rehearsals.sql
# ✓ Applied migration 20250101000004_participation_payments.sql
```

**Verify in Supabase Studio:**
```bash
# Open your Supabase project
open https://supabase.com/dashboard/project/your-project-ref

# Check Table Editor - you should see:
# - fiscal_year, season, concert
# - person, musician, user_profile
# - piece, concert_piece, rehearsal
# - concert_participant, rsvp, attendance
# - payment, contract, tax_document, media
```

### Step 4: Set Up Snowflake Schemas

**Option A: Using Snowflake Web UI**

1. Log into Snowflake
2. Go to Worksheets
3. Run this SQL:

```sql
-- Use your database
USE DATABASE GCMS_DEV;

-- Create schemas for each layer
CREATE SCHEMA IF NOT EXISTS RAW 
  COMMENT = 'Raw data from Airbyte ingestion';

CREATE SCHEMA IF NOT EXISTS BRONZE 
  COMMENT = 'Bronze layer - raw mirrors and SCD2 history';

CREATE SCHEMA IF NOT EXISTS SILVER 
  COMMENT = 'Silver layer - staging and intermediate models';

CREATE SCHEMA IF NOT EXISTS GOLD 
  COMMENT = 'Gold layer - facts and dimensions for analytics';

-- Verify schemas created
SHOW SCHEMAS IN DATABASE GCMS_DEV;

-- Grant permissions (adjust role as needed)
GRANT USAGE ON SCHEMA RAW TO ROLE TRANSFORMER;
GRANT USAGE ON SCHEMA BRONZE TO ROLE TRANSFORMER;
GRANT USAGE ON SCHEMA SILVER TO ROLE TRANSFORMER;
GRANT USAGE ON SCHEMA GOLD TO ROLE TRANSFORMER;

GRANT CREATE TABLE ON SCHEMA RAW TO ROLE TRANSFORMER;
GRANT CREATE TABLE ON SCHEMA BRONZE TO ROLE TRANSFORMER;
GRANT CREATE TABLE ON SCHEMA SILVER TO ROLE TRANSFORMER;
GRANT CREATE TABLE ON SCHEMA GOLD TO ROLE TRANSFORMER;
```

**Option B: Using SnowSQL CLI**

```bash
# Connect to Snowflake
snowsql -a your_account -u your_username

# Run the SQL above
```

### Step 5: Configure dbt Profile

The `dbt/profiles.yml` file needs your Snowflake credentials:

```bash
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/dbt

# Edit profiles.yml
code profiles.yml
```

**Update with your values:**

```yaml
gcms_data_platform:
  outputs:
    prod:
      type: snowflake
      account: xy12345.us-east-1  # YOUR ACCOUNT
      user: your_username          # YOUR USERNAME
      password: your_password      # YOUR PASSWORD
      role: TRANSFORMER            # YOUR ROLE
      database: GCMS_DEV          # YOUR DATABASE
      warehouse: TRANSFORMING      # YOUR WAREHOUSE
      schema: bronze              # Default schema
      threads: 4
      client_session_keep_alive: False
      query_tag: dbt_gcms
  target: prod
```

### Step 6: Test dbt Connection

```bash
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/dbt

# Test connection to Snowflake
/Users/robertgonzalez/Library/Python/3.9/bin/dbt debug

# You should see:
# ✓ Connection test: [OK connection ok]
```

**If connection fails:**
- Verify Snowflake account identifier format
- Check username/password
- Ensure warehouse is running
- Verify database and schemas exist
- Check role permissions

### Step 7: Install dbt Dependencies

```bash
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/dbt

# Install dbt packages (dbt_utils, etc.)
/Users/robertgonzalez/Library/Python/3.9/bin/dbt deps

# You should see:
# Installing dbt-labs/dbt_utils
# Installed from version 1.1.1
```

### Step 8: Run Your First Transformation

**Start small - test one model:**

```bash
# Run just the fiscal_year model
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select br_supabase_fiscal_year

# You should see:
# Running with dbt=1.11.0-b3
# Found 26 models, 50 tests, 0 snapshots...
# Completed successfully
```

**If successful, run Bronze layer:**

```bash
# Run all Bronze models
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select bronze

# This creates:
# - 14 raw mirror tables
# - 3 SCD2 history tables
```

**Then Silver layer:**

```bash
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select silver
```

**Finally Gold layer:**

```bash
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select gold
```

**Or run everything at once:**

```bash
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run
```

### Step 9: Run Data Quality Tests

```bash
# Run all tests
/Users/robertgonzalez/Library/Python/3.9/bin/dbt test

# Or test specific layer
/Users/robertgonzalez/Library/Python/3.9/bin/dbt test --select bronze
/Users/robertgonzalez/Library/Python/3.9/bin/dbt test --select gold
```

### Step 10: Generate Documentation

```bash
# Generate dbt docs
/Users/robertgonzalez/Library/Python/3.9/bin/dbt docs generate

# Serve docs locally
/Users/robertgonzalez/Library/Python/3.9/bin/dbt docs serve

# Open in browser
open http://localhost:8080
```

### Step 11: Verify in Snowflake

```sql
-- Check Bronze layer
USE SCHEMA GCMS_DEV.BRONZE;
SHOW TABLES;

SELECT * FROM br_supabase_concert LIMIT 10;
SELECT * FROM br_attendance_scd2 LIMIT 10;

-- Check Silver layer
USE SCHEMA GCMS_DEV.SILVER;
SHOW TABLES;

SELECT * FROM stg_attendance LIMIT 10;

-- Check Gold layer (THE MONEY MAKER!)
USE SCHEMA GCMS_DEV.GOLD;
SHOW TABLES;

SELECT * FROM fct_musician_payment LIMIT 10;
SELECT * FROM dim_musician LIMIT 10;
```

---

## 🎯 Path B: Full Stack Setup (Docker + Airflow)

### Prerequisites for Full Stack

- [ ] Completed Path A (dbt working)
- [ ] Docker Desktop installed and running
- [ ] `.env` file configured

### Step 1: Verify Docker

```bash
# Check Docker is running
docker info

# Check docker-compose is available
docker-compose --version
```

### Step 2: Start Docker Services

```bash
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform

# Start all services (Airflow, Postgres, Redis)
docker-compose up -d

# Check status
docker-compose ps

# You should see:
# - airflow-webserver (running)
# - airflow-scheduler (running)
# - airflow-worker (running)
# - airflow-triggerer (running)
# - postgres (running)
# - redis (running)
```

### Step 3: Access Airflow UI

```bash
# Open Airflow
open http://localhost:8080

# Login credentials:
# Username: airflow
# Password: airflow
```

### Step 4: Configure Airflow Connections

**In Airflow UI:**

1. **Go to Admin → Connections**

2. **Add Snowflake Connection:**
   - Click "+ Add a new record"
   - Conn Id: `snowflake_default`
   - Conn Type: `Snowflake`
   - Account: `xy12345.us-east-1`
   - Login: `your_username`
   - Password: `your_password`
   - Database: `GCMS_DEV`
   - Warehouse: `TRANSFORMING`
   - Role: `TRANSFORMER`
   - Click "Save"

3. **Test Connection:**
   - Click "Test" button
   - Should see "Connection successfully tested"

### Step 5: Enable and Run DAGs

**In Airflow UI:**

1. **Find the `dbt_run_models` DAG**
2. **Toggle it ON** (switch on left side)
3. **Click "Trigger DAG"** (play button)
4. **Watch it run!**

**Monitor execution:**
- Click on DAG name
- View Graph or Grid view
- Click on tasks to see logs
- Green = success, Red = failed

### Step 6: Set Up Schedule (Optional)

The DAGs are pre-configured to run:
- `airbyte_sync`: Daily at 1:00 AM
- `dbt_run_models`: Daily at 2:00 AM
- `full_pipeline`: Daily at 1:00 AM (runs both)

**To change schedule:**
1. Edit DAG file in `airflow/dags/`
2. Modify `schedule_interval` parameter
3. Restart Airflow: `docker-compose restart`

---

## 🔍 Verification Checklist

After setup, verify everything works:

### Supabase
- [ ] All tables visible in Table Editor
- [ ] Can query tables in SQL Editor
- [ ] Sample data exists (or can be added)

### Snowflake
- [ ] All 4 schemas exist (RAW, BRONZE, SILVER, GOLD)
- [ ] Bronze tables populated
- [ ] Silver tables populated
- [ ] Gold tables populated (fct_musician_payment!)

### dbt
- [ ] `dbt debug` passes
- [ ] `dbt run` completes successfully
- [ ] `dbt test` all tests pass
- [ ] `dbt docs` generates and serves

### Airflow (if using)
- [ ] UI accessible at localhost:8080
- [ ] Snowflake connection tests successfully
- [ ] DAGs visible and can be triggered
- [ ] DAG runs complete successfully

---

## 🐛 Troubleshooting

### Supabase Issues

**Problem: Migrations fail to apply**
```bash
# Check Supabase CLI version
supabase --version

# Update if needed
brew upgrade supabase

# Try resetting and reapplying
supabase db reset
```

**Problem: Can't connect to Supabase**
- Verify project URL is correct
- Check service_role key (not anon key)
- Ensure IP not blocked in Supabase settings

### Snowflake Issues

**Problem: dbt debug fails**
```bash
# Check account identifier format
# Should be: account.region.cloud
# NOT just: account

# Verify warehouse is running
# In Snowflake UI: Admin → Warehouses → Resume

# Check role permissions
# User must have CREATE TABLE on schemas
```

**Problem: "Database does not exist"**
```sql
-- Create database
CREATE DATABASE GCMS_DEV;

-- Grant permissions
GRANT USAGE ON DATABASE GCMS_DEV TO ROLE TRANSFORMER;
```

**Problem: "Schema does not exist"**
```sql
-- Run schema creation SQL from Step 4
USE DATABASE GCMS_DEV;
CREATE SCHEMA IF NOT EXISTS BRONZE;
-- etc.
```

### dbt Issues

**Problem: "Compilation Error"**
```bash
# Check for syntax errors in SQL
/Users/robertgonzalez/Library/Python/3.9/bin/dbt compile --select model_name

# View compiled SQL
cat target/compiled/gcms_data_platform/models/.../model_name.sql
```

**Problem: "Relation does not exist"**
- Ensure source tables exist in Snowflake RAW schema
- Check `dbt/models/sources.yml` for correct schema/table names
- Run models in order: bronze → silver → gold

**Problem: Tests failing**
```bash
# Run with debug output
/Users/robertgonzalez/Library/Python/3.9/bin/dbt test --select model_name --debug

# Check test SQL
cat target/compiled/gcms_data_platform/models/.../model_name.sql
```

### Docker/Airflow Issues

**Problem: Services won't start**
```bash
# Check Docker resources
docker system df

# Clean up if needed
docker system prune -a

# Restart Docker Desktop
# Then: docker-compose up -d
```

**Problem: Airflow UI not accessible**
```bash
# Check logs
docker-compose logs airflow-webserver

# Restart webserver
docker-compose restart airflow-webserver
```

**Problem: DAG not appearing**
```bash
# Check scheduler logs
docker-compose logs airflow-scheduler

# Verify DAG file has no syntax errors
python3 airflow/dags/dbt_run_models.py

# Restart scheduler
docker-compose restart airflow-scheduler
```

---

## 📚 Next Steps

After successful setup:

1. **Add Sample Data** (if needed)
   - Insert test data into Supabase tables
   - Run dbt transformations
   - Verify data flows through layers

2. **Explore the Data**
   - Query Gold layer in Snowflake
   - Review dbt documentation
   - Understand data lineage

3. **Customize**
   - Add new dbt models
   - Modify business logic
   - Create custom tests

4. **Set Up Airbyte** (optional)
   - Install Airbyte locally or use cloud
   - Configure Supabase → Snowflake connection
   - Update Airflow DAGs with connection ID

5. **Production Deployment**
   - Deploy to DigitalOcean VM
   - Set up monitoring
   - Configure alerts

---

## 🆘 Getting Help

- **dbt Documentation**: [dbt/README.md](../dbt/README.md)
- **Operations Guide**: [DBT_RUNBOOK.md](DBT_RUNBOOK.md)
- **Quick Start**: [QUICKSTART.md](../QUICKSTART.md)
- **Project Status**: [PROJECT_STATUS.md](../PROJECT_STATUS.md)

---

## ✅ Success Criteria

You're ready to move forward when:

- [ ] Supabase tables created and accessible
- [ ] Snowflake schemas created
- [ ] dbt connection working
- [ ] At least one dbt model runs successfully
- [ ] Can query results in Snowflake
- [ ] Documentation generated

**Congratulations! Your data platform is connected and running! 🎉**

---

*Last Updated: 2025-12-30*
