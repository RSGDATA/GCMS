# GCMS Data Platform - dbt Models

## Overview

This dbt project transforms raw Supabase data replicated to Snowflake into clean, auditable facts and dimensions following **bi-temporal SCD Type 2** principles.

**Core Principle**: History is sacred. State is derived.

## Architecture

```
RAW (Airbyte) → BRONZE (dbt) → SILVER (dbt) → GOLD (dbt)
```

### Layer Breakdown

#### **Bronze Layer** - Raw Truth
- **Purpose**: Immutable mirror of source systems
- **Materialization**: Table (for stability)
- **Schema**: `bronze`
- **Models**:
  - 14 raw mirror models (`br_supabase_*`)
  - 3 SCD2 history models (`br_*_scd2`)

#### **Silver Layer** - Semantic Truth
- **Purpose**: Clean, business-ready data with history preserved
- **Schema**: `silver`
- **Models**:
  - **Staging**: Clean and standardize (3 models)
  - **Intermediate**: Business rules applied (3 models)

#### **Gold Layer** - Presentation Truth
- **Purpose**: Aggregated, reporting-ready views
- **Materialization**: Table (for performance)
- **Schema**: `gold`
- **Models**:
  - **Facts**: `fct_musician_payment` (THE payroll calculation)
  - **Dimensions**: `dim_musician`, `dim_concert`

## Key Features

### 1. Bi-Temporal SCD Type 2

The `bitemporal_scd2` macro tracks **two time dimensions**:

1. **Business Time** (`effective_from`/`effective_to`) - When it happened in reality
2. **System Time** (`recorded_at`) - When the system learned about it

**This enables**:
- Payroll reproducibility: "What did payroll see on March 5?"
- Retroactive corrections: "What was corrected after the fact?"
- Historical reconstruction: "What was true on Feb 28?"
- Audit trails without manual reconciliation

### 2. Authoritative Payroll Calculation

`fct_musician_payment` is the **single source of truth** for payroll:

**Business Rules**:
- **Lump Sum Musicians**: 
  - Gross = agreed_amount
  - Deductions = (missed_services × per_service_value)
  - Net = Gross - Deductions

- **Per Service Musicians**:
  - Gross = attended_services × agreed_amount
  - Deductions = 0
  - Net = Gross

**Characteristics**:
- ✅ Recomputable (deterministic from source data)
- ✅ Auditable (all logic visible in SQL)
- ✅ Version-controlled (changes tracked in git)
- ✅ Testable (dbt tests ensure correctness)

### 3. Comprehensive Data Quality Tests

- **Uniqueness**: Primary keys and composite keys
- **Not Null**: Critical fields
- **Accepted Values**: Enums and constrained fields
- **Range Checks**: Numeric bounds
- **Business Logic**: `net = gross - deductions`, `attended ≤ required`
- **SCD2 Integrity**: Only one current version per natural key

## Quick Start

### Prerequisites

```bash
# Install dbt with Snowflake adapter
pip install dbt-snowflake

# Install dbt packages
cd dbt
dbt deps
```

### Configuration

1. **Set environment variables**:
```bash
export SNOWFLAKE_ACCOUNT=your_account
export SNOWFLAKE_USER=your_user
export SNOWFLAKE_PASSWORD=your_password
export SNOWFLAKE_DATABASE=GCMS_DEV
export SNOWFLAKE_WAREHOUSE=TRANSFORMING
export SNOWFLAKE_ROLE=TRANSFORMER
```

2. **Copy profiles.yml** to `~/.dbt/profiles.yml` (or use the one in this directory)

### Running dbt

```bash
# Run all models
dbt run

# Run specific layer
dbt run --select bronze
dbt run --select silver
dbt run --select gold

# Run tests
dbt test

# Run specific model and its dependencies
dbt run --select +fct_musician_payment

# Run specific model and its downstream dependencies
dbt run --select fct_musician_payment+

# Generate documentation
dbt docs generate
dbt docs serve
```

## Model Dependency Graph

```
Sources (raw.supabase_*)
    ↓
Bronze Raw Mirrors (br_supabase_*)
    ↓
Bronze SCD2 (br_*_scd2)
    ↓
Silver Staging (stg_*)
    ↓
Silver Intermediate (int_*)
    ↓
Gold Facts & Dimensions (fct_*, dim_*)
```

## Critical Models

### `fct_musician_payment`
**Purpose**: Authoritative payroll calculation  
**Depends On**: `stg_concert_participant`, `int_attended_services`, `int_required_services`  
**Used By**: Payroll system, financial reporting  
**Tests**: 8 critical tests including business logic validation

### `br_attendance_scd2`
**Purpose**: Bi-temporal attendance history  
**Depends On**: `br_supabase_attendance`  
**Used By**: `stg_attendance`, payroll reproducibility queries  
**Tests**: SCD2 integrity, uniqueness

### `br_concert_participant_scd2`
**Purpose**: Bi-temporal pay terms history  
**Depends On**: `br_supabase_concert_participant`  
**Used By**: `stg_concert_participant`, contract audits  
**Tests**: SCD2 integrity, uniqueness

## Example Queries

### Current Payroll
```sql
SELECT 
    m.full_name,
    m.instrument,
    c.title as concert,
    p.pay_type,
    p.net_amount
FROM gold.fct_musician_payment p
JOIN gold.dim_musician m ON p.musician_id = m.musician_id
JOIN gold.dim_concert c ON p.concert_id = c.concert_id
ORDER BY p.net_amount DESC;
```

### Payroll as of Specific Date (Reproducibility)
```sql
-- What did payroll see on March 5, 2025?
SELECT *
FROM bronze.br_concert_participant_scd2
WHERE recorded_at <= timestamp '2025-03-05 12:00:00'
  AND is_current = true;
```

### Retroactive Corrections
```sql
-- Find all corrections made after the fact
SELECT *
FROM bronze.br_attendance_scd2
WHERE recorded_at > effective_from
ORDER BY recorded_at DESC;
```

### Concert Budget vs Actual
```sql
SELECT 
    c.title,
    c.concert_date,
    c.total_budget,
    SUM(p.net_amount) as total_payroll,
    c.total_budget - SUM(p.net_amount) as budget_remaining
FROM gold.dim_concert c
LEFT JOIN gold.fct_musician_payment p ON c.concert_id = p.concert_id
GROUP BY c.concert_id, c.title, c.concert_date, c.total_budget;
```

## Testing Strategy

### Run All Tests
```bash
dbt test
```

### Test Specific Model
```bash
dbt test --select fct_musician_payment
```

### Test Specific Layer
```bash
dbt test --select bronze
dbt test --select silver
dbt test --select gold
```

### Critical Tests (Must Pass Before Payroll)
```bash
# These tests MUST pass before making payments
dbt test --select fct_musician_payment
```

## Deployment

### Development
```bash
dbt run --target dev
dbt test --target dev
```

### Production
```bash
dbt run --target prod
dbt test --target prod
```

### CI/CD
```bash
dbt run --target ci
dbt test --target ci --store-failures
```

## Troubleshooting

### Model Fails to Build
```bash
# Check dependencies
dbt run --select +model_name

# Check compiled SQL
dbt compile --select model_name
cat target/compiled/gcms_data_platform/models/.../model_name.sql
```

### Test Failures
```bash
# Run tests with verbose output
dbt test --select model_name --store-failures

# Query failed test results
SELECT * FROM test_results.unique_model_name_column_name;
```

### SCD2 Issues
```bash
# Check for duplicate current versions
SELECT 
    natural_key,
    COUNT(*) as version_count
FROM bronze.br_attendance_scd2
WHERE is_current = true
GROUP BY natural_key
HAVING COUNT(*) > 1;
```

## Maintenance

### Refresh All Models
```bash
dbt run --full-refresh
```

### Refresh Specific Incremental Model
```bash
dbt run --select br_attendance_scd2 --full-refresh
```

### Clean Old Artifacts
```bash
dbt clean
```

## Best Practices

1. **Never modify Bronze layer** - It's the source of truth
2. **Always test before deploying** - Run `dbt test` before production
3. **Document changes** - Update model descriptions and comments
4. **Version control everything** - All changes go through git
5. **Monitor test failures** - Set up alerts for critical test failures
6. **Review SCD2 logic carefully** - Historical data is sacred

## Resources

- [dbt Documentation](https://docs.getdbt.com/)
- [dbt Best Practices](https://docs.getdbt.com/guides/best-practices)
- [Slowly Changing Dimensions](https://en.wikipedia.org/wiki/Slowly_changing_dimension)
- [Bi-Temporal Data](https://en.wikipedia.org/wiki/Temporal_database)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review model documentation: `dbt docs generate && dbt docs serve`
3. Check compiled SQL: `dbt compile --select model_name`
4. Contact the data team

---

**Last Updated**: 2025-12-30  
**dbt Version**: 1.0+  
**Snowflake Adapter**: Latest
