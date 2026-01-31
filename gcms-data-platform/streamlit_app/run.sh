#!/bin/bash
# Quick start script for GCMS Concert Explorer

echo "🎵 Starting GCMS Concert Explorer..."
echo ""

# Check if secrets.toml exists
if [ ! -f ".streamlit/secrets.toml" ]; then
    echo "⚠️  Warning: .streamlit/secrets.toml not found!"
    echo "Creating from template..."
    cp .streamlit/secrets.toml.example .streamlit/secrets.toml
    echo ""
    echo "📝 Please edit .streamlit/secrets.toml with your Snowflake credentials"
    echo "   Then run this script again."
    exit 1
fi

# Check if dependencies are installed
if ! python -c "import streamlit" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

echo "🚀 Launching Streamlit app..."
echo "   App will open at: http://localhost:8501"
echo ""

# Run streamlit
streamlit run app.py
