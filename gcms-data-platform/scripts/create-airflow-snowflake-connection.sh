#!/bin/bash
# Create Snowflake connection in Airflow

set -e

echo "🔗 Creating Snowflake connection in Airflow..."

# Load environment variables
source .env

# Create the connection using Airflow CLI
docker exec gcms-airflow-webserver airflow connections add 'snowflake_default' \
    --conn-type 'snowflake' \
    --conn-login "${SNOWFLAKE_USER}" \
    --conn-password "${SNOWFLAKE_PASSWORD}" \
    --conn-schema "${SNOWFLAKE_SCHEMA:-MOVEMENT_I}" \
    --conn-extra "{
        \"account\": \"${SNOWFLAKE_ACCOUNT}\",
        \"warehouse\": \"${SNOWFLAKE_WAREHOUSE:-TRANSFORMING}\",
        \"database\": \"${SNOWFLAKE_DATABASE:-GCMS_DEV}\",
        \"region\": \"\",
        \"role\": \"${SNOWFLAKE_ROLE:-ACCOUNTADMIN}\"
    }"

echo "✅ Snowflake connection created successfully!"
echo ""
echo "Connection details:"
echo "  - Connection ID: snowflake_default"
echo "  - Account: ${SNOWFLAKE_ACCOUNT}"
echo "  - User: ${SNOWFLAKE_USER}"
echo "  - Database: ${SNOWFLAKE_DATABASE:-GCMS_DEV}"
echo "  - Schema: ${SNOWFLAKE_SCHEMA:-MOVEMENT_I}"
echo "  - Warehouse: ${SNOWFLAKE_WAREHOUSE:-TRANSFORMING}"
