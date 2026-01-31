# 🚀 Airflow → Airbyte Cloud Integration Guide

## ✅ YES! Airflow CAN Trigger Airbyte Cloud Syncs!

Your Airflow DAG (`airbyte_sync.py`) is **already configured** to work with Airbyte Cloud. The `AirbyteTriggerSyncOperator` uses the Airbyte API, which works for both local and cloud instances.

---

## 🎯 How It Works

```
┌─────────────┐      API Call      ┌──────────────────┐
│   Airflow   │ ──────────────────> │  Airbyte Cloud   │
│   (Local)   │                     │   (Managed)      │
└─────────────┘                     └──────────────────┘
      │                                      │
      │                                      │
      │ Monitors                             │ Syncs Data
      │ Job Status                           │
      │                                      ▼
      │                              ┌──────────────────┐
      │                              │    Supabase      │
      │                              │        ↓         │
      │                              │    Snowflake     │
      │                              └──────────────────┘
      │                                      │
      │◄─────────────────────────────────────┘
            Job Complete Signal
```

---

## 📋 Complete Setup Steps

### **Step 1: Set Up Airbyte Cloud Connection**

1. Go to https://cloud.airbyte.com
2. Create **Supabase Source:**
   - Connector: Postgres
   - Host: `db.stttpmepakavlubbsqaq.supabase.co`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `h67BX5CDfNgSUy0I`
   - SSL Mode: `require`

3. Create **Snowflake Destination:**
   - Host: `hndffbt-te29703.snowflakecomputing.com`
   - Database: `GCMS_DEV`
   - Schema: `MOVEMENT_I`
   - Username: `ROBERTGONZALEZ`
   - Auth: Key Pair (paste from `.snowflake/snowflake_key`)

4. Create **Connection:**
   - Select all 14 tables
   - Frequency: Manual (Airflow will trigger it)
   - Sync mode: Full refresh | Overwrite

5. **Copy the Connection ID** from the URL (looks like: `e3b0c442-98fc-1c14-9afb-92d1f8d7e6a0`)

---

### **Step 2: Get API Credentials**

1. In Airbyte Cloud: **Settings** → **API Keys**
2. Click **"Generate API Key"**
3. Copy:
   - **Client ID**
   - **Client Secret**

---

### **Step 3: Update Your .env File**

Add these lines to `.env`:

```bash
# Airbyte Cloud Configuration
AIRBYTE_API_URL=https://api.airbyte.com/v1
AIRBYTE_CLIENT_ID=your_client_id_here
AIRBYTE_CLIENT_SECRET=your_client_secret_here
AIRBYTE_CONNECTION_ID=your_connection_id_here
```

---

### **Step 4: Configure Airflow Connection**

When you start Airflow, add this connection:

**Via Airflow UI:**
1. Go to **Admin** → **Connections**
2. Click **+** to add new connection
3. Fill in:
   - **Connection ID:** `airbyte_default`
   - **Connection Type:** `HTTP`
   - **Host:** `https://api.airbyte.com`
   - **Extra:** 
   ```json
   {
     "client_id": "your_client_id",
     "client_secret": "your_client_secret"
   }
   ```
4. Click **Save**

**OR via Environment Variable:**

Add to `.env`:
```bash
AIRFLOW_CONN_AIRBYTE_DEFAULT='{"conn_type": "http", "host": "https://api.airbyte.com", "extra": {"client_id": "YOUR_ID", "client_secret": "YOUR_SECRET"}}'
```

---

## 🎬 How Airflow Triggers Airbyte Cloud

### **Your DAG Does This:**

1. **`trigger_airbyte_sync`** task:
   - Calls Airbyte Cloud API
   - Starts sync job
   - Returns job ID

2. **`wait_for_sync_completion`** task:
   - Polls Airbyte Cloud API every 30 seconds
   - Checks job status
   - Waits for completion

3. **`verify_sync_success`** task:
   - Confirms sync succeeded
   - Logs job details
   - Triggers next DAG (dbt)

---

## 📊 Complete Pipeline Flow

```
┌──────────────────────────────────────────────────────┐
│                    AIRFLOW                           │
│                                                      │
│  ┌────────────────┐                                 │
│  │ airbyte_sync   │ ──┐                             │
│  │ DAG            │   │                             │
│  └────────────────┘   │                             │
│         │              │                             │
│         ▼              │                             │
│  Triggers Airbyte ─────┼──> Airbyte Cloud API       │
│  Cloud via API         │                             │
│         │              │                             │
│         ▼              │                             │
│  Monitors Job ─────────┘                             │
│  Status                                              │
│         │                                            │
│         ▼                                            │
│  ┌────────────────┐                                 │
│  │ dbt_cosmos_dag │                                 │
│  │ (triggered)    │                                 │
│  └────────────────┘                                 │
└──────────────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Airbyte Cloud      │
         │   Syncs Data         │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Supabase           │
         │        ↓             │
         │   Snowflake          │
         │   MOVEMENT_I         │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   dbt Transforms     │
         │   MOVEMENT_II        │
         │   MOVEMENT_III       │
         │   FINALE             │
         └──────────────────────┘
```

---

## ✅ What You Can Do in Airflow

### **Manual Trigger:**
- Click "Play" button on `airbyte_sync` DAG
- Airflow calls Airbyte Cloud API
- Sync starts immediately

### **Scheduled Runs:**
- DAG runs daily at 1:00 AM automatically
- Triggers Airbyte Cloud sync
- Then triggers dbt transformations

### **Monitor Status:**
- See sync progress in Airflow UI
- View logs for each task
- Get alerts on failures

### **Retry Failed Syncs:**
- Automatic retry (3 attempts)
- Manual retry from Airflow UI

---

## 🔍 Monitoring & Debugging

### **In Airflow:**
- **DAG View:** See overall pipeline status
- **Task Logs:** View API calls and responses
- **XCom:** See job IDs and status

### **In Airbyte Cloud:**
- **Connections:** See sync history
- **Jobs:** View detailed logs
- **Metrics:** Monitor data volume

---

## 🎯 Key Benefits

✅ **Airflow has full control** - Triggers syncs on demand  
✅ **Complete visibility** - Monitors job status  
✅ **Orchestration** - Chains Airbyte → dbt  
✅ **Reliability** - Automatic retries  
✅ **Scheduling** - Daily automated runs  
✅ **No local Airbyte needed** - Cloud handles everything  

---

## 🚀 Quick Start Commands

```bash
# 1. Update .env with Airbyte Cloud credentials
nano .env

# 2. Run setup script
./scripts/setup-airbyte-cloud-connection.sh

# 3. Start Airflow
docker-compose up airflow-webserver airflow-scheduler

# 4. Access Airflow UI
open http://localhost:8080

# 5. Configure airbyte_default connection (see Step 4 above)

# 6. Trigger the DAG manually to test
# (Click play button in Airflow UI)
```

---

## ✅ Verification Checklist

- [ ] Airbyte Cloud connection created (Supabase → Snowflake)
- [ ] API credentials obtained (Client ID + Secret)
- [ ] Connection ID copied
- [ ] `.env` file updated
- [ ] Airflow connection `airbyte_default` configured
- [ ] DAG appears in Airflow UI
- [ ] Manual trigger test successful
- [ ] Data appears in Snowflake MOVEMENT_I

---

## 🎉 Result

**Your Airflow instance will:**
1. Trigger Airbyte Cloud syncs via API
2. Monitor sync progress
3. Wait for completion
4. Trigger dbt transformations
5. Complete the entire pipeline

**All orchestrated from Airflow, with Airbyte Cloud doing the heavy lifting!**

---

## 📞 Need Help?

If sync fails, check:
1. Airbyte Cloud connection is active
2. API credentials are correct in Airflow
3. Connection ID matches in `.env`
4. Supabase and Snowflake credentials are valid
5. Airflow logs for detailed error messages
