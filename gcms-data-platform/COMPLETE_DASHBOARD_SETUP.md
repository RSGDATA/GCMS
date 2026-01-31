# GCMS Concert Explorer - Complete Setup

## ✅ What's Already Done

1. **Streamlit Dashboard Built** - Located at `streamlit_app/app.py`
2. **Snowflake Connection Configured** - Using secure key pair authentication
3. **All SQL Queries Fixed** - Proper schema names and UUID quoting
4. **Dashboard Running** - Available at http://localhost:8501

## 📊 Current Status

**Working Concerts (with full data):**
- Fall Gala Concert (2024-10-15) ✅
- Holiday Spectacular (2024-12-20) ✅

**Missing Data:**
- Spring Awakening (2025-03-15) ❌
- Summer Festival (2025-06-20) ❌

## 🎯 To Complete: Add Missing Concert Data

### Option 1: Run via Snowflake Web UI (EASIEST)

1. **Open Snowflake** in your browser
2. **Navigate to** Worksheets
3. **Copy the entire contents** of `scripts/add-missing-concert-data.sql`
4. **Paste into** a new worksheet
5. **Click "Run All"**
6. **Verify** the output shows data was inserted

### Option 2: The SQL to Run

```sql
USE DATABASE GCMS_DEV;
USE SCHEMA MOVEMENT_I;

-- Add participants for Spring Awakening
INSERT INTO SUPABASE_CONCERT_PARTICIPANT (concert_participant_id, concert_id, musician_id, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), 'e94ffdc0-99f5-4a38-a78f-e4e428420615', musician_id, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM (SELECT musician_id FROM BR_SUPABASE_MUSICIAN LIMIT 5);

-- Add payments for Spring Awakening  
INSERT INTO SUPABASE_PAYMENT (payment_id, musician_id, concert_id, pay_type, agreed_amount, deductions, net_amount, payment_date, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), cp.musician_id, cp.concert_id,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) = 1 THEN 'lump_sum' ELSE 'per_service' END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) = 1 THEN 500.00 ELSE 125.00 END,
    0.00,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) = 1 THEN 500.00 ELSE 250.00 END,
    '2025-03-15'::DATE, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM SUPABASE_CONCERT_PARTICIPANT cp WHERE cp.concert_id = 'e94ffdc0-99f5-4a38-a78f-e4e428420615';

-- Add rehearsals for Spring Awakening
INSERT INTO SUPABASE_REHEARSAL (rehearsal_id, concert_id, rehearsal_date, required, service_value, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
VALUES
    (UUID_STRING(), 'e94ffdc0-99f5-4a38-a78f-e4e428420615', '2025-03-13'::TIMESTAMP, TRUE, 125.00, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    (UUID_STRING(), 'e94ffdc0-99f5-4a38-a78f-e4e428420615', '2025-03-15'::TIMESTAMP, TRUE, 125.00, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Add attendance for Spring Awakening
INSERT INTO SUPABASE_ATTENDANCE (attendance_id, rehearsal_id, musician_id, attended, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), r.rehearsal_id, cp.musician_id, TRUE, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM SUPABASE_REHEARSAL r CROSS JOIN SUPABASE_CONCERT_PARTICIPANT cp
WHERE r.concert_id = 'e94ffdc0-99f5-4a38-a78f-e4e428420615' AND cp.concert_id = 'e94ffdc0-99f5-4a38-a78f-e4e428420615';

-- Repeat for Summer Festival
INSERT INTO SUPABASE_CONCERT_PARTICIPANT (concert_participant_id, concert_id, musician_id, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), 'b31b2263-43a2-41c6-8689-280b3afbe604', musician_id, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM (SELECT musician_id FROM BR_SUPABASE_MUSICIAN LIMIT 5 OFFSET 5);

INSERT INTO SUPABASE_PAYMENT (payment_id, musician_id, concert_id, pay_type, agreed_amount, deductions, net_amount, payment_date, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), cp.musician_id, cp.concert_id,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) <= 2 THEN 'lump_sum' ELSE 'per_service' END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) <= 2 THEN 450.00 ELSE 120.00 END,
    0.00,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) <= 2 THEN 450.00 ELSE 240.00 END,
    '2025-06-20'::DATE, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM SUPABASE_CONCERT_PARTICIPANT cp WHERE cp.concert_id = 'b31b2263-43a2-41c6-8689-280b3afbe604';

INSERT INTO SUPABASE_REHEARSAL (rehearsal_id, concert_id, rehearsal_date, required, service_value, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
VALUES
    (UUID_STRING(), 'b31b2263-43a2-41c6-8689-280b3afbe604', '2025-06-18'::TIMESTAMP, TRUE, 120.00, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
    (UUID_STRING(), 'b31b2263-43a2-41c6-8689-280b3afbe604', '2025-06-20'::TIMESTAMP, TRUE, 120.00, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO SUPABASE_ATTENDANCE (attendance_id, rehearsal_id, musician_id, attended, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), r.rehearsal_id, cp.musician_id, TRUE, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM SUPABASE_REHEARSAL r CROSS JOIN SUPABASE_CONCERT_PARTICIPANT cp
WHERE r.concert_id = 'b31b2263-43a2-41c6-8689-280b3afbe604' AND cp.concert_id = 'b31b2263-43a2-41c6-8689-280b3afbe604';
```

### After Running SQL: Run dbt

The SQL inserts raw data. Now run dbt to process it through your pipeline:

```bash
cd /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/dbt

# If you have dbt installed via Docker:
docker-compose run dbt run --profiles-dir . --target prod

# Or if dbt is in your PATH:
dbt run --profiles-dir . --target prod
```

### Final Step: Refresh Dashboard

1. Go to http://localhost:8501
2. Click the menu (☰) → "Clear cache"
3. Refresh the page
4. All 4 concerts should now show complete data!

## 🎉 What You'll See

After completing these steps, all 4 concerts will have:
- ✅ Payment data
- ✅ Musician details
- ✅ Concert program/pieces
- ✅ Financial summaries

## 📝 Files Created

- `scripts/add-missing-concert-data.sql` - Full SQL script
- `scripts/run-add-missing-data.py` - Python automation (needs fixing)
- `streamlit_app/app.py` - Complete dashboard
- `streamlit_app/.streamlit/secrets.toml` - Snowflake credentials

## 🔧 Troubleshooting

**If dashboard still shows "No data":**
1. Clear Streamlit cache (menu → Clear cache)
2. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
3. Check you're selecting the right concert from dropdown

**If SQL fails:**
- Make sure you're connected to GCMS_DEV database
- Check that MOVEMENT_I schema exists
- Verify BR_SUPABASE_MUSICIAN table has at least 10 musicians
