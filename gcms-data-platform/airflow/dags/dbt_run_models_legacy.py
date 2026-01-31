"""
============================================================
Airflow DAG: dbt Run Models (DockerOperator)
============================================================

PURPOSE:
Run dbt models to transform data from Bronze → Silver → Gold
Uses DockerOperator to trigger standalone dbt container

ARCHITECTURE:
- dbt runs in its own container (gcms-dbt-service)
- Airflow triggers container via DockerOperator
- Each task runs dbt command in isolated container
- Follows single-responsibility container principle

SCHEDULE:
Daily at 2:00 AM (after Airbyte ingestion completes)

DEPENDENCIES:
- dbt-service container built and available
- Snowflake connection configured in .env
- Docker socket mounted in Airflow worker

============================================================
"""

from datetime import datetime, timedelta
from airflow import DAG
from airflow.providers.docker.operators.docker import DockerOperator
from airflow.operators.python import PythonOperator
import os

# Default arguments
default_args = {
    'owner': 'gcms-data-team',
    'depends_on_past': False,
    'email': ['data-team@gcms.org'],
    'email_on_failure': True,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'execution_timeout': timedelta(hours=2),
}

# DAG definition
dag = DAG(
    'dbt_run_models',
    default_args=default_args,
    description='Run dbt models via standalone dbt container',
    schedule_interval='0 2 * * *',  # Daily at 2:00 AM
    start_date=datetime(2025, 1, 1),
    catchup=False,
    tags=['dbt', 'transformation', 'daily', 'docker'],
)

# Common Docker configuration
docker_config = {
    'image': 'gcms-dbt-service:latest',
    'api_version': 'auto',
    'auto_remove': True,
    'docker_url': 'unix://var/run/docker.sock',
    'network_mode': 'gcms-data-platform',
    'environment': {
        'SNOWFLAKE_ACCOUNT': os.getenv('SNOWFLAKE_ACCOUNT'),
        'SNOWFLAKE_USER': os.getenv('SNOWFLAKE_USER'),
        'SNOWFLAKE_PASSWORD': os.getenv('SNOWFLAKE_PASSWORD'),
        'SNOWFLAKE_DATABASE': os.getenv('SNOWFLAKE_DATABASE'),
        'SNOWFLAKE_WAREHOUSE': os.getenv('SNOWFLAKE_WAREHOUSE'),
        'SNOWFLAKE_ROLE': os.getenv('SNOWFLAKE_ROLE'),
        'DBT_PROFILES_DIR': '/dbt',
    },
    'mount_tmp_dir': False,
}

# ============================================================
# Task 1: Install dbt dependencies
# ============================================================
install_dbt_deps = DockerOperator(
    task_id='install_dbt_deps',
    command='dbt deps --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 2: Run dbt debug (verify connection)
# ============================================================
dbt_debug = DockerOperator(
    task_id='dbt_debug',
    command='dbt debug --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 3: Run Bronze layer models
# ============================================================
run_bronze_models = DockerOperator(
    task_id='run_bronze_models',
    command='dbt run --select bronze --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 4: Test Bronze layer
# ============================================================
test_bronze_models = DockerOperator(
    task_id='test_bronze_models',
    command='dbt test --select bronze --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 5: Run Silver layer models
# ============================================================
run_silver_models = DockerOperator(
    task_id='run_silver_models',
    command='dbt run --select silver --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 6: Test Silver layer
# ============================================================
test_silver_models = DockerOperator(
    task_id='test_silver_models',
    command='dbt test --select silver --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 7: Run Gold layer models
# ============================================================
run_gold_models = DockerOperator(
    task_id='run_gold_models',
    command='dbt run --select gold --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 8: Test Gold layer (CRITICAL for payroll)
# ============================================================
test_gold_models = DockerOperator(
    task_id='test_gold_models',
    command='dbt test --select gold --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 9: Generate dbt documentation
# ============================================================
generate_docs = DockerOperator(
    task_id='generate_docs',
    command='dbt docs generate --profiles-dir /dbt --project-dir /dbt',
    **docker_config,
    dag=dag,
)

# ============================================================
# Task 10: Send success notification
# ============================================================
def send_success_notification(**context):
    """Send notification on successful completion"""
    execution_date = context['execution_date']
    print(f"✅ dbt models successfully run for {execution_date}")
    print("All data quality tests passed!")
    print("Gold layer ready for consumption")
    print("dbt ran in standalone container - proper architecture!")
    # TODO: Add Slack/email notification here
    return "Success"

success_notification = PythonOperator(
    task_id='success_notification',
    python_callable=send_success_notification,
    provide_context=True,
    dag=dag,
)

# ============================================================
# Task Dependencies
# ============================================================
# Linear flow: Bronze → Silver → Gold
install_dbt_deps >> dbt_debug >> run_bronze_models >> test_bronze_models
test_bronze_models >> run_silver_models >> test_silver_models
test_silver_models >> run_gold_models >> test_gold_models
test_gold_models >> generate_docs >> success_notification

"""
============================================================
DAG EXECUTION FLOW
============================================================

1. install_dbt_deps     - Install dbt packages (in dbt container)
2. dbt_debug            - Verify Snowflake connection
3. run_bronze_models    - Build Bronze layer (raw mirrors + SCD2)
4. test_bronze_models   - Validate Bronze data quality
5. run_silver_models    - Build Silver layer (staging + intermediate)
6. test_silver_models   - Validate Silver data quality
7. run_gold_models      - Build Gold layer (facts + dimensions)
8. test_gold_models     - Validate Gold data quality (CRITICAL)
9. generate_docs        - Generate dbt documentation
10. success_notification - Notify team of success

CONTAINER ARCHITECTURE:
- Each task spawns a new dbt container
- Container runs the dbt command
- Container exits after completion
- No long-running dbt service
- Follows single-responsibility principle

BENEFITS:
✅ dbt isolated from Airflow
✅ Easy to scale dbt independently
✅ Clean separation of concerns
✅ Production-ready architecture
✅ Works locally and on Digital Ocean

MONITORING:
- Check Airflow UI for task status
- Review logs for each task
- Monitor test failures (especially Gold layer)
- Alert on any failures

RECOVERY:
- Failed tasks will retry 2 times with 5-minute delay
- Manual intervention required after retries exhausted
- Check dbt logs in Airflow UI

============================================================
"""
