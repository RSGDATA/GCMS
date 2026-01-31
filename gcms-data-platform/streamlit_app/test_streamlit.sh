#!/bin/bash
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/streamlit_app
echo "Testing Streamlit startup..."
echo "================================"

# Test if streamlit is installed
if ! command -v streamlit &> /dev/null; then
    echo "ERROR: streamlit command not found"
    echo "Installing streamlit..."
    pip3 install streamlit
fi

# Test Python imports
echo "Testing Python imports..."
python3 -c "
import sys
sys.path.insert(0, '/Users/robertgonzalez/Projects/GCMS/gcms-data-platform/streamlit_app')
try:
    import streamlit as st
    print('✓ streamlit imported')
except Exception as e:
    print(f'✗ streamlit import failed: {e}')
    
try:
    from utils.snowflake_connector import get_snowflake_connection
    print('✓ snowflake_connector imported')
except Exception as e:
    print(f'✗ snowflake_connector import failed: {e}')

try:
    import app
    print('✓ app.py can be imported')
except Exception as e:
    print(f'✗ app.py import failed: {e}')
"

echo "================================"
echo "Starting Streamlit..."
streamlit run app.py --server.port 8501 --server.address localhost &
STREAMLIT_PID=$!
echo "Streamlit started with PID: $STREAMLIT_PID"
echo "Waiting 3 seconds..."
sleep 3

if ps -p $STREAMLIT_PID > /dev/null; then
   echo "✓ Streamlit is running on http://localhost:8501"
else
   echo "✗ Streamlit process died"
fi
