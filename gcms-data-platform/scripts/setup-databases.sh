#!/bin/bash
# ============================================================
# Database Setup Automation Script
# ============================================================
# This script automates the setup of Supabase and Snowflake
# Run after filling in credentials in .env file
# ============================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}============================================================${NC}"
echo -e "${BLUE}GCMS Data Platform - Database Setup${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# ============================================================
# Step 1: Load environment variables
# ============================================================
echo -e "${YELLOW}📋 Step 1: Loading environment variables...${NC}"

if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create .env file with your credentials"
    exit 1
fi

# Load .env file
export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)

echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo ""

# ============================================================
# Step 2: Verify Supabase CLI
# ============================================================
echo -e "${YELLOW}📋 Step 2: Verifying Supabase CLI...${NC}"

if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found!${NC}"
    echo "Install with: brew install supabase/tap/supabase"
    exit 1
fi

SUPABASE_VERSION=$(supabase --version)
echo -e "${GREEN}✅ Supabase CLI installed: $SUPABASE_VERSION${NC}"
echo ""

# ============================================================
# Step 3: Link Supabase Project
# ============================================================
echo -e "${YELLOW}📋 Step 3: Linking to Supabase project...${NC}"

cd "$PROJECT_ROOT"

# Extract project ref from URL
PROJECT_REF=$(echo $SUPABASE_URL | sed -n 's/.*https:\/\/\([^.]*\).*/\1/p')

if [ -z "$PROJECT_REF" ]; then
    echo -e "${RED}❌ Could not extract project ref from SUPABASE_URL${NC}"
    exit 1
fi

echo "Project ref: $PROJECT_REF"

# Check if already linked
if [ -f "$PROJECT_ROOT/.git/config" ] && grep -q "supabase" "$PROJECT_ROOT/.git/config" 2>/dev/null; then
    echo -e "${GREEN}✅ Already linked to Supabase project${NC}"
else
    echo "Linking to project..."
    supabase link --project-ref "$PROJECT_REF" || {
        echo -e "${YELLOW}⚠️  Link may have failed, but continuing...${NC}"
    }
fi

echo ""

# ============================================================
# Step 4: Run Supabase Migrations
# ============================================================
echo -e "${YELLOW}📋 Step 4: Running Supabase migrations...${NC}"

echo "This will create 14 tables in your Supabase database:"
echo "  - fiscal_year, season, concert"
echo "  - person, musician, user_profile"
echo "  - piece, concert_piece"
echo "  - rehearsal, concert_participant"
echo "  - rsvp, attendance"
echo "  - payment, contract"
echo ""

read -p "Continue with migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    supabase db push || {
        echo -e "${RED}❌ Migration failed!${NC}"
        echo "Check your SUPABASE_SERVICE_KEY in .env"
        exit 1
    }
    echo -e "${GREEN}✅ Supabase migrations completed!${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping Supabase migrations${NC}"
fi

echo ""

# ============================================================
# Step 5: Verify SnowSQL
# ============================================================
echo -e "${YELLOW}📋 Step 5: Verifying SnowSQL CLI...${NC}"

if ! command -v snowsql &> /dev/null; then
    echo -e "${RED}❌ SnowSQL not found!${NC}"
    echo "Install with: brew install snowflake-snowsql"
    echo "Then run this script again"
    exit 1
fi

echo -e "${GREEN}✅ SnowSQL installed${NC}"
echo ""

# ============================================================
# Step 6: Run Snowflake Setup
# ============================================================
echo -e "${YELLOW}📋 Step 6: Setting up Snowflake...${NC}"

echo "This will create in Snowflake:"
echo "  - Database: GCMS_DEV"
echo "  - Schemas: RAW, BRONZE, SILVER, GOLD"
echo "  - Warehouse: TRANSFORMING"
echo "  - Roles: TRANSFORMER, READER"
echo ""

read -p "Continue with Snowflake setup? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    snowsql \
        -a "$SNOWFLAKE_ACCOUNT" \
        -u "$SNOWFLAKE_USER" \
        -f "$SCRIPT_DIR/setup-snowflake-schemas.sql" || {
        echo -e "${RED}❌ Snowflake setup failed!${NC}"
        echo "Check your Snowflake credentials in .env"
        exit 1
    }
    echo -e "${GREEN}✅ Snowflake setup completed!${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping Snowflake setup${NC}"
fi

echo ""

# ============================================================
# Step 7: Verify Setup
# ============================================================
echo -e "${YELLOW}📋 Step 7: Verifying setup...${NC}"

echo "Checking Supabase tables..."
# This would require psql or supabase CLI query
echo -e "${GREEN}✅ Supabase verification skipped (manual check recommended)${NC}"

echo ""
echo "Checking Snowflake schemas..."
snowsql \
    -a "$SNOWFLAKE_ACCOUNT" \
    -u "$SNOWFLAKE_USER" \
    -q "SHOW SCHEMAS IN DATABASE GCMS_DEV;" || {
    echo -e "${YELLOW}⚠️  Could not verify Snowflake schemas${NC}"
}

echo ""

# ============================================================
# Success!
# ============================================================
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}✅ Database Setup Complete!${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Configure Airbyte connections (Supabase → Snowflake)"
echo "2. Add Snowflake connection to Airflow"
echo "3. Test the Cosmos DAG"
echo "4. Run your first pipeline!"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "  - Airbyte: docs/AIRBYTE_ABCTL_SETUP.md"
echo "  - dbt: dbt/README.md"
echo "  - Demo: docs/DEMO_SCRIPT.md"
echo ""
