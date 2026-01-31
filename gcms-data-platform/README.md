# GCMS Data Platform

A production-grade, self-hosted data platform for the Greenville Chamber Music Society, built on principles of immutability, bi-temporal correctness, and operational leverage.

## 🎯 Core Principles

**History is sacred. State is derived.**

- Events are immutable facts
- Changes create new rows, never updates
- Current state is always computed, never stored as truth
- Time is a first-class dimension

## 🏗️ Architecture

```
Supabase (Operational) → Airbyte → Snowflake RAW (Bronze)
                                         ↓
                                    dbt (Silver)
                                         ↓
                                    dbt (Gold)
```

**Orchestration**: Apache Airflow (self-hosted)  
**Ingestion**: Airbyte OSS  
**Transformation**: dbt Core  
**Warehouse**: Snowflake  
**Source**: Supabase (PostgreSQL)

## 🚀 Quick Start

### Prerequisites

- Docker & docker-compose installed
- Supabase project (already configured)
- Snowflake account (already configured)
- DigitalOcean VM (Ubuntu 22.04) for production

### Local Development

```bash
# Initialize Supabase locally
./scripts/init-supabase-local.sh

# Start local Supabase
cd supabase && supabase start

# Run migrations
supabase db push
```

### Production Deployment

```bash
# Deploy to DigitalOcean VM
./scripts/deploy-to-vm.sh

# Verify deployment
./scripts/validate-deployment.sh
```

## 📁 Project Structure

```
gcms-data-platform/
├── supabase/          # Schema management & migrations
├── docker/            # Production infrastructure
├── airflow/           # Orchestration DAGs
├── dbt/               # Data transformations
├── scripts/           # Automation & deployment
├── docs/              # Comprehensive documentation
└── examples/          # Reference implementations
```

## 🔑 Key Features

### Bi-Temporal SCD Type 2
- Tracks **business time** (when it happened)
- Tracks **system time** (when we learned it)
- Enables payroll reproducibility
- Supports retroactive corrections
- Eliminates manual reconciliation

### Production-Ready Infrastructure
- Runs on single DigitalOcean VM
- Survives VM restarts
- Works with laptop offline
- Auto-restart on failure
- Persistent metadata

### Data Quality
- dbt tests at every layer
- Airflow gates prevent bad data propagation
- Append-only history preservation
- Auditable transformations

## 📚 Documentation

- [Architecture Overview](docs/01-architecture.md)
- [Data Model Principles](docs/02-data-model.md)
- [Infrastructure Setup](docs/03-infrastructure.md)
- [Local Development](docs/04-local-development.md)
- [Deployment Guide](docs/05-deployment.md)
- [Airflow DAGs](docs/06-airflow-dags.md)
- [dbt Models](docs/07-dbt-models.md)
- [Bi-Temporal SCD2](docs/08-bi-temporal-scd2.md)
- [Troubleshooting](docs/09-troubleshooting.md)

## 🔧 Configuration

Copy `.env.example` to `.env` and fill in:

```bash
# Supabase
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Snowflake
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USER=your_user
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database

# Airflow
AIRFLOW_ADMIN_USER=admin
AIRFLOW_ADMIN_PASSWORD=your_secure_password
```

## 🎭 Layers Explained

### Bronze (RAW)
- Exact mirror of Supabase
- Append-only
- No transformations
- Source of truth

### Silver (Semantic)
- **Staging**: Clean, standardized
- **Intermediate**: Business rules applied
- **SCD2**: Historical tracking with bi-temporal correctness

### Gold (Analytics)
- **Facts**: Aggregated business metrics
- **Dimensions**: Reporting-friendly views
- Optimized for consumption

## 🧪 Testing

```bash
# Run dbt tests
cd dbt && dbt test

# Validate specific model
dbt test --select fct_musician_payment
```

## 🔄 Common Operations

### Create New Migration
```bash
./scripts/create-migration.sh "add_new_table"
```

### Trigger Airflow DAG
```bash
# Via Airflow UI at http://your-vm-ip:8080
# Or via CLI:
docker exec -it airflow-scheduler airflow dags trigger ingest_supabase_to_snowflake
```

### Backfill Historical Data
```bash
# Airflow handles this via DAG parameters
# See docs/06-airflow-dags.md
```

## 🛡️ Guardrails

**Never**:
- Overwrite history
- Update past records
- Collapse event tables
- Run transformations in Airbyte
- Bypass Airflow orchestration

**Always**:
- Insert new rows for changes
- Preserve time semantics
- Run dbt via Airflow
- Test before promoting layers
- Document business logic

## 📊 Example Queries

### Current State
```sql
SELECT * FROM gold.fct_musician_payment
WHERE is_current = true;
```

### Historical Reconstruction
```sql
-- What was true on Feb 28?
SELECT * FROM bronze.bronze_attendance_scd2
WHERE date '2025-02-28' BETWEEN effective_from 
  AND COALESCE(effective_to, date '9999-12-31');
```

### Payroll Reproducibility
```sql
-- What did payroll see on March 5?
SELECT * FROM bronze.bronze_concert_participant_scd2
WHERE recorded_at <= timestamp '2025-03-05 12:00:00'
  AND is_current = true;
```

## 🤝 Contributing

This is an internal project. For changes:
1. Create migration in `supabase/migrations/`
2. Update dbt models if needed
3. Test locally
4. Deploy via scripts

## 📝 License

Internal use only - Greenville Chamber Music Society

## 🆘 Support

See [docs/09-troubleshooting.md](docs/09-troubleshooting.md) or contact the data team.

---

**Built with ❤️ for operational leverage and semantic correctness**
