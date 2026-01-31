#!/bin/bash

# ============================================================
# Initialize Supabase Locally
# ============================================================
# 
# PURPOSE:
# Set up local Supabase instance for development
#
# USAGE:
#   ./scripts/init-supabase-local.sh
#
# REQUIREMENTS:
# - Supabase CLI installed
# - Docker running
#
# ============================================================

set -e  # Exit on error

echo "============================================================"
echo "🚀 Initializing Local Supabase"
echo "============================================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo ""
    echo "Install with:"
    echo "  brew install supabase/tap/supabase"
    echo ""
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo ""
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")/.."

echo ""
echo "📁 Current directory: $(pwd)"
echo ""

# Check if Supabase is already initialized
if [ -d "supabase/.temp" ]; then
    echo "⚠️  Supabase already initialized"
    echo ""
    read -p "Do you want to reset? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔄 Stopping existing Supabase..."
        cd supabase && supabase stop
        echo "🗑️  Removing .temp directory..."
        rm -rf .temp
        cd ..
    else
        echo "✅ Keeping existing setup"
        exit 0
    fi
fi

# Start Supabase
echo "🚀 Starting Supabase..."
cd supabase
supabase start

echo ""
echo "============================================================"
echo "✅ Supabase Started Successfully!"
echo "============================================================"
echo ""
echo "📊 Access Points:"
echo "  Studio URL:  http://localhost:54323"
echo "  API URL:     http://localhost:54321"
echo "  DB URL:      postgresql://postgres:postgres@localhost:54322/postgres"
echo ""
echo "🔑 Credentials:"
echo "  anon key:    (see output above)"
echo "  service key: (see output above)"
echo ""
echo "📝 Next Steps:"
echo "  1. Apply migrations:"
echo "     cd supabase && supabase db push"
echo ""
echo "  2. View in Studio:"
echo "     open http://localhost:54323"
echo ""
echo "  3. Stop Supabase:"
echo "     cd supabase && supabase stop"
echo ""
echo "============================================================"
