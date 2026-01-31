"""
Manual Data Pipeline DAG
Orchestrates: Supabase Load → Bronze → Silver → Gold
Runs daily at 6:00 AM
"""

from datetime import datetime, timedelta
from pathlib import Path
import os

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.operators.bash import BashOperator
from cosmos import DbtTaskGroup, ProjectConfig, ProfileConfig, ExecutionConfig

# Default arguments
default_args = {
    'owner': 'gcms',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Paths
DBT_PROJECT_PATH = Path("/opt/airflow/dbt")
SCRIPT_PATH = Path("/opt/airflow/scripts/manual-supabase-to-snowflake.py")

# Profile configuration for dbt - use existing profiles.yml with key-pair auth
profile_config = ProfileConfig(
    profile_name="gcms",
    target_name="prod",
    profiles_yml_filepath=str(DBT_PROJECT_PATH / "profiles.yml"),
)

# DAG definition
with DAG(
    dag_id='manual_data_pipeline',
    default_args=default_args,
    description='Daily pipeline: Load from Supabase → Transform with dbt',
    schedule='0 6 * * *',  # 6:00 AM daily
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=['production', 'manual', 'daily'],
) as dag:

    # Task 1: Install dbt dependencies (packages)
    install_dbt_deps = BashOperator(
        task_id='install_dbt_dependencies',
        bash_command=f'cd {DBT_PROJECT_PATH} && /home/airflow/.local/bin/dbt deps --profiles-dir .',
        env={
            'SNOWFLAKE_ACCOUNT': os.getenv('SNOWFLAKE_ACCOUNT'),
            'SNOWFLAKE_USER': os.getenv('SNOWFLAKE_USER'),
            'SNOWFLAKE_PRIVATE_KEY_PATH': os.getenv('SNOWFLAKE_PRIVATE_KEY_PATH'),
            'SNOWFLAKE_ROLE': os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN'),
            'SNOWFLAKE_DATABASE': os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV'),
            'SNOWFLAKE_WAREHOUSE': os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING'),
        },
    )

    # Task 2: Load data from Supabase to Snowflake
    load_supabase_data = BashOperator(
        task_id='load_supabase_to_snowflake',
        bash_command=f'python {SCRIPT_PATH}',
        env={
            'SUPABASE_URL': os.getenv('SUPABASE_URL', ''),
            'SUPABASE_SERVICE_KEY': os.getenv('SUPABASE_SERVICE_KEY', ''),
            'SNOWFLAKE_ACCOUNT': os.getenv('SNOWFLAKE_ACCOUNT', ''),
            'SNOWFLAKE_USER': os.getenv('SNOWFLAKE_USER', ''),
            'SNOWFLAKE_PASSWORD': os.getenv('SNOWFLAKE_PASSWORD', ''),
            'SNOWFLAKE_WAREHOUSE': os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING'),
            'SNOWFLAKE_DATABASE': os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV'),
            'SNOWFLAKE_SCHEMA': os.getenv('SNOWFLAKE_SCHEMA', 'MOVEMENT_I'),
            'SNOWFLAKE_PRIVATE_KEY_PATH': os.getenv('SNOWFLAKE_PRIVATE_KEY_PATH', ''),
        },
    )

    # Task 2: Bronze Layer - Raw mirror models + SCD2 transformations
    bronze_layer = DbtTaskGroup(
        group_id='bronze_layer',
        project_config=ProjectConfig(
            dbt_project_path=str(DBT_PROJECT_PATH),
            env_vars={
                'SNOWFLAKE_ACCOUNT': os.getenv('SNOWFLAKE_ACCOUNT'),
                'SNOWFLAKE_USER': os.getenv('SNOWFLAKE_USER'),
                'SNOWFLAKE_PRIVATE_KEY_PATH': os.getenv('SNOWFLAKE_PRIVATE_KEY_PATH'),
                'SNOWFLAKE_ROLE': os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN'),
                'SNOWFLAKE_DATABASE': os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV'),
                'SNOWFLAKE_WAREHOUSE': os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING'),
            },
        ),
        profile_config=profile_config,
        execution_config=ExecutionConfig(
            dbt_executable_path="/home/airflow/.local/bin/dbt",
        ),
        operator_args={
            "install_deps": True,
            "select": "tag:bronze",  # Runs all bronze models (raw + scd2)
        },
        default_args={"retries": 2},
    )

    # Task 3: Silver Layer - Staging and intermediate models
    silver_layer = DbtTaskGroup(
        group_id='silver_layer',
        project_config=ProjectConfig(
            dbt_project_path=str(DBT_PROJECT_PATH),
            env_vars={
                'SNOWFLAKE_ACCOUNT': os.getenv('SNOWFLAKE_ACCOUNT'),
                'SNOWFLAKE_USER': os.getenv('SNOWFLAKE_USER'),
                'SNOWFLAKE_PRIVATE_KEY_PATH': os.getenv('SNOWFLAKE_PRIVATE_KEY_PATH'),
                'SNOWFLAKE_ROLE': os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN'),
                'SNOWFLAKE_DATABASE': os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV'),
                'SNOWFLAKE_WAREHOUSE': os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING'),
            },
        ),
        profile_config=profile_config,
        execution_config=ExecutionConfig(
            dbt_executable_path="/home/airflow/.local/bin/dbt",
        ),
        operator_args={
            "install_deps": False,  # Already installed in bronze
            "select": "tag:silver",
        },
        default_args={"retries": 2},
    )

    # Task 4: Gold Layer - Facts and dimensions
    gold_layer = DbtTaskGroup(
        group_id='gold_layer',
        project_config=ProjectConfig(
            dbt_project_path=str(DBT_PROJECT_PATH),
            env_vars={
                'SNOWFLAKE_ACCOUNT': os.getenv('SNOWFLAKE_ACCOUNT'),
                'SNOWFLAKE_USER': os.getenv('SNOWFLAKE_USER'),
                'SNOWFLAKE_PRIVATE_KEY_PATH': os.getenv('SNOWFLAKE_PRIVATE_KEY_PATH'),
                'SNOWFLAKE_ROLE': os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN'),
                'SNOWFLAKE_DATABASE': os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV'),
                'SNOWFLAKE_WAREHOUSE': os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING'),
            },
        ),
        profile_config=profile_config,
        execution_config=ExecutionConfig(
            dbt_executable_path="/home/airflow/.local/bin/dbt",
        ),
        operator_args={
            "install_deps": False,
            "select": "tag:gold",
        },
        default_args={"retries": 2},
    )

    # Task 5: Run dbt tests
    dbt_test = BashOperator(
        task_id='run_dbt_tests',
        bash_command=f'cd {DBT_PROJECT_PATH} && dbt test --profiles-dir .',
        env={
            'SNOWFLAKE_ACCOUNT': os.getenv('SNOWFLAKE_ACCOUNT'),
            'SNOWFLAKE_USER': os.getenv('SNOWFLAKE_USER'),
            'SNOWFLAKE_PASSWORD': os.getenv('SNOWFLAKE_PASSWORD'),
            'SNOWFLAKE_WAREHOUSE': os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING'),
            'SNOWFLAKE_DATABASE': os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV'),
            'SNOWFLAKE_SCHEMA': os.getenv('SNOWFLAKE_SCHEMA', 'MOVEMENT_I'),
        },
    )

    # Define dependencies
    install_dbt_deps >> load_supabase_data >> bronze_layer >> silver_layer >> gold_layer >> dbt_test
