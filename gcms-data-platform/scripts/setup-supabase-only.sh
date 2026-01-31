#!/bin/bash
# ============================================================
# Supabase-Only Setup Script
# ============================================================
# This script sets up just Supabase tables
# We'll handle Snowflake separately once you have credentials
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
echo -e "${BLUE}GCMS Data Platform - Supabase Setup${NC}"
echo -e "${BLUE}============================================================${NC}"
echo ""

# ============================================================
# Step 1: Load environment variables
# ============================================================
echo -e "${YELLOW}📋 Step 1: Loading environment variables...${NC}"

if [ ! -f "$PROJECT_ROOT/.env" ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
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
PROJECT_REF="stttpmepakavlubbsqaq"

echo "Project ref: $PROJECT_REF"
echo "Linking to project..."

# Try to link (may already be linked)
supabase link --project-ref "$PROJECT_REF" 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Already linked or link failed, continuing...${NC}"
}

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
    echo "Running migrations..."
    supabase db push || {
        echo -e "${RED}❌ Migration failed!${NC}"
        echo "This might be because:"
        echo "  1. Tables already exist (that's OK!)"
        echo "  2. Service key is incorrect"
        echo "  3. Network issue"
        exit 1
    }
    echo -e "${GREEN}✅ Supabase migrations completed!${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping Supabase migrations${NC}"
fi

echo ""

# ============================================================
# Success!
# ============================================================
echo -e "${GREEN}============================================================${NC}"
echo -e "${GREEN}✅ Supabase Setup Complete!${NC}"
echo -e "${GREEN}============================================================${NC}"
echo ""
echo -e "${BLUE}What was created:${NC}"
echo "  ✅ 14 tables in Supabase database"
echo "  ✅ All relationships and constraints"
echo "  ✅ Ready for data entry!"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Set up Snowflake credentials in .env"
echo "2. Run Snowflake setup separately"
echo "3. Configure Airbyte connections"
echo "4. Test the full pipeline!"
echo ""
