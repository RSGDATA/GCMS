# GCMS Data Platform - Quick Start Guide

**Get up and running in 15 minutes**

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ Docker Desktop installed and running
- ✅ Supabase project created (with connection details)
- ✅ Snowflake account created (with credentials)
- ✅ Git installed
- ✅ Terminal/command line access

## 🚀 Quick Start (Local Development)

### Step 1: Clone and Setup

```bash
# Navigate to project
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
code .env  # or use your preferred editor
```

**Required Environment Variables:**
```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Snowflake
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USER=your_user
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_DATABASE=GCMS_DEV
SNOWFLAKE_WAREHOUSE=TRANSFORMING
SNOWFLAKE_ROLE=TRANSFORMER

# Airflow
AIRFLOW_UID=50000
_AIRFLOW_WWW_USER_USERNAME=airflow
_AIRFLOW_WWW_USER_PASSWORD=airflow
```

### Step 2: Initialize Supabase Locally (Optional)

```bash
# Start local Supabase for development
./scripts/init-supabase-local.sh

# Apply migrations
cd supabase && supabase db push

# View in Studio
open http://localhost:54323
```

### Step 3: Start Docker Infrastructure

```bash
# Start all services (Airflow, Postgres, Redis)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f airflow-webserver
```

**Services will be available at:**
- Airflow UI: http://localhost:8080 (airflow/airflow)
- Flower (Celery): http://localhost:5555

### Step 4: Access Airflow

```bash
# Open Airflow UI
open http://localhost:8080

# Login credentials:
# Username: airflow
# Password: airflow
```

### Step 5: Configure Connections in Airflow

In the Airflow UI:

1. **Go to Admin → Connections**

2. **Add Snowflake Connection:**
   - Conn Id: `snowflake_default`
   - Conn Type: `Snowflake`
   - Account: `your_account`
   - Login: `your_user`
   - Password: `your_password`
   - Database: `GCMS_DEV`
   - Warehouse: `TRANSFORMING`
   - Role: `TRANSFORMER`

3. **Add Airbyte Connection** (if using Airbyte):
   - Conn Id: `airbyte_default`
   - Conn Type: `HTTP`
   - Host: `airbyte-server`
   - Port: `8001`

### Step 6: Run Your First Pipeline

```bash
# In Airflow UI:
# 1. Enable the "full_pipeline" DAG
# 2. Click "Trigger DAG"
# 3. Watch it run!

# Or via CLI:
docker exec -it airflow-scheduler airflow dags trigger full_pipeline
```

## 📊 What Just Happened?

Your pipeline will:

1. **Airbyte Sync** (if configured): Supabase → Snowflake RAW
2. **dbt Bronze**: Create raw mirrors + SCD2 history tables
3. **dbt Silver**: Apply business rules and staging
4. **dbt Gold**: Build facts and dimensions
5. **Tests**: Run 50+ data quality tests
6. **Docs**: Generate dbt documentation

## 🔍 Verify Everything Works

### Check Snowflake

```sql
-- In Snowflake, verify schemas exist
SHOW SCHEMAS IN DATABASE GCMS_DEV;

-- Check Bronze layer
SELECT * FROM bronze.br_supabase_concert LIMIT 10;

-- Check Gold layer (payroll)
SELECT * FROM gold.fct_musician_payment LIMIT 10;
```

### Check dbt

```bash
# Run dbt locally
cd dbt

# Install dependencies
/Users/robertgonzalez/Library/Python/3.9/bin/dbt deps

# Test connection
/Users/robertgonzalez/Library/Python/3.9/bin/dbt debug

# Run models
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run

# Run tests
/Users/robertgonzalez/Library/Python/3.9/bin/dbt test
```

### View dbt Documentation

```bash
# Generate docs
cd dbt
/Users/robertgonzalez/Library/Python/3.9/bin/dbt docs generate

# Serve docs
/Users/robertgonzalez/Library/Python/3.9/bin/dbt docs serve

# Open in browser
open http://localhost:8080
```

## 🛠️ Common Commands

### Docker Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart airflow-scheduler

# Rebuild after changes
docker-compose up -d --build
```

### Airflow Management

```bash
# List DAGs
docker exec -it airflow-scheduler airflow dags list

# Trigger a DAG
docker exec -it airflow-scheduler airflow dags trigger dbt_run_models

# View task logs
docker exec -it airflow-scheduler airflow tasks logs full_pipeline start_pipeline 2025-01-01
```

### dbt Commands

```bash
# Run specific layer
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select bronze
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select silver
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select gold

# Run specific model
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select fct_musician_payment

# Test specific model
/Users/robertgonzalez/Library/Python/3.9/bin/dbt test --select fct_musician_payment

# Full refresh (rebuild from scratch)
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --full-refresh
```

## 🐛 Troubleshooting

### Docker Issues

```bash
# Check Docker is running
docker info

# Check disk space
docker system df

# Clean up
docker system prune -a
```

### Airflow Issues

```bash
# Check webserver logs
docker-compose logs airflow-webserver

# Check scheduler logs
docker-compose logs airflow-scheduler

# Reset Airflow database
docker-compose down -v
docker-compose up -d
```

### dbt Issues

```bash
# Check connection
/Users/robertgonzalez/Library/Python/3.9/bin/dbt debug

# View compiled SQL
/Users/robertgonzalez/Library/Python/3.9/bin/dbt compile --select model_name
cat target/compiled/gcms_data_platform/models/.../model_name.sql

# Run with verbose logging
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run --select model_name --debug
```

### Connection Issues

**Snowflake:**
- Verify account identifier format: `account.region.cloud`
- Check warehouse is running
- Verify user has correct permissions

**Supabase:**
- Verify project URL is correct
- Check service role key (not anon key)
- Ensure database is accessible

## 📚 Next Steps

1. **Read the Documentation:**
   - [dbt Models](dbt/README.md)
   - [Operations Runbook](docs/DBT_RUNBOOK.md)
   - [Project Status](PROJECT_STATUS.md)

2. **Explore the Data:**
   - Connect to Snowflake
   - Query the Gold layer
   - Review dbt documentation

3. **Customize:**
   - Add new dbt models
   - Create custom DAGs
   - Extend the pipeline

4. **Deploy to Production:**
   - Set up DigitalOcean VM
   - Configure production credentials
   - Set up monitoring

## 🆘 Getting Help

- **Documentation**: Check `docs/` directory
- **dbt Docs**: Run `dbt docs serve`
- **Airflow UI**: Check task logs
- **Troubleshooting**: See `docs/DBT_RUNBOOK.md`

## ✅ Success Checklist

- [ ] Docker services running
- [ ] Airflow UI accessible
- [ ] Snowflake connection working
- [ ] dbt models run successfully
- [ ] All tests passing
- [ ] Gold layer populated
- [ ] Documentation generated

**Congratulations! Your data platform is running! 🎉**

---

**Need help?** Check the [full documentation](README.md) or review [troubleshooting guide](docs/DBT_RUNBOOK.md).
