# dbt Operations Runbook
## GCMS Data Platform

**Purpose**: Step-by-step operational procedures for running and maintaining the dbt transformation layer.

**Audience**: Data engineers, DevOps, on-call personnel

**Last Updated**: 2025-12-30

---

## Table of Contents

1. [Daily Operations](#daily-operations)
2. [Weekly Operations](#weekly-operations)
3. [Monthly Operations](#monthly-operations)
4. [Emergency Procedures](#emergency-procedures)
5. [Troubleshooting Guide](#troubleshooting-guide)
6. [Payroll Procedures](#payroll-procedures)
7. [Data Quality Monitoring](#data-quality-monitoring)

---

## Daily Operations

### Morning Health Check (10 minutes)

**Frequency**: Every business day at 9:00 AM

**Steps**:

1. **Check last run status**
   ```bash
   cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/dbt
   
   # Check run logs
   tail -n 100 logs/dbt.log
   ```

2. **Verify data freshness**
   ```sql
   -- Run in Snowflake
   SELECT 
       table_name,
       MAX(_airbyte_emitted_at) as last_updated,
       DATEDIFF(hour, MAX(_airbyte_emitted_at), CURRENT_TIMESTAMP()) as hours_since_update
   FROM raw.information_schema.tables
   WHERE table_schema = 'RAW'
     AND table_name LIKE 'supabase_%'
   GROUP BY table_name
   HAVING hours_since_update > 24;
   ```
   
   **Expected**: No tables older than 24 hours
   
   **If Failed**: Check Airbyte ingestion status

3. **Run dbt tests**
   ```bash
   dbt test --select gold
   ```
   
   **Expected**: All tests pass
   
   **If Failed**: See [Troubleshooting Guide](#troubleshooting-guide)

4. **Check critical fact table**
   ```sql
   -- Verify fct_musician_payment has recent data
   SELECT 
       COUNT(*) as payment_count,
       MAX(calculated_at) as last_calculation
   FROM gold.fct_musician_payment;
   ```
   
   **Expected**: `last_calculation` within last 24 hours

---

## Weekly Operations

### Full Model Refresh (30 minutes)

**Frequency**: Every Sunday at 2:00 AM

**Steps**:

1. **Backup current state** (optional but recommended)
   ```sql
   -- Create backup schemas
   CREATE SCHEMA IF NOT EXISTS bronze_backup;
   CREATE SCHEMA IF NOT EXISTS silver_backup;
   CREATE SCHEMA IF NOT EXISTS gold_backup;
   
   -- Clone critical tables
   CREATE OR REPLACE TABLE bronze_backup.br_attendance_scd2 
       CLONE bronze.br_attendance_scd2;
   CREATE OR REPLACE TABLE gold_backup.fct_musician_payment 
       CLONE gold.fct_musician_payment;
   ```

2. **Run full refresh**
   ```bash
   cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/dbt
   
   # Full refresh all models
   dbt run --full-refresh
   ```
   
   **Expected Duration**: 15-20 minutes
   
   **If Fails**: Restore from backup and investigate

3. **Run all tests**
   ```bash
   dbt test
   ```
   
   **Expected**: All tests pass

4. **Verify row counts**
   ```sql
   -- Compare row counts before/after
   SELECT 
       'bronze.br_attendance_scd2' as table_name,
       COUNT(*) as row_count
   FROM bronze.br_attendance_scd2
   UNION ALL
   SELECT 
       'gold.fct_musician_payment',
       COUNT(*)
   FROM gold.fct_musician_payment;
   ```

5. **Generate fresh documentation**
   ```bash
   dbt docs generate
   dbt docs serve --port 8001
   ```

---

## Monthly Operations

### Data Quality Audit (1 hour)

**Frequency**: First Monday of each month

**Steps**:

1. **Review SCD2 integrity**
   ```sql
   -- Check for duplicate current versions
   SELECT 
       'br_attendance_scd2' as table_name,
       natural_key,
       COUNT(*) as current_version_count
   FROM bronze.br_attendance_scd2
   WHERE is_current = true
   GROUP BY natural_key
   HAVING COUNT(*) > 1;
   
   -- Repeat for other SCD2 tables
   ```
   
   **Expected**: Zero rows returned

2. **Review retroactive corrections**
   ```sql
   -- Find corrections made after the fact
   SELECT 
       DATE_TRUNC('month', recorded_at) as correction_month,
       COUNT(*) as correction_count
   FROM bronze.br_attendance_scd2
   WHERE recorded_at > effective_from
   GROUP BY correction_month
   ORDER BY correction_month DESC
   LIMIT 12;
   ```
   
   **Action**: Review patterns, identify root causes

3. **Payroll accuracy check**
   ```sql
   -- Compare dbt calculations with Supabase payment table
   SELECT 
       dbt.concert_id,
       dbt.musician_id,
       dbt.net_amount as dbt_calculated,
       src.net_amount as source_recorded,
       dbt.net_amount - src.net_amount as difference
   FROM gold.fct_musician_payment dbt
   JOIN bronze.br_supabase_payment src
       ON dbt.concert_id = src.concert_id
      AND dbt.musician_id = src.musician_id
   WHERE ABS(dbt.net_amount - src.net_amount) > 0.01;
   ```
   
   **Expected**: Zero discrepancies
   
   **If Discrepancies**: Investigate business logic changes

4. **Performance review**
   ```sql
   -- Check model run times
   SELECT 
       model_name,
       AVG(execution_time_seconds) as avg_runtime,
       MAX(execution_time_seconds) as max_runtime
   FROM dbt_run_history
   WHERE run_date >= DATEADD(month, -1, CURRENT_DATE())
   GROUP BY model_name
   ORDER BY avg_runtime DESC
   LIMIT 20;
   ```
   
   **Action**: Optimize slow models if needed

---

## Emergency Procedures

### Critical Test Failure

**Scenario**: `dbt test --select fct_musician_payment` fails

**Impact**: HIGH - Payroll calculations may be incorrect

**Steps**:

1. **STOP**: Do not process payroll until resolved

2. **Identify failing test**
   ```bash
   dbt test --select fct_musician_payment --store-failures
   ```

3. **Query failed test results**
   ```sql
   -- Example: Check net amount calculation
   SELECT * 
   FROM test_results.expression_is_true_fct_musician_payment_net_amount_gross_amount_deductions
   LIMIT 100;
   ```

4. **Common failures and fixes**:

   **Test**: `net_amount = gross_amount - deductions`
   - **Cause**: Rounding errors, null handling
   - **Fix**: Review calculation logic in `fct_musician_payment.sql`
   
   **Test**: `attended_services <= required_services`
   - **Cause**: Data quality issue in attendance or rehearsal tables
   - **Fix**: Check source data, may need manual correction
   
   **Test**: `pay_type != 'per_service' OR deductions = 0`
   - **Cause**: Business logic error
   - **Fix**: Review deduction calculation

5. **Escalation**:
   - If not resolved in 30 minutes, escalate to senior data engineer
   - Document issue in incident log
   - Notify payroll team of delay

### SCD2 Corruption

**Scenario**: Multiple current versions for same natural key

**Impact**: MEDIUM - Historical queries may return incorrect results

**Steps**:

1. **Identify affected records**
   ```sql
   SELECT 
       natural_key,
       COUNT(*) as current_count,
       LISTAGG(scd_id, ', ') as scd_ids
   FROM bronze.br_attendance_scd2
   WHERE is_current = true
   GROUP BY natural_key
   HAVING COUNT(*) > 1;
   ```

2. **Determine correct current version**
   ```sql
   -- Show all versions for affected natural_key
   SELECT *
   FROM bronze.br_attendance_scd2
   WHERE natural_key = '<affected_key>'
   ORDER BY recorded_at DESC, inserted_at DESC;
   ```

3. **Manual correction** (use with caution)
   ```sql
   -- Close out incorrect current version
   UPDATE bronze.br_attendance_scd2
   SET 
       is_current = false,
       effective_to = DATEADD(day, -1, '<correct_effective_from>'),
       updated_at = CURRENT_TIMESTAMP()
   WHERE scd_id = '<incorrect_scd_id>';
   ```

4. **Verify fix**
   ```bash
   dbt test --select br_attendance_scd2
   ```

5. **Root cause analysis**:
   - Review recent dbt runs
   - Check for concurrent executions
   - Review macro logic

### Data Pipeline Failure

**Scenario**: Airbyte ingestion fails, no new data in RAW

**Impact**: MEDIUM - Stale data in warehouse

**Steps**:

1. **Check Airbyte status**
   - Access Airbyte UI
   - Review connection status
   - Check error logs

2. **Verify Supabase connectivity**
   ```bash
   # Test connection
   psql "postgresql://user:pass@host:port/database" -c "SELECT 1;"
   ```

3. **Manual data check**
   ```sql
   -- Check if Supabase has new data
   SELECT 
       MAX(updated_at) as last_update
   FROM supabase.attendance;
   ```

4. **If Airbyte is down**:
   - Restart Airbyte containers
   - Trigger manual sync
   - Monitor for successful completion

5. **Once resolved, run dbt**
   ```bash
   dbt run
   dbt test
   ```

---

## Payroll Procedures

### Pre-Payroll Checklist

**When**: Before processing any payroll

**Steps**:

1. **Verify data freshness**
   ```sql
   SELECT 
       MAX(_airbyte_emitted_at) as last_ingestion
   FROM bronze.br_supabase_attendance;
   ```
   
   **Required**: Data from within last 24 hours

2. **Run dbt models**
   ```bash
   dbt run --select +fct_musician_payment
   ```
   
   **Required**: Successful completion

3. **Run critical tests**
   ```bash
   dbt test --select fct_musician_payment
   ```
   
   **Required**: ALL tests pass

4. **Manual spot check**
   ```sql
   -- Review a sample of payments
   SELECT 
       m.full_name,
       c.title,
       p.pay_type,
       p.attended_services,
       p.required_services,
       p.gross_amount,
       p.deductions,
       p.net_amount
   FROM gold.fct_musician_payment p
   JOIN gold.dim_musician m ON p.musician_id = m.musician_id
   JOIN gold.dim_concert c ON p.concert_id = c.concert_id
   WHERE c.concert_date >= DATEADD(day, -30, CURRENT_DATE())
   ORDER BY RANDOM()
   LIMIT 10;
   ```
   
   **Action**: Manually verify calculations make sense

5. **Export payroll data**
   ```sql
   -- Generate payroll file
   SELECT 
       m.full_name,
       m.email,
       c.title as concert,
       c.concert_date,
       p.pay_type,
       p.net_amount,
       p.calculated_at
   FROM gold.fct_musician_payment p
   JOIN gold.dim_musician m ON p.musician_id = m.musician_id
   JOIN gold.dim_concert c ON p.concert_id = c.concert_id
   WHERE c.concert_id = '<target_concert_id>'
   ORDER BY m.last_name, m.first_name;
   ```

6. **Sign-off**:
   - Data engineer: Confirms tests pass
   - Finance: Reviews spot checks
   - Manager: Approves for processing

### Post-Payroll Verification

**When**: After payroll is processed

**Steps**:

1. **Record payroll run**
   ```sql
   -- Update payment records (if tracking in Supabase)
   UPDATE supabase.payment
   SET 
       paid = true,
       payment_date = CURRENT_DATE()
   WHERE concert_id = '<target_concert_id>';
   ```

2. **Archive payroll snapshot**
   ```sql
   -- Create historical snapshot
   CREATE TABLE gold.fct_musician_payment_<YYYYMMDD> 
       CLONE gold.fct_musician_payment;
   ```

3. **Document in log**
   - Concert ID
   - Payment date
   - Total amount paid
   - Number of musicians
   - Any exceptions or adjustments

---

## Troubleshooting Guide

### Common Issues

#### Issue: Model fails with "relation does not exist"

**Cause**: Upstream dependency not built

**Solution**:
```bash
# Build model with all dependencies
dbt run --select +failing_model
```

#### Issue: SCD2 model shows no changes

**Cause**: Source data hasn't changed, or change detection logic issue

**Solution**:
```sql
-- Check if source has new data
SELECT 
    COUNT(*) as total_rows,
    MAX(_airbyte_emitted_at) as last_update
FROM bronze.br_supabase_attendance;

-- Force full refresh if needed
dbt run --select br_attendance_scd2 --full-refresh
```

#### Issue: Tests pass locally but fail in production

**Cause**: Environment differences (data, configuration)

**Solution**:
```bash
# Compare row counts
dbt run --target dev
dbt run --target prod

# Check for data differences
# Review profiles.yml for configuration differences
```

#### Issue: Slow model performance

**Cause**: Large data volumes, inefficient SQL

**Solution**:
```bash
# Check compiled SQL
dbt compile --select slow_model
cat target/compiled/.../slow_model.sql

# Consider:
# - Adding indexes in Snowflake
# - Materializing as table instead of view
# - Breaking into smaller models
# - Using incremental materialization
```

---

## Data Quality Monitoring

### Key Metrics to Track

1. **Model Run Success Rate**
   - Target: 99%+
   - Alert if: < 95%

2. **Test Pass Rate**
   - Target: 100%
   - Alert if: Any critical test fails

3. **Data Freshness**
   - Target: < 24 hours
   - Alert if: > 48 hours

4. **SCD2 Integrity**
   - Target: 0 duplicate current versions
   - Alert if: Any duplicates found

5. **Payroll Calculation Accuracy**
   - Target: 100% match with manual calculations
   - Alert if: Any discrepancy > $0.01

### Monitoring Queries

```sql
-- Daily health check query
WITH freshness AS (
    SELECT 
        'attendance' as table_name,
        MAX(_airbyte_emitted_at) as last_update,
        DATEDIFF(hour, MAX(_airbyte_emitted_at), CURRENT_TIMESTAMP()) as hours_old
    FROM bronze.br_supabase_attendance
),
scd2_integrity AS (
    SELECT 
        'attendance_scd2' as table_name,
        COUNT(DISTINCT CASE WHEN is_current THEN natural_key END) as unique_current,
        COUNT(CASE WHEN is_current THEN 1 END) as total_current
    FROM bronze.br_attendance_scd2
),
payment_stats AS (
    SELECT 
        'fct_musician_payment' as table_name,
        COUNT(*) as row_count,
        MAX(calculated_at) as last_calculation
    FROM gold.fct_musician_payment
)
SELECT * FROM freshness
UNION ALL
SELECT table_name, unique_current, total_current FROM scd2_integrity
UNION ALL
SELECT table_name, row_count, last_calculation FROM payment_stats;
```

---

## Contact Information

**Data Engineering Team**:
- Primary: data-team@gcms.org
- On-call: +1-XXX-XXX-XXXX

**Escalation Path**:
1. Data Engineer (15 min)
2. Senior Data Engineer (30 min)
3. Engineering Manager (1 hour)

**External Dependencies**:
- Supabase Support: support@supabase.com
- Snowflake Support: support@snowflake.com
- Airbyte Community: community.airbyte.com

---

## Appendix

### Useful Commands

```bash
# Quick health check
dbt run --select gold && dbt test --select gold

# Rebuild specific model and downstream
dbt run --select model_name+

# Run only failed tests
dbt test --select result:fail

# Generate and serve docs
dbt docs generate && dbt docs serve

# Clean artifacts
dbt clean

# Debug specific model
dbt run --select model_name --debug
```

### Log Locations

- dbt logs: `dbt/logs/dbt.log`
- Compiled SQL: `dbt/target/compiled/`
- Run artifacts: `dbt/target/run/`
- Test results: Snowflake `test_results` schema

---

**Document Version**: 1.0  
**Last Reviewed**: 2025-12-30  
**Next Review**: 2026-01-30
