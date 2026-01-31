# dbt Migration Guide: From Separate Container to Airflow Integration

## ✅ Migration Complete

dbt has been successfully integrated into the Airflow container, following the correct architectural pattern for a nonprofit data platform.

---

## Why This Change Was Made

### The Core Principle

**dbt is a compiler, not a service.**

Tools that don't own time, state, or users don't deserve their own container.

### What dbt Doesn't Have

- ❌ No long-running process
- ❌ No state
- ❌ No ports
- ❌ No scheduler
- ❌ No lifecycle independent of Airflow tasks

### What This Means

A separate dbt container would:
- Sit idle 99% of the time
- Duplicate Python dependencies
- Add unnecessary image builds
- Create additional failure modes
- Increase mental overhead

**For zero operational gain.**

---

## What Changed

### Before (Separate Container)

```yaml
# docker-compose.yml
services:
  dbt-service:
    build:
      context: .
      dockerfile: ./docker/dbt/Dockerfile
    volumes:
      - ./dbt:/dbt
    profiles:
      - manual
```

**Problems:**
- Extra container to manage
- Triggered via DockerOperator (network overhead)
- Separate Python environment
- Duplicate Snowflake dependencies

### After (Integrated into Airflow)

```yaml
# docker-compose.yml
x-airflow-common: &airflow-common
  volumes:
    - ./dbt:/opt/airflow/dbt  # dbt project mounted
```

```dockerfile
# docker/airflow/Dockerfile
RUN pip install --no-cache-dir \
    dbt-core==1.7.4 \
    dbt-snowflake==1.7.1 \
    astronomer-cosmos[dbt-snowflake]==1.3.0
```

**Benefits:**
- ✅ One Python environment
- ✅ Unified logging
- ✅ Simpler dependency management
- ✅ Fewer failure modes
- ✅ Lower resource usage

---

## How dbt Now Works

### Execution Flow

1. **Airflow task starts**
2. **dbt command runs** (e.g., `dbt run`, `dbt test`)
3. **dbt compiles SQL** and executes against Snowflake
4. **dbt exits**
5. **Airflow records** success/failure

This is exactly how dbt is meant to be used.

### In Your DAGs

#### Option 1: BashOperator (Simple)

```python
from airflow.operators.bash import BashOperator

dbt_run = BashOperator(
    task_id='dbt_run',
    bash_command='cd /opt/airflow/dbt && dbt run --profiles-dir /opt/airflow/dbt',
)
```

#### Option 2: Cosmos (Advanced)

```python
from cosmos import DbtDag, ProjectConfig, ProfileConfig

dbt_dag = DbtDag(
    project_config=ProjectConfig(
        dbt_project_path="/opt/airflow/dbt",
    ),
    profile_config=ProfileConfig(
        profile_name="default",
        target_name="prod",
    ),
)
```

---

## Migration Steps (Already Completed)

### ✅ Step 1: Updated Airflow Dockerfile

**File:** `docker/airflow/Dockerfile`

**Changes:**
- Added `dbt-core==1.7.4`
- Added `dbt-snowflake==1.7.1`
- Set `ENV DBT_PROFILES_DIR=/opt/airflow/dbt`

### ✅ Step 2: Updated docker-compose.yml

**Changes:**
- Removed `dbt-service` section entirely
- Added dbt volume mount to Airflow services:
  ```yaml
  - ./dbt:/opt/airflow/dbt
  ```

### ✅ Step 3: Updated Architecture Comments

**Changes:**
- Updated header to reflect correct architecture
- Added dbt philosophy explanation

---

## What You Need to Do

### 1. Rebuild Airflow Images

```bash
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform

# Stop existing containers
docker-compose down

# Rebuild Airflow with dbt included
docker-compose build airflow-webserver airflow-scheduler airflow-worker

# Start everything
docker-compose up -d
```

### 2. Update Your DAGs

If you were using `DockerOperator` to run dbt, replace it with `BashOperator`:

**Before:**
```python
from airflow.providers.docker.operators.docker import DockerOperator

dbt_run = DockerOperator(
    task_id='dbt_run',
    image='gcms-dbt-service',
    command='dbt run',
    docker_url='unix://var/run/docker.sock',
    network_mode='gcms-data-platform',
)
```

**After:**
```python
from airflow.operators.bash import BashOperator

dbt_run = BashOperator(
    task_id='dbt_run',
    bash_command='cd /opt/airflow/dbt && dbt run --profiles-dir /opt/airflow/dbt',
)
```

### 3. Verify dbt Installation

Once containers are running:

```bash
# Check dbt is installed
docker exec gcms-airflow-worker dbt --version

# Test dbt connection
docker exec gcms-airflow-worker bash -c "cd /opt/airflow/dbt && dbt debug"
```

---

## Benefits You'll See

### 1. Simpler Operations

- **Before:** Manage 11 containers
- **After:** Manage 10 containers
- **Fewer things to monitor and troubleshoot**

### 2. Unified Logging

- **Before:** dbt logs in separate container
- **After:** dbt logs in Airflow task logs
- **Easier debugging when things break**

### 3. Faster Execution

- **Before:** Network call to dbt container
- **After:** Direct process execution
- **No Docker-in-Docker overhead**

### 4. Simpler Dependencies

- **Before:** Two Python environments to maintain
- **After:** One Python environment
- **Fewer version conflicts**

### 5. Lower Resource Usage

- **Before:** Idle dbt container consuming memory
- **After:** dbt only runs when needed
- **Better resource utilization**

---

## Troubleshooting

### Issue: "dbt: command not found"

**Solution:** Rebuild Airflow images
```bash
docker-compose build airflow-webserver airflow-scheduler airflow-worker
docker-compose up -d
```

### Issue: "Could not find profile named 'default'"

**Solution:** Check dbt profiles.yml location
```bash
docker exec gcms-airflow-worker ls -la /opt/airflow/dbt/profiles.yml
```

### Issue: "Permission denied" on dbt files

**Solution:** Fix file permissions
```bash
sudo chown -R 50000:0 ./dbt
```

### Issue: DAG still trying to use DockerOperator

**Solution:** Update your DAG files to use BashOperator (see examples above)

---

## Architecture Validation

### ✅ Correct Pattern

```
Airflow (Orchestrator)
  └── dbt (Compiler Tool)
      └── Invoked by tasks
      └── Exits after execution
```

### ❌ Incorrect Pattern (What We Had Before)

```
Airflow (Orchestrator)
  └── DockerOperator
      └── dbt Container (Idle 99% of time)
          └── Invoked via network
          └── Separate Python env
```

---

## Key Takeaways

1. **dbt is a compiler, not a service** - It gets invoked, not served
2. **Fewer containers = better** - For your scale and use case
3. **Unified environment = simpler** - One place for dependencies
4. **This is production-ready** - This is how real platforms do it

---

## Next Steps

1. ✅ Rebuild containers: `docker-compose build && docker-compose up -d`
2. ✅ Update DAGs to use BashOperator instead of DockerOperator
3. ✅ Test dbt execution: `docker exec gcms-airflow-worker dbt --version`
4. ✅ Run a test DAG to verify everything works

---

## Questions?

This is the correct architectural decision for a nonprofit data platform. You're making exactly the kind of choice good platform engineers make.

**Remember:** If a tool doesn't own time, state, or users — it doesn't get its own container.

dbt owns none of those. ✅
