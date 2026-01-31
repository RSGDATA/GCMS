# 🌐 Airbyte Cloud Setup with Airflow Integration

**Perfect! You already have an Airbyte Cloud account. Here's how to connect everything.**

---

## ✅ **Step 1: Set Up Connection in Airbyte Cloud**

1. **Go to:** https://cloud.airbyte.com
2. **Log in** with your existing account

### **Create Supabase Source:**
- Connector: **Postgres**
- Host: `db.stttpmepakavlubbsqaq.supabase.co`
- Port: `5432`
- Database: `postgres`
- Username: `postgres`
- Password: `h67BX5CDfNgSUy0I`
- SSL Mode: `require`
- Replication Method: Standard

### **Create Snowflake Destination:**
- Host: `hndffbt-te29703.snowflakecomputing.com`
- Database: `GCMS_DEV`
- Schema: `MOVEMENT_I`
- Username: `ROBERTGONZALEZ`
- Auth: Key Pair Authentication
- Private Key: (paste from `.snowflake/snowflake_key`)

### **Create Connection:**
- Select all 14 tables
- Frequency: Every 24 hours
- Sync mode: Full refresh | Overwrite

---

## 🔑 **Step 2: Get Airbyte Cloud API Credentials**

1. In Airbyte Cloud, go to **Settings** → **API Keys**
2. Click **"Generate API Key"**
3. Copy the **Client ID** and **Client Secret**
4. Copy your **Connection ID** from the connection page

---

## 📝 **Step 3: Update Your .env File**

Add these to your `.env`:

```bash
# Airbyte Cloud Configuration
AIRBYTE_API_URL=https://api.airbyte.com/v1
AIRBYTE_CLIENT_ID=your_client_id_here
AIRBYTE_CLIENT_SECRET=your_client_secret_here
AIRBYTE_CONNECTION_ID=your_connection_id_here
```

---

## 🔗 **Step 4: Configure Airflow Connection**

When you start Airflow, add this connection:

**Connection ID:** `airbyte_default`  
**Connection Type:** `HTTP`  
**Host:** `https://api.airbyte.com`  
**Extra:** 
```json
{
  "client_id": "your_client_id",
  "client_secret": "your_client_secret"
}
```

---

## ✅ **Step 5: Test the Integration**

Your Airflow DAG (`airbyte_sync.py`) is already configured! It will:

1. ✅ Trigger Airbyte Cloud sync
2. ✅ Monitor sync progress
3. ✅ Verify completion
4. ✅ Trigger dbt transformations

---

## 🎯 **Your Complete Pipeline:**

```
Supabase (14 tables)
    ↓ Airbyte Cloud (every 24 hours)
Snowflake MOVEMENT_I
    ↓ Airflow triggers dbt
MOVEMENT_II → MOVEMENT_III → FINALE
```

---

## 📊 **Monitoring:**

- **Airbyte Cloud UI:** Monitor sync status
- **Airflow UI:** Monitor DAG execution
- **Snowflake:** Verify data arrival

---

## 🚀 **Benefits of Airbyte Cloud:**

✅ **No local setup** - Works immediately  
✅ **No networking issues** - Cloud to cloud  
✅ **Managed service** - Always available  
✅ **Airflow integration** - Full visibility  
✅ **Free tier** - Perfect for your use case  

---

## 🔄 **Next Steps:**

1. Log into Airbyte Cloud
2. Create Supabase → Snowflake connection
3. Get API credentials
4. Update `.env` file
5. Configure Airflow connection
6. Run your pipeline!

**This will work perfectly and Airflow will have full visibility!** 🎉
