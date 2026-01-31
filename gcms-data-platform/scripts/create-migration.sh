#!/bin/bash

# ============================================================
# Create New Supabase Migration
# ============================================================
# 
# PURPOSE:
# Helper script to create a new migration file with proper naming
#
# USAGE:
#   ./scripts/create-migration.sh "description_of_change"
#
# EXAMPLE:
#   ./scripts/create-migration.sh "add_user_preferences_table"
#
# ============================================================

set -e  # Exit on error

# Check if description provided
if [ -z "$1" ]; then
    echo "❌ Error: Migration description required"
    echo ""
    echo "Usage:"
    echo "  ./scripts/create-migration.sh \"description_of_change\""
    echo ""
    echo "Example:"
    echo "  ./scripts/create-migration.sh \"add_user_preferences_table\""
    echo ""
    exit 1
fi

DESCRIPTION=$1

# Navigate to project root
cd "$(dirname "$0")/.."

echo "============================================================"
echo "📝 Creating New Migration"
echo "============================================================"
echo ""
echo "Description: $DESCRIPTION"
echo ""

# Generate timestamp (YYYYMMDDHHMMSS format)
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Create filename
FILENAME="${TIMESTAMP}_${DESCRIPTION}.sql"
FILEPATH="supabase/migrations/${FILENAME}"

# Create migration file with template
cat > "$FILEPATH" << 'EOF'
-- ============================================================
-- Migration: DESCRIPTION
-- Created: TIMESTAMP
-- ============================================================

BEGIN;

-- Add your migration SQL here
-- Example:
-- CREATE TABLE IF NOT EXISTS public.example (
--     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name TEXT NOT NULL,
--     created_at TIMESTAMPTZ DEFAULT NOW(),
--     updated_at TIMESTAMPTZ DEFAULT NOW()
-- );

-- Remember to:
-- 1. Add indexes for foreign keys
-- 2. Add RLS policies if needed
-- 3. Grant appropriate permissions
-- 4. Add comments for documentation

COMMIT;

-- ============================================================
-- Rollback (for reference - not automatically executed)
-- ============================================================
-- BEGIN;
-- DROP TABLE IF EXISTS public.example;
-- COMMIT;
EOF

# Replace placeholders
sed -i '' "s/DESCRIPTION/$DESCRIPTION/g" "$FILEPATH"
sed -i '' "s/TIMESTAMP/$(date '+%Y-%m-%d %H:%M:%S')/g" "$FILEPATH"

echo "✅ Migration file created:"
echo "   $FILEPATH"
echo ""
echo "📝 Next steps:"
echo "   1. Edit the migration file:"
echo "      code $FILEPATH"
echo ""
echo "   2. Test locally:"
echo "      cd supabase && supabase db push"
echo ""
echo "   3. Verify in Supabase Studio:"
echo "      open http://localhost:54323"
echo ""
echo "   4. Commit to git:"
echo "      git add $FILEPATH"
echo "      git commit -m \"Add migration: $DESCRIPTION\""
echo ""
echo "============================================================"
