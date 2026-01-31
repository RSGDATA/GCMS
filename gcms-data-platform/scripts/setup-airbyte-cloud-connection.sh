#!/bin/bash
# ============================================================
# Setup Airbyte Cloud Connection for Airflow
# ============================================================

set -e

echo "============================================================"
echo "🌐 Setting up Airbyte Cloud → Airflow Integration"
echo "============================================================"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo ""
echo "📋 Prerequisites Check:"
echo "============================================================"

# Check if Airbyte Cloud credentials are set
if [ -z "$AIRBYTE_CLIENT_ID" ] || [ -z "$AIRBYTE_CLIENT_SECRET" ]; then
    echo "❌ ERROR: Airbyte Cloud credentials not found in .env"
    echo ""
    echo "Please add these to your .env file:"
    echo ""
    echo "AIRBYTE_API_URL=https://api.airbyte.com/v1"
    echo "AIRBYTE_CLIENT_ID=your_client_id_here"
    echo "AIRBYTE_CLIENT_SECRET=your_client_secret_here"
    echo "AIRBYTE_CONNECTION_ID=your_connection_id_here"
    echo ""
    echo "Get these from: https://cloud.airbyte.com → Settings → API Keys"
    exit 1
fi

echo "✅ Airbyte Cloud credentials found"

# Check if connection ID is set
if [ -z "$AIRBYTE_CONNECTION_ID" ]; then
    echo "⚠️  WARNING: AIRBYTE_CONNECTION_ID not set"
    echo "   You'll need to add this after creating your connection in Airbyte Cloud"
fi

echo ""
echo "🔧 Configuration Summary:"
echo "============================================================"
echo "API URL: ${AIRBYTE_API_URL}"
echo "Client ID: ${AIRBYTE_CLIENT_ID:0:10}..."
echo "Connection ID: ${AIRBYTE_CONNECTION_ID:-Not set yet}"

echo ""
echo "✅ Setup Complete!"
echo "============================================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Go to https://cloud.airbyte.com"
echo "2. Create Supabase → Snowflake connection"
echo "3. Copy the Connection ID"
echo "4. Add to .env: AIRBYTE_CONNECTION_ID=your_connection_id"
echo "5. Start Airflow: docker-compose up airflow-webserver"
echo "6. Add Airbyte connection in Airflow UI:"
echo "   - Connection ID: airbyte_default"
echo "   - Connection Type: HTTP"
echo "   - Host: https://api.airbyte.com"
echo "   - Extra: {\"client_id\": \"$AIRBYTE_CLIENT_ID\", \"client_secret\": \"$AIRBYTE_CLIENT_SECRET\"}"
echo ""
echo "🚀 Your pipeline will then be fully operational!"
echo "============================================================"
