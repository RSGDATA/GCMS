# Snowflake Cost Reduction Guide

## 📊 Current Cost Analysis (Last 30 Days)

### Total Credits Used: **4.43 credits**

**Breakdown:**
- TRANSFORMING warehouse: 3.91 credits (88%)
- COMPUTE_WH: 0.51 credits (12%)
- Cloud Services: 0.61 credits

**Estimated Cost:** ~$4.43 - $13.29 (depending on your credit price)

### Key Findings:
✅ **Storage costs are negligible** (< 0.01 GB)
✅ **Warehouse uptime is reasonable** (6 hours in last 7 days)
⚠️ **TRANSFORMING warehouse is your main cost driver**

---

## 🚨 Cost Reduction Strategies

### 1. **AUTO-SUSPEND Warehouses (CRITICAL)**

Your warehouses may be staying on too long. Set aggressive auto-suspend:

```sql
-- Set auto-suspend to 1 minute (60 seconds)
ALTER WAREHOUSE TRANSFORMING SET AUTO_SUSPEND = 60;
ALTER WAREHOUSE COMPUTE_WH SET AUTO_SUSPEND = 60;

-- Verify settings
SHOW WAREHOUSES;
```

**Impact:** Can reduce costs by 50-80% if warehouses are idling

---

### 2. **Use Smaller Warehouses**

You're using TRANSFORMING warehouse for tiny datasets. Downsize:

```sql
-- Check current size
SHOW WAREHOUSES;

-- Resize to X-SMALL for development
ALTER WAREHOUSE TRANSFORMING SET WAREHOUSE_SIZE = 'X-SMALL';
ALTER WAREHOUSE COMPUTE_WH SET WAREHOUSE_SIZE = 'X-SMALL';
```

**Cost Comparison:**
- X-SMALL: 1 credit/hour
- SMALL: 2 credits/hour
- MEDIUM: 4 credits/hour
- LARGE: 8 credits/hour

**Impact:** 50% cost reduction if you're using SMALL instead of X-SMALL

---

### 3. **Suspend Warehouses When Not in Use**

```sql
-- Manually suspend warehouses
ALTER WAREHOUSE TRANSFORMING SUSPEND;
ALTER WAREHOUSE COMPUTE_WH SUSPEND;

-- They'll auto-resume when needed
```

---

### 4. **Optimize dbt Runs**

Your dbt models are creating tables repeatedly. Use incremental models:

```sql
-- In your dbt models, add:
{{ config(
    materialized='incremental',
    unique_key='id'
) }}
```

**Impact:** Reduces query count and compute time

---

### 5. **Set Resource Monitors (CRITICAL)**

Prevent surprise bills with spending limits:

```sql
-- Create a resource monitor with $10 monthly limit
CREATE RESOURCE MONITOR monthly_limit WITH 
    CREDIT_QUOTA = 10
    FREQUENCY = MONTHLY
    START_TIMESTAMP = IMMEDIATELY
    TRIGGERS 
        ON 75 PERCENT DO NOTIFY
        ON 90 PERCENT DO SUSPEND
        ON 100 PERCENT DO SUSPEND_IMMEDIATE;

-- Apply to your warehouses
ALTER WAREHOUSE TRANSFORMING SET RESOURCE_MONITOR = monthly_limit;
ALTER WAREHOUSE COMPUTE_WH SET RESOURCE_MONITOR = monthly_limit;
```

**Impact:** Prevents runaway costs, sends alerts at 75% usage

---

### 6. **Optimize Streamlit App Queries**

Your Streamlit app queries Snowflake on every page load. Add caching:

```python
# In streamlit_app/app.py
@st.cache_data(ttl=3600)  # Cache for 1 hour
def get_concerts():
    # ... your query
```

**Impact:** Reduces query count by 90%+

---

### 7. **Use Query Result Caching**

Snowflake caches identical queries for 24 hours:

```sql
-- Enable result caching (should be on by default)
ALTER SESSION SET USE_CACHED_RESULT = TRUE;
```

---

### 8. **Schedule dbt Runs Wisely**

Don't run dbt continuously. Schedule it:

```bash
# Run dbt once per day instead of on-demand
# In your Airflow DAG, set schedule_interval='@daily'
```

---

## 🎯 Immediate Actions (Do These Now)

### Step 1: Set Auto-Suspend to 1 Minute
```bash
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform
python3 << 'EOF'
import snowflake.connector
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

with open('.snowflake/snowflake_key', 'rb') as f:
    p_key = serialization.load_pem_private_key(f.read(), password=None, backend=default_backend())
pkb = p_key.private_bytes(encoding=serialization.Encoding.DER, format=serialization.PrivateFormat.PKCS8, encryption_algorithm=serialization.NoEncryption())

conn = snowflake.connector.connect(
    user='ROBERTGONZALEZ',
    account='hndffbt-te29703',
    private_key=pkb,
    role='ACCOUNTADMIN'
)
cursor = conn.cursor()

# Set auto-suspend to 60 seconds
cursor.execute("ALTER WAREHOUSE TRANSFORMING SET AUTO_SUSPEND = 60")
cursor.execute("ALTER WAREHOUSE COMPUTE_WH SET AUTO_SUSPEND = 60")

# Resize to X-SMALL
cursor.execute("ALTER WAREHOUSE TRANSFORMING SET WAREHOUSE_SIZE = 'X-SMALL'")
cursor.execute("ALTER WAREHOUSE COMPUTE_WH SET WAREHOUSE_SIZE = 'X-SMALL'")

# Suspend now
cursor.execute("ALTER WAREHOUSE TRANSFORMING SUSPEND")
cursor.execute("ALTER WAREHOUSE COMPUTE_WH SUSPEND")

print("✅ Warehouses optimized for cost savings!")
conn.close()
EOF
```

### Step 2: Create Resource Monitor
```bash
python3 << 'EOF'
import snowflake.connector
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

with open('.snowflake/snowflake_key', 'rb') as f:
    p_key = serialization.load_pem_private_key(f.read(), password=None, backend=default_backend())
pkb = p_key.private_bytes(encoding=serialization.Encoding.DER, format=serialization.PrivateFormat.PKCS8, encryption_algorithm=serialization.NoEncryption())

conn = snowflake.connector.connect(
    user='ROBERTGONZALEZ',
    account='hndffbt-te29703',
    private_key=pkb,
    role='ACCOUNTADMIN'
)
cursor = conn.cursor()

# Create resource monitor
cursor.execute("""
CREATE OR REPLACE RESOURCE MONITOR monthly_limit WITH 
    CREDIT_QUOTA = 10
    FREQUENCY = MONTHLY
    START_TIMESTAMP = IMMEDIATELY
    TRIGGERS 
        ON 75 PERCENT DO NOTIFY
        ON 90 PERCENT DO SUSPEND
        ON 100 PERCENT DO SUSPEND_IMMEDIATE
""")

# Apply to warehouses
cursor.execute("ALTER WAREHOUSE TRANSFORMING SET RESOURCE_MONITOR = monthly_limit")
cursor.execute("ALTER WAREHOUSE COMPUTE_WH SET RESOURCE_MONITOR = monthly_limit")

print("✅ Resource monitor created! You'll be notified at 75% usage.")
conn.close()
EOF
```

---

## 📈 Expected Savings

| Action | Potential Savings |
|--------|------------------|
| Auto-suspend (60s) | 50-80% |
| Downsize to X-SMALL | 50% |
| Resource Monitor | Prevents overages |
| Query caching | 30-50% |
| Incremental dbt | 20-40% |

**Total Potential Savings: 70-90%**

---

## 🔍 Monthly Cost Monitoring

Run this query monthly to track costs:

```sql
SELECT 
    DATE_TRUNC('month', start_time) as month,
    warehouse_name,
    SUM(credits_used) as total_credits,
    SUM(credits_used) * 3 as estimated_cost_usd  -- Adjust multiplier based on your credit price
FROM snowflake.account_usage.warehouse_metering_history
WHERE start_time >= DATEADD(month, -3, CURRENT_TIMESTAMP())
GROUP BY 1, 2
ORDER BY 1 DESC, 3 DESC;
```

---

## ✅ Best Practices Going Forward

1. **Always suspend warehouses** when done working
2. **Use X-SMALL warehouses** for development
3. **Cache Streamlit queries** for 1+ hours
4. **Run dbt on schedule** (not continuously)
5. **Monitor resource usage** weekly
6. **Set up email alerts** for cost thresholds

---

## 🆘 Emergency: Stop All Costs Now

If you need to stop all costs immediately:

```sql
ALTER WAREHOUSE TRANSFORMING SUSPEND;
ALTER WAREHOUSE COMPUTE_WH SUSPEND;
ALTER WAREHOUSE CLOUD_SERVICES_ONLY SUSPEND;
```

Your data is safe - warehouses will auto-resume when needed.
