/* ============================================================
   MIGRATION: Extensions
   Created: 2025-01-01
   Purpose: Enable required PostgreSQL extensions
   ============================================================ */

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Optional: Enable additional useful extensions
-- CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";  -- Query performance monitoring
-- CREATE EXTENSION IF NOT EXISTS "pg_trgm";             -- Fuzzy text search
