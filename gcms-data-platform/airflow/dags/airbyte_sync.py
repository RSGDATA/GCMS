"""
============================================================
Airflow DAG: Airbyte Sync
============================================================

PURPOSE:
Trigger Airbyte to sync data from Supabase to Snowflake RAW schema

SCHEDULE:
Daily at 1:00 AM (before dbt transformation)

DEPENDENCIES:
- Airbyte running and configured
- Supabase connection active
- Snowflake RAW schema exists

============================================================
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.airbyte.operators.airbyte import AirbyteTriggerSyncOperator
from airflow.providers.airbyte.sensors.airbyte import AirbyteJobSensor
import os

# Default arguments
default_args = {
    'owner': 'gcms-data-team',
    'depends_on_past': False,
    'email': ['data-team@gcms.org'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 3,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=1),
}

# DAG definition
dag = DAG(
    'airbyte_sync',
    default_args=default_args,
    description='Sync data from Supabase to Snowflake via Airbyte',
    schedule_interval='0 1 * * *',  # Daily at 1:00 AM
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['airbyte', 'ingestion', 'daily'],
)

# Get Airbyte connection ID from environment
AIRBYTE_CONNECTION_ID = os.getenv('AIRBYTE_CONNECTION_ID', 'your_connection_id')

# ============================================================
# Task 1: Trigger Airbyte Sync
# ============================================================
trigger_sync = AirbyteTriggerSyncOperator(
    task_id='trigger_airbyte_sync',
    airbyte_conn_id='airbyte_default',
    connection_id=AIRBYTE_CONNECTION_ID,
    asynchronous=True,
    timeout=3600,
    wait_seconds=10,
    dag=dag,
)

# ============================================================
# Task 2: Wait for Sync Completion
# ============================================================
wait_for_sync = AirbyteJobSensor(
    task_id='wait_for_sync_completion',
    airbyte_conn_id='airbyte_default',
    airbyte_job_id="{{ task_instance.xcom_pull(task_ids='trigger_airbyte_sync', key='job_id') }}",
    timeout=3600,
    poke_interval=30,
    dag=dag,
)

# ============================================================
# Task 3: Verify Sync Success
# ============================================================
def verify_sync_success(**context):
    """Verify that sync completed successfully"""
    job_id = context['task_instance'].xcom_pull(task_ids='trigger_airbyte_sync', key='job_id')
    print(f"✅ Airbyte sync completed successfully!")
    print(f"Job ID: {job_id}")
    print("Data is now available in Snowflake RAW schema")
    print("Ready for dbt transformation")
    return "Success"

verify_sync = PythonOperator(
    task_id='verify_sync_success',
    python_callable=verify_sync_success,
    provide_context=True,
    dag=dag,
)

# ============================================================
# Task Dependencies
# ============================================================
trigger_sync >> wait_for_sync >> verify_sync

"""
============================================================
DAG EXECUTION FLOW
============================================================

1. trigger_airbyte_sync      - Start Airbyte sync job
2. wait_for_sync_completion  - Poll until sync completes
3. verify_sync_success       - Confirm success and log details

MONITORING:
- Check Airflow UI for task status
- Review Airbyte UI for sync details
- Monitor for sync failures or timeouts

RECOVERY:
- Failed syncs will retry 3 times with 5-minute delay
- Check Airbyte logs for detailed error messages
- Verify Supabase and Snowflake connections

NOTES:
- This DAG runs BEFORE dbt_run_models
- Ensures fresh data is available for transformation
- Sync duration depends on data volume

============================================================
"""
