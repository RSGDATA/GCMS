# Manual Data Load for Demo

This guide helps you load data from Supabase to Snowflake manually, bypassing Airbyte.

## Prerequisites

Make sure your `.env` file has these variables:

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Snowflake
SNOWFLAKE_ACCOUNT=hndffbt-te29703
SNOWFLAKE_USER=ROBERTGONZALEZ
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=TRANSFORMING
SNOWFLAKE_DATABASE=GCMS_DEV
SNOWFLAKE_SCHEMA=MOVEMENT_I
```

## Step 1: Install Python Dependencies

```bash
pip install snowflake-connector-python supabase python-dotenv
```

## Step 2: Run the Manual Load Script

```bash
python scripts/manual-supabase-to-snowflake.py
```

This will:
- ✅ Connect to Supabase
- ✅ Pull all data from your tables
- ✅ Create bronze tables in Snowflake
- ✅ Load the data with Airbyte-compatible metadata

## Step 3: Run dbt Transformations

```bash
cd dbt
dbt run
```

This will:
- ✅ Create SCD2 tables in bronze layer
- ✅ Transform data in silver layer
- ✅ Build gold layer fact and dimension tables

## Step 4: Verify Your Data

Check your gold layer tables in Snowflake:

```sql
-- Check musician dimension
SELECT * FROM GCMS_DEV.MOVEMENT_I.dim_musician LIMIT 10;

-- Check concert dimension
SELECT * FROM GCMS_DEV.MOVEMENT_I.dim_concert LIMIT 10;

-- Check payment facts
SELECT * FROM GCMS_DEV.MOVEMENT_I.fct_musician_payment LIMIT 10;
```

## Demo Ready! 🎉

Your data is now loaded and transformed. You can:
- Query the gold layer tables
- Show the medallion architecture
- Demonstrate SCD2 tracking
- Run analytics queries

## Troubleshooting

### Missing Python packages
```bash
pip install snowflake-connector-python supabase python-dotenv
```

### Connection errors
- Check your `.env` file has correct credentials
- Verify Snowflake warehouse is running
- Confirm Supabase URL and key are correct

### No data in tables
- Check Supabase has data in the tables
- Verify table names match in the script

## Re-running the Load

The script drops and recreates tables, so you can run it multiple times:

```bash
python scripts/manual-supabase-to-snowflake.py
cd dbt && dbt run
```

---

**Note:** Once you fix the Airbyte connection, you can switch back to automated syncs. This manual process is just for the demo!
