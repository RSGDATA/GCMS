# ============================================================
# Airflow Dockerfile - Production Ready with dbt
# ============================================================
# 
# Custom Airflow image with:
# - Snowflake provider (for connections)
# - Airbyte provider (for triggering syncs)
# - dbt-core + dbt-snowflake (transformation compiler)
# - Cosmos (for fine-grained dbt orchestration)
#
# Architecture: dbt is a compiler, not a service
# It runs inside Airflow, invoked by tasks
# ============================================================

FROM apache/airflow:2.8.1-python3.9

USER root

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

USER airflow

# Install Airflow providers and dependencies
# dbt is installed here as a compiler tool, not a separate service
RUN pip install --no-cache-dir \
    apache-airflow-providers-snowflake==5.1.2 \
    apache-airflow-providers-airbyte==3.4.0 \
    astronomer-cosmos[dbt-snowflake]==1.3.0 \
    dbt-core==1.7.4 \
    dbt-snowflake==1.7.1 \
    snowflake-connector-python==3.6.0 \
    pandas==2.1.4 \
    sqlalchemy==1.4.51 \
    requests==2.31.0

# Set working directory
WORKDIR /opt/airflow

# Set dbt profiles directory (will be mounted as volume)
ENV DBT_PROFILES_DIR=/opt/airflow/dbt

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD airflow jobs check --job-type SchedulerJob --hostname "$${HOSTNAME}"
