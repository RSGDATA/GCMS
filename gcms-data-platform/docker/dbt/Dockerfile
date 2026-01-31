# ============================================================
# dbt Service - Standalone Container
# ============================================================
# Single responsibility: Run dbt transformations
# Triggered on-demand by Airflow via DockerOperator
# No REST API - just dbt CLI
# ============================================================

FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /dbt

# Install dbt-core and dbt-snowflake
RUN pip install --no-cache-dir \
    dbt-core==1.7.4 \
    dbt-snowflake==1.7.1

# Copy dbt project files
# Note: In docker-compose, we'll mount the dbt directory as a volume
# This allows for live updates without rebuilding the image

# Set dbt profiles directory
ENV DBT_PROFILES_DIR=/dbt

# Default command: dbt run
# Can be overridden by Airflow DockerOperator
CMD ["dbt", "run", "--profiles-dir", "/dbt", "--project-dir", "/dbt"]
