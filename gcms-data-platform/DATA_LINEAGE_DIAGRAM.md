# 🔄 Data Lineage Diagram - GCMS Data Platform

## End-to-End Data Flow: Supabase → Snowflake → Star Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LINEAGE OVERVIEW                              │
│                    From Source to Analytics-Ready Tables                     │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: SOURCE (Supabase PostgreSQL)                                      │
└─────────────────────────────────────────────────────────────────────────────┘

    📦 person                    📦 fiscal_year              📦 attendance
    📦 musician                  📦 season                   📦 payment
    📦 concert                   📦 piece                    📦 contract
    📦 rehearsal                 📦 concert_piece
    📦 concert_participant       📦 rsvp
    
                                      ⬇️
                            Python ETL Script
                    (manual-supabase-to-snowflake.py)
                                      ⬇️

┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2: RAW / LANDING (Snowflake MOVEMENT_I Schema)                       │
└─────────────────────────────────────────────────────────────────────────────┘

    🗄️ SUPABASE_PERSON              🗄️ SUPABASE_FISCAL_YEAR
    🗄️ SUPABASE_MUSICIAN            🗄️ SUPABASE_SEASON
    🗄️ SUPABASE_CONCERT             🗄️ SUPABASE_PIECE
    🗄️ SUPABASE_REHEARSAL           🗄️ SUPABASE_CONCERT_PIECE
    🗄️ SUPABASE_CONCERT_PARTICIPANT 🗄️ SUPABASE_RSVP
    🗄️ SUPABASE_ATTENDANCE          🗄️ SUPABASE_PAYMENT
    🗄️ SUPABASE_CONTRACT
    
                                      ⬇️
                                  dbt run
                                      ⬇️

┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 3: BRONZE (Snowflake MOVEMENT_II Schema) - Cleaned & Typed           │
└─────────────────────────────────────────────────────────────────────────────┘

    🥉 BR_SUPABASE_PERSON           🥉 BR_SUPABASE_FISCAL_YEAR
    🥉 BR_SUPABASE_MUSICIAN         🥉 BR_SUPABASE_SEASON
    🥉 BR_SUPABASE_CONCERT          🥉 BR_SUPABASE_PIECE
    🥉 BR_SUPABASE_REHEARSAL        🥉 BR_SUPABASE_CONCERT_PIECE
    🥉 BR_SUPABASE_CONCERT_PARTICIPANT
    🥉 BR_SUPABASE_ATTENDANCE
    🥉 BR_SUPABASE_PAYMENT
    
    📊 BR_ATTENDANCE_SCD2 (Slowly Changing Dimension Type 2)
    📊 BR_CONCERT_PARTICIPANT_SCD2
    📊 BR_CONTRACT_SCD2
    
                                      ⬇️
                                  dbt run
                                      ⬇️

┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 4: SILVER (Snowflake MOVEMENT_III Schema) - Business Logic           │
└─────────────────────────────────────────────────────────────────────────────┘

    🥈 STG_REHEARSAL (Staging)
    🥈 STG_ATTENDANCE
    🥈 STG_CONCERT_PARTICIPANT
    
    🔄 INT_REQUIRED_SERVICES (Intermediate)
    🔄 INT_ATTENDED_SERVICES
    🔄 INT_SERVICE_VALUE
    
                                      ⬇️
                                  dbt run
                                      ⬇️

┌─────────────────────────────────────────────────────────────────────────────┐
│  LAYER 5: GOLD (Snowflake FINALE Schema) - Analytics Ready ⭐               │
└─────────────────────────────────────────────────────────────────────────────┘

    🏆 DIM_CONCERT (Dimension)
    🏆 DIM_MUSICIAN (Dimension)
    💰 FCT_MUSICIAN_PAYMENT (Fact)
```

---

## 📊 Detailed Lineage for DIM_CONCERT

```
SOURCE TABLES (Supabase)
    ├── concert
    ├── season
    └── fiscal_year
         ⬇️
RAW LAYER (MOVEMENT_I)
    ├── SUPABASE_CONCERT
    ├── SUPABASE_SEASON
    └── SUPABASE_FISCAL_YEAR
         ⬇️
BRONZE LAYER (MOVEMENT_II)
    ├── BR_SUPABASE_CONCERT
    ├── BR_SUPABASE_SEASON
    └── BR_SUPABASE_FISCAL_YEAR
         ⬇️
GOLD LAYER (FINALE)
    └── DIM_CONCERT
        ├── Joins concert with season
        ├── Joins season with fiscal_year
        └── Creates denormalized dimension
```

**Transformation Logic:**
```sql
-- Simplified version of dim_concert.sql
SELECT 
    c.concert_id,
    c.title,
    c.concert_date,
    c.venue,
    c.total_budget,
    c.program_notes,
    s.season_id,
    s.name as season_name,
    s.description as season_description,
    f.fiscal_year_id,
    f.name as fiscal_year_name,
    f.start_date as fiscal_year_start,
    f.end_date as fiscal_year_end
FROM br_supabase_concert c
LEFT JOIN br_supabase_season s ON c.season_id = s.season_id
LEFT JOIN br_supabase_fiscal_year f ON s.fiscal_year_id = f.fiscal_year_id
```

---

## 🎵 Detailed Lineage for DIM_MUSICIAN

```
SOURCE TABLES (Supabase)
    ├── person
    └── musician
         ⬇️
RAW LAYER (MOVEMENT_I)
    ├── SUPABASE_PERSON
    └── SUPABASE_MUSICIAN
         ⬇️
BRONZE LAYER (MOVEMENT_II)
    ├── BR_SUPABASE_PERSON
    └── BR_SUPABASE_MUSICIAN
         ⬇️
GOLD LAYER (FINALE)
    └── DIM_MUSICIAN
        ├── Joins musician with person
        └── Creates denormalized dimension
```

**Transformation Logic:**
```sql
-- Simplified version of dim_musician.sql
SELECT 
    m.musician_id,
    m.person_id,
    p.first_name || ' ' || p.last_name as full_name,
    p.first_name,
    p.last_name,
    p.email,
    p.phone,
    m.instrument,
    m.section,
    m.chair_position,
    m.hire_date,
    m.status
FROM br_supabase_musician m
LEFT JOIN br_supabase_person p ON m.person_id = p.person_id
```

---

## 💰 Detailed Lineage for FCT_MUSICIAN_PAYMENT

```
SOURCE TABLES (Supabase)
    ├── payment
    ├── concert_participant
    ├── attendance
    └── contract
         ⬇️
RAW LAYER (MOVEMENT_I)
    ├── SUPABASE_PAYMENT
    ├── SUPABASE_CONCERT_PARTICIPANT
    ├── SUPABASE_ATTENDANCE
    └── SUPABASE_CONTRACT
         ⬇️
BRONZE LAYER (MOVEMENT_II)
    ├── BR_SUPABASE_PAYMENT
    ├── BR_SUPABASE_CONCERT_PARTICIPANT
    ├── BR_SUPABASE_ATTENDANCE
    ├── BR_ATTENDANCE_SCD2 (History)
    └── BR_CONCERT_PARTICIPANT_SCD2 (History)
         ⬇️
SILVER LAYER (MOVEMENT_III)
    ├── STG_ATTENDANCE
    ├── STG_CONCERT_PARTICIPANT
    ├── INT_REQUIRED_SERVICES
    ├── INT_ATTENDED_SERVICES
    └── INT_SERVICE_VALUE
         ⬇️
GOLD LAYER (FINALE)
    └── FCT_MUSICIAN_PAYMENT
        ├── Calculates payment amounts
        ├── Tracks service attendance
        └── Applies business rules
```

**Transformation Logic:**
```sql
-- Simplified version of fct_musician_payment.sql
WITH service_calcs AS (
    SELECT 
        concert_id,
        musician_id,
        COUNT(*) as attended_services,
        required_services,
        service_value
    FROM int_attended_services
    GROUP BY concert_id, musician_id, required_services, service_value
)
SELECT 
    MD5(concert_id || musician_id) as payment_key,
    concert_id,
    musician_id,
    pay_type,
    agreed_amount,
    attended_services,
    required_services,
    (attended_services * service_value) as gross_amount,
    deductions,
    (gross_amount - deductions) as net_amount
FROM service_calcs
```

---

## 🔄 Complete Data Flow Map

```
┌──────────────┐
│   SUPABASE   │ (Source System)
│  PostgreSQL  │
└──────┬───────┘
       │
       │ Python ETL
       │ (Extract & Load)
       ▼
┌──────────────┐
│  MOVEMENT_I  │ (Raw/Landing Zone)
│   Raw Data   │ - Exact copy from source
│              │ - No transformations
└──────┬───────┘
       │
       │ dbt: Bronze Models
       │ (Type casting, basic cleaning)
       ▼
┌──────────────┐
│ MOVEMENT_II  │ (Bronze Layer)
│   Cleaned    │ - Proper data types
│   + SCD2     │ - Historical tracking
└──────┬───────┘
       │
       │ dbt: Silver Models
       │ (Business logic, joins)
       ▼
┌──────────────┐
│ MOVEMENT_III │ (Silver Layer)
│ Intermediate │ - Staging tables
│   Business   │ - Calculated fields
│    Logic     │ - Service tracking
└──────┬───────┘
       │
       │ dbt: Gold Models
       │ (Dimensional modeling)
       ▼
┌──────────────┐
│   FINALE     │ (Gold Layer)
│ Star Schema  │ - DIM_CONCERT
│  Analytics   │ - DIM_MUSICIAN
│    Ready     │ - FCT_MUSICIAN_PAYMENT
└──────────────┘
       │
       │ BI Tools / Queries
       ▼
   📊 Reports
   📈 Dashboards
   🔍 Analysis
```

---

## 📋 Layer Responsibilities

### MOVEMENT_I (Raw)
- **Purpose:** Exact replica of source data
- **Transformations:** None
- **Retention:** Keep all historical loads
- **Use Case:** Audit trail, data recovery

### MOVEMENT_II (Bronze)
- **Purpose:** Cleaned and typed data
- **Transformations:** 
  - Data type casting
  - NULL handling
  - SCD2 history tracking
- **Use Case:** Foundation for all downstream models

### MOVEMENT_III (Silver)
- **Purpose:** Business logic application
- **Transformations:**
  - Joins across tables
  - Calculated fields
  - Service attendance tracking
  - Payment calculations
- **Use Case:** Reusable business logic

### FINALE (Gold)
- **Purpose:** Analytics-ready star schema
- **Transformations:**
  - Dimensional modeling
  - Denormalization
  - Aggregation-friendly structure
- **Use Case:** BI tools, reporting, analysis

---

## 🎯 Key Transformation Points

### 1. Concert Dimension Enrichment
```
concert → + season → + fiscal_year → DIM_CONCERT
```

### 2. Musician Dimension Enrichment
```
musician → + person → DIM_MUSICIAN
```

### 3. Payment Fact Calculation
```
attendance + concert_participant + contract → 
  service calculations → 
    payment amounts → 
      FCT_MUSICIAN_PAYMENT
```

---

## 📊 Data Quality Checks

Each layer includes validation:

1. **Bronze:** Row counts match raw
2. **Silver:** Business rules applied correctly
3. **Gold:** Referential integrity maintained

---

## 🔍 Traceability

Every record can be traced back to source:
```
FCT_MUSICIAN_PAYMENT.PAYMENT_KEY
  → Links to CONCERT_ID and MUSICIAN_ID
    → Traces to BR_SUPABASE_* tables
      → Traces to SUPABASE_* tables
        → Original Supabase record
```

---

## 📍 Schema Locations

| Layer | Schema | Purpose |
|-------|--------|---------|
| Raw | `MOVEMENT_I` | Landing zone |
| Bronze | `MOVEMENT_II` | Cleaned data |
| Silver | `MOVEMENT_III` | Business logic |
| Gold | `FINALE` | Star schema |

**Your complete data lineage is documented!** 🎉
