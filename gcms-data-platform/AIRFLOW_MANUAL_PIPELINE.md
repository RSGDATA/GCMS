# Airflow Manual Pipeline Setup

This guide sets up the automated daily pipeline that runs without Airbyte.

## Pipeline Flow

```
6:00 AM Daily
    ↓
1. Load Supabase Data (Python script)
    ↓
2. Bronze Layer (SCD2 transformations)
    ↓
3. Silver Layer (Staging + Intermediate)
    ↓
4. Gold Layer (Facts + Dimensions)
    ↓
5. Run dbt Tests
```

## Prerequisites

1. **Airflow is running:**
```bash
docker-compose up -d
```

2. **Python dependencies installed in Airflow:**
```bash
docker exec -it airflow-webserver pip install snowflake-connector-python supabase
```

3. **Environment variables in `.env`:**
```bash
# Supabase
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_key

# Snowflake
SNOWFLAKE_ACCOUNT=hndffbt-te29703
SNOWFLAKE_USER=ROBERTGONZALEZ
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=TRANSFORMING
SNOWFLAKE_DATABASE=GCMS_DEV
SNOWFLAKE_SCHEMA=MOVEMENT_I
```

## Setup Steps

### 1. Configure Snowflake Connection in Airflow

Go to Airflow UI → Admin → Connections → Add Connection:

- **Connection Id:** `snowflake_default`
- **Connection Type:** Snowflake
- **Account:** `hndffbt-te29703`
- **Login:** `ROBERTGONZALEZ`
- **Password:** Your password
- **Warehouse:** `TRANSFORMING`
- **Database:** `GCMS_DEV`
- **Schema:** `MOVEMENT_I`

### 2. Enable the DAG

1. Go to Airflow UI (http://localhost:8080)
2. Find `manual_data_pipeline` DAG
3. Toggle it ON

### 3. Test Run (Optional)

Click the "Play" button to trigger a manual run and verify everything works.

## DAG Details

- **DAG ID:** `manual_data_pipeline`
- **Schedule:** Daily at 6:00 AM (`0 6 * * *`)
- **Tags:** `production`, `manual`, `daily`
- **Retries:** 1 (with 5-minute delay)

## Task Breakdown

### Task 1: `load_supabase_to_snowflake`
- Runs Python script to pull data from Supabase
- Creates bronze tables in Snowflake
- Duration: ~2-5 minutes

### Task 2: `bronze_layer`
- Runs dbt models tagged with `bronze` and `scd2`
- Creates SCD2 history tables
- Duration: ~3-7 minutes

### Task 3: `silver_layer`
- Runs dbt models tagged with `silver`
- Staging and intermediate transformations
- Duration: ~2-4 minutes

### Task 4: `gold_layer`
- Runs dbt models tagged with `gold`
- Creates fact and dimension tables
- Duration: ~2-4 minutes

### Task 5: `run_dbt_tests`
- Validates data quality
- Duration: ~1-2 minutes

**Total Pipeline Duration:** ~10-22 minutes

## Monitoring

### View DAG Graph
- Go to Airflow UI → DAGs → `manual_data_pipeline` → Graph

### Check Logs
- Click on any task → Logs

### View Task Duration
- Click on any task → Task Duration

## Troubleshooting

### DAG not showing up
```bash
# Restart Airflow
docker-compose restart
```

### Python script fails
```bash
# Check if dependencies are installed
docker exec -it airflow-webserver pip list | grep snowflake
docker exec -it airflow-webserver pip list | grep supabase
```

### dbt tasks fail
```bash
# Check dbt connection
docker exec -it airflow-webserver bash
cd /opt/airflow/dbt
dbt debug
```

### Connection errors
- Verify `.env` file has correct credentials
- Check Snowflake connection in Airflow UI
- Ensure warehouse is running in Snowflake

## Manual Trigger

To run the pipeline manually (outside of schedule):

1. Go to Airflow UI
2. Find `manual_data_pipeline`
3. Click the "Play" button (▶️)
4. Confirm trigger

## Pausing the DAG

To temporarily stop the scheduled runs:

1. Go to Airflow UI
2. Find `manual_data_pipeline`
3. Toggle it OFF

## Demo Tips

For your demo, you can:

1. **Show the DAG graph** - Visual representation of the pipeline
2. **Trigger a manual run** - Watch it execute in real-time
3. **Show task logs** - Demonstrate observability
4. **Query gold tables** - Show the final transformed data

---

**Note:** Once Airbyte is working, you can switch back to the `full_pipeline` DAG that uses Airbyte instead of the Python script.
