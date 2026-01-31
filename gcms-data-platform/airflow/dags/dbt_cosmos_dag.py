"""
============================================================
Airflow DAG: dbt with Cosmos - Fine-Grained Orchestration
============================================================

PURPOSE:
Use Astronomer Cosmos to orchestrate dbt models with fine-grained control
Each dbt model becomes a separate Airflow task

BENEFITS:
- See each dbt model as individual task in Airflow UI
- Retry individual models instead of entire layers
- Monitor performance of specific models
- Better observability and debugging
- Airflow respects dbt's internal dependencies

ARCHITECTURE:
- Cosmos reads dbt manifest.json
- Generates Airflow task for each dbt model
- Maintains dbt dependency graph
- Executes via DockerOperator (dbt in separate container)

SCHEDULE:
Daily at 2:00 AM (after Airbyte ingestion completes)

============================================================
"""

from datetime import datetime, timedelta
from pathlib import Path
import os

from airflow import DAG
from cosmos import DbtDag, ProjectConfig, ProfileConfig, ExecutionConfig, RenderConfig
from cosmos.profiles import SnowflakeUserPasswordProfileMapping
from cosmos.constants import LoadMode, ExecutionMode

# ============================================================
# Configuration
# ============================================================

# dbt project path (mounted in Airflow containers)
DBT_PROJECT_PATH = Path("/opt/airflow/dbt")

# Snowflake connection details from environment
SNOWFLAKE_CONN_ID = "snowflake_default"

# Profile configuration
profile_config = ProfileConfig(
    profile_name="gcms_data_platform",
    target_name="prod",
    profile_mapping=SnowflakeUserPasswordProfileMapping(
        conn_id=SNOWFLAKE_CONN_ID,
        profile_args={
            "account": os.getenv("SNOWFLAKE_ACCOUNT"),
            "user": os.getenv("SNOWFLAKE_USER"),
            "password": os.getenv("SNOWFLAKE_PASSWORD"),
            "database": os.getenv("SNOWFLAKE_DATABASE"),
            "warehouse": os.getenv("SNOWFLAKE_WAREHOUSE"),
            "role": os.getenv("SNOWFLAKE_ROLE"),
            "schema": "bronze",  # Default schema
        },
    ),
)

# Execution configuration - use local execution mode
# Cosmos 1.3.0 runs dbt commands directly in the Airflow worker
execution_config = ExecutionConfig(
    execution_mode=ExecutionMode.LOCAL,
)

# Render configuration - how to parse dbt project
render_config = RenderConfig(
    load_method=LoadMode.DBT_LS,  # Use dbt ls to discover models
    select=["path:models"],  # Include all models
    exclude=[],  # Don't exclude anything
)

# ============================================================
# Create Cosmos DAG
# ============================================================

dbt_cosmos_dag = DbtDag(
    # DAG configuration
    dag_id="dbt_cosmos_orchestration",
    description="Fine-grained dbt orchestration with Cosmos - each model is a separate task",
    start_date=datetime(2025, 1, 1),
    schedule_interval="0 2 * * *",  # Daily at 2:00 AM
    catchup=False,
    tags=["dbt", "cosmos", "transformation", "production"],
    
    # Default task arguments
    default_args={
        "owner": "gcms-data-team",
        "depends_on_past": False,
        "email": ["data-team@gcms.org"],
        "email_on_failure": True,
        "email_on_retry": False,
        "retries": 2,
        "retry_delay": timedelta(minutes=5),
        "execution_timeout": timedelta(hours=1),
    },
    
    # Cosmos configuration
    project_config=ProjectConfig(
        dbt_project_path=DBT_PROJECT_PATH,
    ),
    profile_config=profile_config,
    execution_config=execution_config,
    render_config=render_config,
)

"""
============================================================
WHAT THIS DAG CREATES
============================================================

Cosmos will automatically generate tasks for each dbt model:

BRONZE LAYER:
├── bronze.supabase.br_supabase_fiscal_year
├── bronze.supabase.br_supabase_season
├── bronze.supabase.br_supabase_concert
├── bronze.supabase.br_supabase_person
├── bronze.supabase.br_supabase_musician
├── bronze.supabase.br_supabase_user_profile
├── bronze.supabase.br_supabase_piece
├── bronze.supabase.br_supabase_concert_piece
├── bronze.supabase.br_supabase_rehearsal
├── bronze.supabase.br_supabase_concert_participant
├── bronze.supabase.br_supabase_rsvp
├── bronze.supabase.br_supabase_attendance
├── bronze.supabase.br_supabase_payment
├── bronze.supabase.br_supabase_contract
├── bronze.scd2.br_attendance_scd2
├── bronze.scd2.br_concert_participant_scd2
└── bronze.scd2.br_contract_scd2

SILVER LAYER:
├── silver.staging.stg_rehearsal
├── silver.staging.stg_attendance
├── silver.staging.stg_concert_participant
├── silver.intermediate.int_required_services
├── silver.intermediate.int_attended_services
└── silver.intermediate.int_service_value

GOLD LAYER:
├── gold.dimensions.dim_musician
├── gold.dimensions.dim_concert
└── gold.facts.fct_musician_payment

DEPENDENCIES:
- Cosmos automatically reads dbt's ref() and source() functions
- Creates Airflow dependencies matching dbt's DAG
- Example: fct_musician_payment depends on dim_musician, dim_concert, etc.

BENEFITS:
✅ Each model = separate task (fine-grained control)
✅ Retry individual models (not entire layers)
✅ Monitor specific model performance
✅ See dbt lineage in Airflow UI
✅ Better debugging and observability
✅ SLA monitoring per model
✅ Parallel execution where possible

MONITORING:
- Check Airflow UI for task-level status
- Each model shows runtime, success/failure
- Can set alerts on critical models (e.g., fct_musician_payment)
- View dbt lineage graph in Airflow

DEMO VALUE:
- Show musicians the exact data flow
- "This task calculates your attendance"
- "This task calculates your payment"
- Visual and easy to understand

============================================================
"""
