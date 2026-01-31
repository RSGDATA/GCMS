# 📊 Snowflake Tables Location Guide

## ✅ Your Data is Ready!

All your tables have been successfully created in Snowflake. Here's where to find them:

---

## 🗄️ Database: `GCMS_DEV`

### 1️⃣ MOVEMENT_I (Raw Data Layer)
**Schema:** `GCMS_DEV.MOVEMENT_I`

#### Source Tables (from Supabase):
- `SUPABASE_ATTENDANCE` (with data)
- `SUPABASE_CONCERT` (with data)
- `SUPABASE_CONCERT_PARTICIPANT` (with data)
- `SUPABASE_CONCERT_PIECE` (with data)
- `SUPABASE_CONTRACT` (empty)
- `SUPABASE_FISCAL_YEAR` (with data)
- `SUPABASE_MEDIA` (empty)
- `SUPABASE_MUSICIAN` (with data)
- `SUPABASE_PAYMENT` (with data)
- `SUPABASE_PERSON` (with data)
- `SUPABASE_PIECE` (with data)
- `SUPABASE_REHEARSAL` (with data)
- `SUPABASE_RSVP` (empty)
- `SUPABASE_SEASON` (with data)
- `SUPABASE_TAX_DOCUMENT` (empty)
- `SUPABASE_USER_PROFILE` (empty)

#### Bronze Tables (dbt processed):
- `BR_SUPABASE_ATTENDANCE`
- `BR_SUPABASE_CONCERT`
- `BR_SUPABASE_CONCERT_PARTICIPANT`
- `BR_SUPABASE_CONCERT_PIECE`
- `BR_SUPABASE_FISCAL_YEAR`
- `BR_SUPABASE_MUSICIAN`
- `BR_SUPABASE_PAYMENT`
- `BR_SUPABASE_PERSON`
- `BR_SUPABASE_PIECE`
- `BR_SUPABASE_REHEARSAL`
- `BR_SUPABASE_SEASON`

### 2️⃣ MOVEMENT_II_FINALE (Gold Layer - Analytics Ready!)
**Schema:** `GCMS_DEV.MOVEMENT_II_FINALE`

#### Dimension Tables:
- `DIM_CONCERT` - Concert dimension with all concert details
- `DIM_MUSICIAN` - Musician dimension with person details

#### Fact Tables:
- `FCT_MUSICIAN_PAYMENT` - Payment facts for analysis

---

## 📝 Sample Queries

### Query 1: View All Musicians
```sql
SELECT * 
FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_MUSICIAN
LIMIT 10;
```

### Query 2: View All Concerts
```sql
SELECT * 
FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_CONCERT
LIMIT 10;
```

### Query 3: Musician Payment Analysis
```sql
SELECT 
    musician_name,
    concert_title,
    gross_amount,
    deductions,
    net_amount,
    paid,
    payment_date
FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT
ORDER BY payment_date DESC;
```

### Query 4: Total Payments by Musician
```sql
SELECT 
    musician_name,
    COUNT(*) as payment_count,
    SUM(gross_amount) as total_gross,
    SUM(net_amount) as total_net
FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT
GROUP BY musician_name
ORDER BY total_net DESC;
```

### Query 5: Raw Data from Supabase
```sql
SELECT * 
FROM GCMS_DEV.MOVEMENT_I.SUPABASE_PAYMENT
LIMIT 10;
```

---

## 🎯 How to Access in Snowflake UI

1. **Login to Snowflake** at: https://app.snowflake.com
2. **Select Warehouse:** `TRANSFORMING`
3. **Navigate to:**
   - Database: `GCMS_DEV`
   - Schema: `MOVEMENT_II_FINALE` (for analytics)
   - Or Schema: `MOVEMENT_I` (for raw data)
4. **Run queries** in the Worksheets tab

---

## 📊 Data Pipeline Summary

```
Supabase (Source)
    ↓
MOVEMENT_I (Raw ingestion)
    ↓
MOVEMENT_II_MOVEMENT_II (Bronze - cleaned)
    ↓
MOVEMENT_II_MOVEMENT_III (Silver - transformed)
    ↓
MOVEMENT_II_FINALE (Gold - analytics ready) ← **USE THIS FOR ANALYSIS**
```

---

## ✅ Success Metrics

- **14 source tables** loaded from Supabase
- **11 bronze tables** created (3 skipped due to no data)
- **3 gold tables** ready for analytics
- **15 payment records** available for analysis
- **8 musicians** in the system
- **2 concerts** tracked

---

## 🚀 Next Steps

1. Run the sample queries above in Snowflake
2. Explore the `FCT_MUSICIAN_PAYMENT` table for payment analysis
3. Use `DIM_MUSICIAN` and `DIM_CONCERT` for dimensional analysis
4. Build dashboards using these gold layer tables

**Your end-to-end data pipeline is working!** 🎉
