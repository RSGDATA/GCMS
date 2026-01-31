# Airbyte Setup Guide - Automated Python Approach

**Set up Airbyte to sync Supabase → Snowflake using Python (no UI needed!)**

---

## 🎯 What This Does

The Python script will automatically:
1. ✅ Connect to your running Airbyte instance
2. ✅ Create a Supabase (Postgres) source
3. ✅ Create a Snowflake destination
4. ✅ Configure the connection between them
5. ✅ Set up all 14 tables to sync
6. ✅ Schedule syncs every 24 hours
7. ✅ Trigger the first sync
8. ✅ Save connection IDs to your `.env` file

**No clicking through the UI required!**

---

## 📋 Prerequisites

### **1. Docker Containers Running**

Make sure Airbyte is running:

```bash
docker-compose up -d
```

Wait 2-3 minutes for Airbyte to fully start up.

### **2. Credentials Filled In**

You need these in your `.env` file:

**From Supabase:**
- ✅ `SUPABASE_URL` (already filled in)
- ❌ `SUPABASE_DB_PASSWORD` (you need to add this)

**From Snowflake:**
- ❌ `SNOWFLAKE_ACCOUNT`
- ❌ `SNOWFLAKE_USER`
- ❌ `SNOWFLAKE_PASSWORD`
- ✅ `SNOWFLAKE_WAREHOUSE` (already set to TRANSFORMING)
- ✅ `SNOWFLAKE_DATABASE` (already set to GCMS_DEV)
- ✅ `SNOWFLAKE_ROLE` (already set to ACCOUNTADMIN)

### **3. Python Dependencies**

Install required packages:

```bash
pip install requests python-dotenv
```

---

## 🚀 Step-by-Step Setup

### **Step 1: Get Supabase Database Password** (2 minutes)

1. Go to: https://supabase.com/dashboard/project/stttpmepakavlubbsqaq/settings/database
2. Scroll to "Database password"
3. Click "Reset database password" if you don't have it
4. Copy the password
5. Open `.env` file
6. Replace `YOUR_PASSWORD` in both places:
   ```bash
   SUPABASE_DB_CONNECTION_STRING=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db...
   SUPABASE_DB_PASSWORD=YOUR_ACTUAL_PASSWORD
   ```

### **Step 2: Get Snowflake Credentials** (5 minutes)

Follow the guide: `docs/SNOWFLAKE_SETUP_INSTRUCTIONS.md`

Fill in these values in `.env`:
```bash
SNOWFLAKE_ACCOUNT=xy12345.us-east-1
SNOWFLAKE_USER=your_username
SNOWFLAKE_PASSWORD=your_password
```

### **Step 3: Set Up Snowflake Schemas** (3 minutes)

1. Log into Snowflake: https://app.snowflake.com
2. Open a new Worksheet
3. Copy/paste `scripts/setup-snowflake-schemas.sql`
4. Run it
5. Verify `GCMS_DEV` database and `RAW` schema exist

### **Step 4: Load Sample Data in Supabase** (3 minutes)

1. Go to: https://supabase.com/dashboard/project/stttpmepakavlubbsqaq
2. Click "SQL Editor"
3. Copy/paste `scripts/create-sample-data.sql`
4. Run it
5. Verify data was created (run the verification queries at the bottom)

### **Step 5: Run the Airbyte Setup Script** (2 minutes)

```bash
# Make the script executable
chmod +x scripts/setup-airbyte-connection.py

# Run it!
python3 scripts/setup-airbyte-connection.py
```

**What you'll see:**

```
============================================================
🚀 Airbyte Setup: Supabase → Snowflake
============================================================
🔍 Checking credentials...
✅ All credentials found!
⏳ Waiting for Airbyte to be ready...
✅ Airbyte is ready!

📁 Getting workspace...
✅ Using workspace: abc-123-def

🔌 Creating Supabase source...
✅ Created Supabase source: source-456

❄️  Creating Snowflake destination...
✅ Created Snowflake destination: dest-789

🔗 Creating connection...
✅ Created connection: conn-012

💾 Saving connection IDs to .env...
✅ Connection IDs saved to .env

🚀 Triggering initial sync...
✅ Sync triggered! Data will start flowing from Supabase to Snowflake.

============================================================
✅ SETUP COMPLETE!
============================================================
```

### **Step 6: Monitor the Sync** (5-10 minutes)

**Option A: Airbyte UI**
1. Open: http://localhost:8000
2. Login: `airbyte` / `password`
3. Click "Connections"
4. You'll see "Supabase → Snowflake (GCMS)"
5. Watch the sync progress

**Option B: Check Snowflake**

After 5-10 minutes, check if data arrived:

```sql
-- In Snowflake, run:
USE DATABASE GCMS_DEV;
USE SCHEMA RAW;

SHOW TABLES;

-- You should see tables like:
-- fiscal_year, season, concert, person, musician, etc.

-- Check data:
SELECT * FROM fiscal_year LIMIT 10;
```

---

## ✅ Verification Checklist

After running the script, verify:

- [ ] Script completed without errors
- [ ] Connection IDs saved to `.env` file
- [ ] Airbyte UI shows the connection (http://localhost:8000)
- [ ] Sync is running or completed
- [ ] Snowflake RAW schema has tables
- [ ] Tables have data

---

## 🔄 What Happens Next?

### **Automatic Syncs**

The connection is configured to run **every 24 hours** automatically.

You can also trigger manual syncs:

**Option 1: Python Script**
```python
import requests
import os
from dotenv import load_dotenv

load_dotenv()
connection_id = os.getenv('AIRBYTE_CONNECTION_ID')

response = requests.post(
    'http://localhost:8000/api/v1/connections/sync',
    json={'connectionId': connection_id}
)
print("Sync triggered!" if response.ok else "Error!")
```

**Option 2: Airbyte UI**
1. Go to http://localhost:8000
2. Click "Connections"
3. Click your connection
4. Click "Sync now"

**Option 3: Airflow DAG**
1. Go to http://localhost:8080
2. Find `airbyte_sync` DAG
3. Click "Trigger DAG"

---

## 🎯 Next Steps After Airbyte Setup

Once data is in Snowflake RAW schema:

### **1. Run dbt Models** (5 minutes)

```bash
cd dbt
/Users/robertgonzalez/Library/Python/3.9/bin/dbt run
```

This transforms:
- RAW → BRONZE (with SCD2 history)
- BRONZE → SILVER (cleaned & staged)
- SILVER → GOLD (payroll calculations)

### **2. Verify Gold Layer** (2 minutes)

```sql
-- In Snowflake:
USE SCHEMA GOLD;

SELECT * FROM fct_musician_payment
WHERE season_name = 'Fall 2024'
ORDER BY total_payment DESC;
```

You should see payroll calculations for all musicians!

### **3. Practice Your Demo** (15 minutes)

Follow: `docs/DEMO_SCRIPT.md`

---

## 🚨 Troubleshooting

### **Problem: "Airbyte is not responding"**

**Solution:**
```bash
# Check if containers are running
docker-compose ps

# If not, start them
docker-compose up -d

# Wait 2-3 minutes, then try again
```

### **Problem: "Missing credentials"**

**Solution:**
- Check `.env` file
- Make sure you filled in:
  - `SUPABASE_DB_PASSWORD`
  - `SNOWFLAKE_ACCOUNT`
  - `SNOWFLAKE_USER`
  - `SNOWFLAKE_PASSWORD`

### **Problem: "Error creating source"**

**Possible causes:**
1. **Wrong Supabase password**
   - Go to Supabase Dashboard → Settings → Database
   - Reset password and update `.env`

2. **Supabase not accessible**
   - Check if you can connect manually:
   ```bash
   psql "postgresql://postgres:YOUR_PASSWORD@db.stttpmepakavlubbsqaq.supabase.co:5432/postgres"
   ```

### **Problem: "Error creating destination"**

**Possible causes:**
1. **Wrong Snowflake credentials**
   - Verify by logging into Snowflake UI
   - Check account identifier format (should include region)

2. **Warehouse not running**
   - In Snowflake UI: Admin → Warehouses
   - Make sure TRANSFORMING warehouse exists and is running

3. **Schema doesn't exist**
   - Run `scripts/setup-snowflake-schemas.sql` first

### **Problem: "Sync fails"**

**Check Airbyte logs:**
```bash
docker-compose logs airbyte-worker
```

**Common issues:**
- Tables don't exist in Supabase (run sample data script first)
- Snowflake warehouse suspended (resume it)
- Network connectivity issues

---

## 📊 What Tables Are Synced?

The script configures these 14 tables:

1. `fiscal_year`
2. `season`
3. `concert`
4. `person`
5. `musician`
6. `user_profile`
7. `piece`
8. `concert_piece`
9. `rehearsal`
10. `concert_participant`
11. `rsvp`
12. `attendance`
13. `payment`
14. `contract`

All tables sync in **full refresh** mode (complete reload each time).

---

## 🔧 Advanced: Modifying the Connection

If you need to change the configuration later:

### **Option 1: Re-run the Script**

The script will create a new connection. Delete the old one in Airbyte UI first.

### **Option 2: Use Airbyte UI**

1. Go to http://localhost:8000
2. Click "Connections"
3. Click your connection
4. Modify settings
5. Save

### **Option 3: Use Python API**

```python
import requests
import os
from dotenv import load_dotenv

load_dotenv()
connection_id = os.getenv('AIRBYTE_CONNECTION_ID')

# Update schedule to every 12 hours
response = requests.post(
    'http://localhost:8000/api/v1/connections/update',
    json={
        'connectionId': connection_id,
        'schedule': {
            'units': 12,
            'timeUnit': 'hours'
        }
    }
)
```

---

## 💡 Pro Tips

### **Tip 1: Monitor Sync Status**

Add this to your Python scripts:

```python
import requests
import os
from dotenv import load_dotenv

load_dotenv()
connection_id = os.getenv('AIRBYTE_CONNECTION_ID')

response = requests.post(
    'http://localhost:8000/api/v1/connections/get',
    json={'connectionId': connection_id}
)

status = response.json()
print(f"Last sync: {status['latestSyncJobStatus']}")
```

### **Tip 2: Set Up Alerts**

Configure Airflow to send alerts when syncs fail (see `airflow/dags/airbyte_sync.py`).

### **Tip 3: Test Connection First**

Before running the full script, test credentials:

```python
import psycopg2

# Test Supabase
conn = psycopg2.connect(
    host="db.stttpmepakavlubbsqaq.supabase.co",
    database="postgres",
    user="postgres",
    password="YOUR_PASSWORD"
)
print("Supabase: ✅")
conn.close()
```

---

## ✅ Success Criteria

You'll know everything is working when:

- [ ] Script runs without errors
- [ ] Airbyte UI shows active connection
- [ ] First sync completes successfully
- [ ] Snowflake RAW schema has all 14 tables
- [ ] Tables contain data from Supabase
- [ ] dbt models run successfully
- [ ] Gold layer has payroll calculations

---

## 🎉 You're Done!

Once Airbyte is set up:
- ✅ Data flows automatically from Supabase to Snowflake
- ✅ Syncs run every 24 hours
- ✅ dbt transforms the data
- ✅ Payroll calculations are ready
- ✅ You can demo the system!

**Next:** Practice your demo with `docs/DEMO_SCRIPT.md`

---

**Questions? Check the main setup guide: `docs/SETUP_GUIDE.md`**
