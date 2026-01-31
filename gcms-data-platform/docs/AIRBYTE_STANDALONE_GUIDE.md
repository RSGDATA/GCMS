# Airbyte Standalone Setup Guide

## ⚠️ Important: ARM Mac Compatibility

Airbyte in docker-compose has known stability issues on ARM-based Macs (M1/M2/M3). The recommended approach is to use **Airbyte's official standalone deployment** which is specifically optimized for ARM architecture.

---

## 🎯 Why Standalone?

**Docker-Compose Issues:**
- ❌ Complex service interdependencies cause restart loops
- ❌ Temporal configuration issues on ARM
- ❌ Version compatibility problems
- ❌ Resource-intensive with multiple containers

**Standalone Benefits:**
- ✅ Optimized for ARM architecture
- ✅ Single command deployment
- ✅ Tested and stable configuration
- ✅ Easier to manage and troubleshoot
- ✅ Official Airbyte recommendation

---

## 🚀 Quick Start - Airbyte Standalone

### **Step 1: Download Airbyte**

```bash
# Navigate to your home directory
cd ~

# Clone Airbyte repository
git clone --depth 1 https://github.com/airbytehq/airbyte.git

# Navigate to Airbyte directory
cd airbyte
```

### **Step 2: Run Airbyte**

```bash
# Start Airbyte (this will download and start all services)
./run-ab-platform.sh

# Wait 2-3 minutes for initialization
# You'll see: "Airbyte is ready!"
```

### **Step 3: Access Airbyte**

```bash
# Open in browser
open http://localhost:8000

# Or manually navigate to:
# http://localhost:8000
```

### **Step 4: Initial Setup**

1. **Create Account** (first time only)
   - Email: your-email@example.com
   - Organization: GCMS
   - Accept terms

2. **You're Ready!**
   - Airbyte UI is now accessible
   - Can create connections
   - Fully functional

---

## 🔧 Managing Airbyte Standalone

### **Start Airbyte**
```bash
cd ~/airbyte
./run-ab-platform.sh
```

### **Stop Airbyte**
```bash
cd ~/airbyte
docker-compose down
```

### **Check Status**
```bash
cd ~/airbyte
docker-compose ps
```

### **View Logs**
```bash
cd ~/airbyte
docker-compose logs -f
```

### **Restart Airbyte**
```bash
cd ~/airbyte
docker-compose down
./run-ab-platform.sh
```

---

## 🔗 Connecting to Your Data Platform

### **Airbyte → Snowflake Connection**

1. **In Airbyte UI** (http://localhost:8000)
   - Click "Sources" → "New Source"
   - Select "Postgres" (for Supabase)
   - Configure:
     - Host: `host.docker.internal` (if Supabase is local)
     - Port: `5432`
     - Database: `postgres`
     - Username: `postgres`
     - Password: your-password

2. **Add Destination**
   - Click "Destinations" → "New Destination"
   - Select "Snowflake"
   - Configure with your Snowflake credentials

3. **Create Connection**
   - Click "Connections" → "New Connection"
   - Select Source → Destination
   - Configure sync schedule
   - Save & Sync

---

## 🔄 Integrating with Airflow

### **Option 1: Trigger from Airflow**

Your existing `airbyte_sync.py` DAG can trigger Airbyte:

```python
# In airflow/dags/airbyte_sync.py
# Update AIRBYTE_API_URL to:
AIRBYTE_API_URL = "http://host.docker.internal:8001/api/v1"
```

### **Option 2: Manual Sync**

1. Run sync in Airbyte UI
2. Monitor in Airbyte
3. Run dbt transformations in Airflow after

### **Option 3: Scheduled in Airbyte**

- Set sync schedule in Airbyte connection settings
- Airbyte handles scheduling
- Airflow handles transformations

---

## 📊 Architecture with Standalone Airbyte

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Supabase (Source)                              │
│  └─ PostgreSQL Database                         │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ Extract
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  Airbyte Standalone (http://localhost:8000)    │
│  └─ Data Ingestion & Sync                      │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ Load
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  Snowflake (Destination)                        │
│  └─ Raw Data Storage                            │
│                                                 │
└────────────────┬────────────────────────────────┘
                 │
                 │ Transform
                 ▼
┌─────────────────────────────────────────────────┐
│                                                 │
│  Airflow + dbt + Cosmos                         │
│  └─ Orchestration & Transformation              │
│     (http://localhost:8080)                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Recommended Workflow

### **For Development:**

1. **Start Airbyte Standalone**
   ```bash
   cd ~/airbyte && ./run-ab-platform.sh
   ```

2. **Configure Connections** (one-time)
   - Set up sources and destinations
   - Configure sync schedules

3. **Start Your Data Platform**
   ```bash
   cd ~/Projects/GCMS/gcms-data-platform
   docker-compose up -d
   ```

4. **Access Services**
   - Airbyte: http://localhost:8000
   - Airflow: http://localhost:8080

### **For Production:**

1. **Airbyte Cloud** (recommended)
   - Sign up at https://cloud.airbyte.com
   - Fully managed, no infrastructure
   - Better for production workloads

2. **Or Airbyte on Kubernetes**
   - For self-hosted production
   - Better scalability
   - See: https://docs.airbyte.com/deploying-airbyte/on-kubernetes

---

## 🐛 Troubleshooting

### **Port Conflicts**

If port 8000 is in use:

```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process or change Airbyte port
# Edit ~/airbyte/.env:
# WEBAPP_URL=http://localhost:8001
```

### **Airbyte Won't Start**

```bash
# Clean up and restart
cd ~/airbyte
docker-compose down -v
./run-ab-platform.sh
```

### **Connection Issues**

- Use `host.docker.internal` instead of `localhost` for local services
- Check firewall settings
- Verify credentials

---

## 📚 Additional Resources

- **Airbyte Documentation:** https://docs.airbyte.com
- **Airbyte Quickstart:** https://docs.airbyte.com/quickstart
- **Airbyte API:** https://docs.airbyte.com/api-documentation
- **Community Slack:** https://airbyte.com/community

---

## ✅ Summary

**Current Setup:**
- ✅ Airflow + Cosmos + dbt: Running in docker-compose
- ✅ Airbyte: Use standalone deployment (more stable)

**Why This Works:**
- Separates concerns (ingestion vs orchestration)
- Uses each tool's optimal deployment method
- More stable on ARM Macs
- Easier to manage and troubleshoot

**Next Steps:**
1. Run `cd ~/airbyte && ./run-ab-platform.sh`
2. Access http://localhost:8000
3. Configure your connections
4. Start syncing data!

---

*This guide is specifically for ARM-based Macs (M1/M2/M3). For Intel Macs or Linux, docker-compose integration works fine.*
