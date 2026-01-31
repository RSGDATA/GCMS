"""
============================================================
Airflow DAG: Full Data Pipeline
============================================================

PURPOSE:
Complete end-to-end data pipeline:
Supabase → Airbyte → Snowflake RAW → dbt (Bronze/Silver/Gold)

SCHEDULE:
Daily at 1:00 AM

DEPENDENCIES:
- Airbyte configured and running
- dbt installed in Airflow
- Snowflake connection active
- Supabase connection active

============================================================
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.operators.python import PythonOperator
from airflow.sensors.external_task import ExternalTaskSensor

# Default arguments
default_args = {
    'owner': 'gcms-data-team',
    'depends_on_past': False,
    'email': ['data-team@gcms.org'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=3),
}

# DAG definition
dag = DAG(
    'full_pipeline',
    default_args=default_args,
    description='Complete data pipeline: Supabase → Snowflake → dbt transformation',
    schedule_interval='0 1 * * *',  # Daily at 1:00 AM
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['pipeline', 'full', 'daily', 'production'],
)

# ============================================================
# Task 1: Start Pipeline
# ============================================================
def start_pipeline(**context):
    """Log pipeline start"""
    execution_date = context['execution_date']
    print("=" * 60)
    print(f"🚀 STARTING FULL DATA PIPELINE")
    print(f"Execution Date: {execution_date}")
    print("=" * 60)
    print("\nPipeline Steps:")
    print("1. Airbyte Sync (Supabase → Snowflake RAW)")
    print("2. dbt Transformation (RAW → Bronze → Silver → Gold)")
    print("3. Data Quality Tests")
    print("4. Documentation Generation")
    print("\nExpected Duration: 30-60 minutes")
    print("=" * 60)
    return "Pipeline Started"

start = PythonOperator(
    task_id='start_pipeline',
    python_callable=start_pipeline,
    provide_context=True,
    dag=dag,
)

# ============================================================
# Task 2: Trigger Airbyte Sync
# ============================================================
trigger_airbyte = TriggerDagRunOperator(
    task_id='trigger_airbyte_sync',
    trigger_dag_id='airbyte_sync',
    wait_for_completion=True,
    poke_interval=30,
    allowed_states=['success'],
    failed_states=['failed'],
    dag=dag,
)

# ============================================================
# Task 3: Wait for Airbyte Completion
# ============================================================
wait_for_airbyte = ExternalTaskSensor(
    task_id='wait_for_airbyte_completion',
    external_dag_id='airbyte_sync',
    external_task_id='verify_sync_success',
    allowed_states=['success'],
    failed_states=['failed', 'skipped'],
    mode='reschedule',
    timeout=3600,
    poke_interval=30,
    dag=dag,
)

# ============================================================
# Task 4: Trigger dbt Transformation
# ============================================================
trigger_dbt = TriggerDagRunOperator(
    task_id='trigger_dbt_transformation',
    trigger_dag_id='dbt_run_models',
    wait_for_completion=True,
    poke_interval=30,
    allowed_states=['success'],
    failed_states=['failed'],
    dag=dag,
)

# ============================================================
# Task 5: Wait for dbt Completion
# ============================================================
wait_for_dbt = ExternalTaskSensor(
    task_id='wait_for_dbt_completion',
    external_dag_id='dbt_run_models',
    external_task_id='success_notification',
    allowed_states=['success'],
    failed_states=['failed', 'skipped'],
    mode='reschedule',
    timeout=7200,
    poke_interval=30,
    dag=dag,
)

# ============================================================
# Task 6: Pipeline Success
# ============================================================
def pipeline_success(**context):
    """Log pipeline completion and send notifications"""
    execution_date = context['execution_date']
    print("=" * 60)
    print(f"✅ PIPELINE COMPLETED SUCCESSFULLY")
    print(f"Execution Date: {execution_date}")
    print("=" * 60)
    print("\nCompleted Steps:")
    print("✓ Airbyte sync from Supabase to Snowflake")
    print("✓ dbt transformation (Bronze → Silver → Gold)")
    print("✓ All data quality tests passed")
    print("✓ Documentation generated")
    print("\nData Status:")
    print("- RAW schema: Fresh data from Supabase")
    print("- Bronze schema: Historical tracking active")
    print("- Silver schema: Business rules applied")
    print("- Gold schema: Ready for analytics & payroll")
    print("\nNext Steps:")
    print("- Review Airflow logs for details")
    print("- Check dbt docs for data lineage")
    print("- Verify Gold layer in Snowflake")
    print("=" * 60)
    
    # TODO: Send Slack notification
    # TODO: Send email summary
    # TODO: Update monitoring dashboard
    
    return "Pipeline Success"

success = PythonOperator(
    task_id='pipeline_success',
    python_callable=pipeline_success,
    provide_context=True,
    dag=dag,
)

# ============================================================
# Task 7: Pipeline Failure Handler
# ============================================================
def pipeline_failure(**context):
    """Handle pipeline failure"""
    execution_date = context['execution_date']
    print("=" * 60)
    print(f"❌ PIPELINE FAILED")
    print(f"Execution Date: {execution_date}")
    print("=" * 60)
    print("\nFailure Recovery Steps:")
    print("1. Check Airflow UI for failed task")
    print("2. Review task logs for error details")
    print("3. Verify connections (Supabase, Snowflake, Airbyte)")
    print("4. Check data quality in source systems")
    print("5. Retry failed task or full pipeline")
    print("\nEscalation:")
    print("- Contact: data-team@gcms.org")
    print("- Slack: #data-alerts")
    print("=" * 60)
    
    # TODO: Send failure alert to Slack
    # TODO: Create incident ticket
    # TODO: Page on-call engineer if critical
    
    return "Pipeline Failed"

failure = PythonOperator(
    task_id='pipeline_failure',
    python_callable=pipeline_failure,
    provide_context=True,
    trigger_rule='one_failed',
    dag=dag,
)

# ============================================================
# Task Dependencies
# ============================================================
# Main flow: Start → Airbyte → dbt → Success
start >> trigger_airbyte >> wait_for_airbyte
wait_for_airbyte >> trigger_dbt >> wait_for_dbt >> success

# Failure handling: Any failure → failure handler
[trigger_airbyte, wait_for_airbyte, trigger_dbt, wait_for_dbt] >> failure

"""
============================================================
DAG EXECUTION FLOW
============================================================

HAPPY PATH:
1. start_pipeline              - Log pipeline start
2. trigger_airbyte_sync        - Start Airbyte ingestion
3. wait_for_airbyte_completion - Wait for Airbyte to finish
4. trigger_dbt_transformation  - Start dbt transformation
5. wait_for_dbt_completion     - Wait for dbt to finish
6. pipeline_success            - Log success and notify

FAILURE PATH:
- Any task failure → pipeline_failure → Alert team

MONITORING:
- Airflow UI: Overall pipeline status
- Airbyte UI: Sync details and row counts
- Snowflake: Data freshness and quality
- dbt docs: Model lineage and tests

TIMING:
- Airbyte sync: 5-15 minutes (depends on data volume)
- dbt transformation: 10-30 minutes
- Total pipeline: 30-60 minutes

ALERTS:
- Email on failure
- Slack notification (TODO)
- PagerDuty for critical failures (TODO)

RECOVERY:
- Failed tasks retry once automatically
- Manual intervention required after retry
- Check logs and connections
- Re-run from failed task or full pipeline

PAYROLL CRITICAL:
- This pipeline MUST complete before payroll processing
- Gold layer tests MUST pass
- Monitor fct_musician_payment table closely

============================================================
"""
