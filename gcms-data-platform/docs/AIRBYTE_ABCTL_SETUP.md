# Airbyte Setup with abctl (STABLE - PRODUCTION READY)

## ✅ Status: INSTALLED & RUNNING

Airbyte has been successfully deployed using `abctl` (Airbyte's official CLI tool) with Kubernetes backend. This is the **recommended and stable** approach for running Airbyte locally, especially on ARM Macs.

---

## 🎯 What Was Installed

**Deployment Method:** `abctl` with Kubernetes (Kind)
- **Technology:** Kubernetes cluster managed by Kind (Kubernetes in Docker)
- **Stability:** Production-grade, officially supported by Airbyte
- **ARM Compatibility:** ✅ Fully compatible with M1/M2/M3 Macs

**Components Running:**
- Airbyte Server (API & Backend)
- Airbyte Web UI
- Airbyte Worker
- Airbyte Database (PostgreSQL)
- Temporal (Workflow Engine)
- Nginx Ingress Controller

---

## 🔐 Access Information

### **Airbyte Web UI**
- **URL:** http://localhost:8000
- **Email:** [not set - use password only]
- **Password:** `5SZliBqqB88TLLrC7tCkFKwIk6rbZfIR`

### **API Credentials** (for programmatic access)
- **Client ID:** `d0b269f3-2bfa-4f37-958f-c0c1e14aa50b`
- **Client Secret:** `a22ByXT5P7eyC5jSbNa2DovbPerBa2qY`

> **Note:** To retrieve credentials anytime, run: `abctl local credentials`

---

## 🚀 Managing Airbyte

### **Check Status**
```bash
abctl local status
```

### **Stop Airbyte**
```bash
abctl local uninstall
```

### **Start Airbyte** (after stopping)
```bash
abctl local install --port 8000
```

### **View Logs**
```bash
# All services
kubectl logs -n airbyte-abctl -l app.kubernetes.io/instance=airbyte-abctl

# Specific service
kubectl logs -n airbyte-abctl deployment/airbyte-abctl-server
kubectl logs -n airbyte-abctl deployment/airbyte-abctl-worker
```

### **Access Kubernetes Dashboard** (optional)
```bash
# List all pods
kubectl get pods -n airbyte-abctl

# Describe a pod
kubectl describe pod <pod-name> -n airbyte-abctl
```

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│  Your Mac (ARM/M1/M2/M3)                        │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  Docker Desktop                           │ │
│  │                                           │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │  Kind Cluster (Kubernetes)          │ │ │
│  │  │                                     │ │ │
│  │  │  ┌─────────────────────────────┐   │ │ │
│  │  │  │  Airbyte Namespace          │   │ │ │
│  │  │  │  - Server                   │   │ │ │
│  │  │  │  - Worker                   │   │ │ │
│  │  │  │  - Web UI                   │   │ │ │
│  │  │  │  - Database (PostgreSQL)    │   │ │ │
│  │  │  │  - Temporal                 │   │ │ │
│  │  │  └─────────────────────────────┘   │ │ │
│  │  │                                     │ │ │
│  │  │  ┌─────────────────────────────┐   │ │ │
│  │  │  │  Ingress Namespace          │   │ │ │
│  │  │  │  - Nginx Ingress            │   │ │ │
│  │  │  │    (Port 8000 → Airbyte)    │   │ │ │
│  │  │  └─────────────────────────────┘   │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                     │
                     ▼
            http://localhost:8000
```

---

## 🔗 Integration with Your Data Platform

### **Architecture Overview**

```
Supabase (Source)
      │
      │ Extract
      ▼
Airbyte (http://localhost:8000)
      │ - Managed by abctl
      │ - Kubernetes backend
      │ - Stable & Production-ready
      │
      │ Load
      ▼
Snowflake (Destination)
      │
      │ Transform
      ▼
Airflow + Cosmos + dbt
(http://localhost:8080)
```

### **Connecting from Airflow**

Your Airflow DAGs can trigger Airbyte syncs using the API:

```python
# In airflow/dags/airbyte_sync.py
AIRBYTE_API_URL = "http://localhost:8001/api/v1"  # Note: API is on port 8001
AIRBYTE_CLIENT_ID = "d0b269f3-2bfa-4f37-958f-c0c1e14aa50b"
AIRBYTE_CLIENT_SECRET = "a22ByXT5P7eyC5jSbNa2DovbPerBa2qY"
```

---

## 📝 Setting Up Your First Connection

### **Step 1: Access Airbyte UI**
1. Open http://localhost:8000
2. Enter password: `5SZliBqqB88TLLrC7tCkFKwIk6rbZfIR`
3. Complete initial setup wizard

### **Step 2: Add Source (Supabase/PostgreSQL)**
1. Click "Sources" → "New Source"
2. Select "Postgres"
3. Configure:
   - **Host:** `host.docker.internal` (if Supabase is local)
   - **Port:** `5432`
   - **Database:** `postgres`
   - **Username:** `postgres`
   - **Password:** [your Supabase password]
   - **SSL Mode:** `prefer`

### **Step 3: Add Destination (Snowflake)**
1. Click "Destinations" → "New Destination"
2. Select "Snowflake"
3. Configure with your Snowflake credentials:
   - **Account:** Your Snowflake account
   - **Warehouse:** `COMPUTE_WH`
   - **Database:** `GCMS_DATA`
   - **Schema:** `RAW`
   - **Username:** Your Snowflake user
   - **Password:** Your Snowflake password

### **Step 4: Create Connection**
1. Click "Connections" → "New Connection"
2. Select your Source and Destination
3. Choose tables to sync
4. Set sync frequency (e.g., "Every hour")
5. Click "Set up connection"

### **Step 5: Run First Sync**
1. Click "Sync now" to test
2. Monitor progress in the UI
3. Verify data in Snowflake

---

## 🔄 Workflow Integration

### **Option 1: Manual Sync + Airflow Transformations**
1. Run sync in Airbyte UI (manual or scheduled)
2. Data lands in Snowflake RAW schema
3. Airflow + dbt transforms data (Bronze → Silver → Gold)

### **Option 2: Airflow-Triggered Sync**
1. Airflow DAG triggers Airbyte sync via API
2. Wait for sync completion
3. Run dbt transformations
4. All orchestrated in Airflow

### **Option 3: Airbyte-Scheduled + Airflow Sensor**
1. Airbyte runs on its own schedule
2. Airflow sensor detects new data
3. Triggers dbt transformations automatically

---

## 🐛 Troubleshooting

### **Airbyte UI Not Loading**
```bash
# Check if services are running
abctl local status

# Check ingress
kubectl get ingress -n airbyte-abctl

# Restart if needed
abctl local uninstall
abctl local install --port 8000
```

### **Connection Issues**
- Use `host.docker.internal` instead of `localhost` for local services
- Ensure source/destination services are accessible
- Check firewall settings

### **Performance Issues**
```bash
# Check resource usage
kubectl top pods -n airbyte-abctl

# Increase Docker resources if needed
# Docker Desktop → Settings → Resources
# Recommended: 4 CPUs, 8GB RAM
```

### **View Detailed Logs**
```bash
# Server logs
kubectl logs -n airbyte-abctl deployment/airbyte-abctl-server --tail=100

# Worker logs
kubectl logs -n airbyte-abctl deployment/airbyte-abctl-worker --tail=100

# All logs
kubectl logs -n airbyte-abctl --all-containers=true --tail=50
```

---

## 🎯 Why This Approach is Better

### **vs. Docker Compose**
| Feature | abctl (Kubernetes) | Docker Compose |
|---------|-------------------|----------------|
| **ARM Compatibility** | ✅ Excellent | ❌ Poor |
| **Stability** | ✅ Production-grade | ⚠️ Unstable |
| **Resource Management** | ✅ Kubernetes orchestration | ⚠️ Manual |
| **Scalability** | ✅ Easy to scale | ❌ Limited |
| **Official Support** | ✅ Recommended by Airbyte | ⚠️ Legacy |
| **Updates** | ✅ Simple (`abctl local install`) | ⚠️ Complex |

### **Key Advantages**
1. **Stable on ARM Macs:** No restart loops or crashes
2. **Production-Ready:** Same tech used in production
3. **Easy Management:** Single CLI tool (`abctl`)
4. **Better Isolation:** Kubernetes namespaces
5. **Resource Efficiency:** Kubernetes scheduling
6. **Official Support:** Maintained by Airbyte team

---

## 📚 Additional Resources

- **abctl Documentation:** https://docs.airbyte.com/using-airbyte/getting-started/oss-quickstart
- **Airbyte API Docs:** https://docs.airbyte.com/api-documentation
- **Kubernetes Basics:** https://kubernetes.io/docs/tutorials/kubernetes-basics/
- **Kind Documentation:** https://kind.sigs.k8s.io/

---

## 🔧 Advanced Configuration

### **Change Port**
```bash
abctl local uninstall
abctl local install --port 8001  # Use different port
```

### **Custom Kubernetes Config**
```bash
# View kubeconfig
cat ~/.airbyte/abctl/abctl.kubeconfig

# Use with kubectl
export KUBECONFIG=~/.airbyte/abctl/abctl.kubeconfig
kubectl get all -n airbyte-abctl
```

### **Backup Configuration**
```bash
# Backup Airbyte data
kubectl get pvc -n airbyte-abctl
# Data is stored in Kubernetes persistent volumes

# Export connections (via UI)
# Settings → Data → Export
```

---

## ✅ Summary

**Current Setup:**
- ✅ Airbyte installed via `abctl`
- ✅ Running on Kubernetes (Kind)
- ✅ Accessible at http://localhost:8000
- ✅ Stable and production-ready
- ✅ ARM Mac compatible

**Next Steps:**
1. Access http://localhost:8000
2. Login with password: `5SZliBqqB88TLLrC7tCkFKwIk6rbZfIR`
3. Set up your first connection
4. Start syncing data!

**Management:**
- Start: `abctl local install --port 8000`
- Stop: `abctl local uninstall`
- Status: `abctl local status`
- Credentials: `abctl local credentials`

---

*This setup uses Airbyte's official deployment method and is fully supported for production use.*
