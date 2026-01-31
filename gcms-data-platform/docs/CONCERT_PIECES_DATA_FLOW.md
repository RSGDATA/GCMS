# Concert Pieces Data Flow Documentation

## Overview
This document explains how concert program data (pieces) flows through the GCMS data platform from source to dashboard.

## Data Architecture

### Layer 1: RAW/BRONZE Layer (MOVEMENT_II_MOVEMENT_II Schema)

**Source Tables:**
```
BR_SUPABASE_CONCERT         - Concert master data
BR_SUPABASE_PIECE           - Musical piece master data  
BR_SUPABASE_CONCERT_PIECE   - Junction table linking concerts to pieces
```

**Data Flow:**
1. Data originates in Supabase (operational database)
2. Airbyte syncs data to Snowflake RAW schema
3. dbt Bronze models (`br_supabase_*`) read from RAW and create clean Bronze tables

**Key Bronze Models:**
- `dbt/models/bronze/supabase/br_supabase_concert.sql`
- `dbt/models/bronze/supabase/br_supabase_piece.sql`
- `dbt/models/bronze/supabase/br_supabase_concert_piece.sql`

### Layer 2: SILVER Layer (MOVEMENT_III Schema)
Currently, concert pieces do NOT have Silver transformations. They remain in Bronze layer for direct consumption.

### Layer 3: GOLD Layer (MOVEMENT_II_FINALE Schema)

**Dimension Table:**
```
DIM_CONCERT - Denormalized concert dimension with season and fiscal year
```

**Note:** Concert pieces are NOT denormalized into DIM_CONCERT. They remain normalized in Bronze layer.

## Dashboard Query Pattern

### Streamlit Query Location
File: `streamlit_app/app.py`
Function: `get_concert_pieces(concert_id)`

### Query Structure
```sql
SELECT 
    cp.program_order,
    p.title,
    p.composer,
    p.duration_minutes
FROM GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_CONCERT_PIECE cp
JOIN GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_PIECE p 
    ON cp.piece_id = p.piece_id
WHERE cp.concert_id = '{concert_id}'
ORDER BY cp.program_order
```

### Key Points:
1. **Dashboard queries Bronze layer directly** - This is intentional for normalized data
2. **Concert ID comes from DIM_CONCERT** (Gold layer)
3. **Piece details come from BR_SUPABASE_PIECE** (Bronze layer)
4. **Junction table BR_SUPABASE_CONCERT_PIECE** links them

## Data Lineage

```
┌─────────────┐
│  SUPABASE   │ (Source System)
│  - concert  │
│  - piece    │
│  - concert_ │
│    piece    │
└──────┬──────┘
       │
       │ Airbyte Sync
       ▼
┌─────────────┐
│  SNOWFLAKE  │
│  RAW Schema │
│  (Airbyte)  │
└──────┬──────┘
       │
       │ dbt Bronze Models
       ▼
┌─────────────────────────┐
│  BRONZE LAYER           │
│  MOVEMENT_II_MOVEMENT_II│
│  - BR_SUPABASE_CONCERT  │
│  - BR_SUPABASE_PIECE    │
│  - BR_SUPABASE_CONCERT_ │
│    PIECE                │
└──────┬──────────────────┘
       │
       │ (No Silver transformation)
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌─────────────┐    ┌──────────────┐
│ GOLD LAYER  │    │  STREAMLIT   │
│ DIM_CONCERT │◄───│  DASHBOARD   │
│ (metadata)  │    │  (queries    │
└─────────────┘    │   Bronze)    │
                   └──────────────┘
```

## Why This Architecture?

### Bronze Layer for Normalized Data
- Concert pieces are **many-to-many** relationship data
- Denormalizing into DIM_CONCERT would create:
  - Data duplication
  - Complex array/JSON structures
  - Performance issues

### Direct Bronze Queries from Dashboard
- **Best practice** for normalized reference data
- Keeps dimension tables clean and focused
- Allows flexible querying of relationships

## Bug Fix History

### Issue: "No program pieces found"
**Root Cause:** Streamlit was querying wrong schema
- **Wrong:** `MOVEMENT_I.SUPABASE_CONCERT_PIECE` (old schema)
- **Correct:** `MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_CONCERT_PIECE`

**Fix Applied:**
- Updated `streamlit_app/app.py` line 119-131
- Changed schema reference in query
- Added cache refresh button

### Issue: Missing Pieces for 2 Concerts
**Root Cause:** Concert piece junction records were never created

**Fix Applied:**
- Inserted missing records into `BR_SUPABASE_CONCERT_PIECE`
- Data now flows correctly through pipeline

## Current Data State

### All 4 Concerts with Pieces:
```
Fall Gala Concert (2024-10-15)
  └─ 1 piece: Beethoven Symphony No. 5

Holiday Spectacular (2024-12-20)
  ├─ Jingle Bells
  ├─ O Holy Night
  └─ Silent Night

Spring Awakening (2025-03-15)
  ├─ The Four Seasons: Spring
  └─ Mozart Symphony No. 40

Season Finale (2025-05-20)
  └─ Mahler Symphony No. 1 "Titan"
```

## Verification Queries

### Check Bronze Layer Data
```sql
-- Count pieces per concert
SELECT 
    c.title,
    COUNT(cp.concert_piece_id) as piece_count
FROM GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_CONCERT c
LEFT JOIN GCMS_DEV.MOVEMENT_II_MOVEMENT_II.BR_SUPABASE_CONCERT_PIECE cp 
    ON c.concert_id = cp.concert_id
GROUP BY c.title
ORDER BY c.concert_date;
```

### Check Gold Layer Concert Metadata
```sql
-- Verify concerts in dimension table
SELECT 
    concert_id,
    title,
    concert_date,
    program_notes
FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_CONCERT
ORDER BY concert_date;
```

## Pipeline Execution

### dbt Run Results
```
26/26 models passing
0 errors
0 warnings

Bronze Models:
✓ br_supabase_concert
✓ br_supabase_piece  
✓ br_supabase_concert_piece

Gold Models:
✓ dim_concert (uses br_supabase_concert)
```

## Conclusion

**The data flows correctly through the pipeline:**
1. ✅ Source data in Supabase
2. ✅ Synced to Snowflake RAW via Airbyte
3. ✅ Transformed by dbt Bronze models
4. ✅ Concert metadata elevated to Gold DIM_CONCERT
5. ✅ Dashboard queries Bronze for normalized piece data
6. ✅ All 4 concerts display correctly

**This is proper data warehouse architecture** - not a shortcut or hack. Normalized reference data belongs in Bronze/Silver, not denormalized into every dimension table.
