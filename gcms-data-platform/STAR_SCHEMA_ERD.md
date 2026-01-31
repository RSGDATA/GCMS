# 🌟 Star Schema ERD - GCMS Data Warehouse

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         STAR SCHEMA OVERVIEW                             │
│                    (Kimball Dimensional Model)                           │
└─────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────┐
│      DIM_CONCERT                 │  ◄─────┐
│      (Dimension Table)           │        │
├──────────────────────────────────┤        │
│ 🔑 CONCERT_ID (PK)               │        │
│    TITLE                         │        │
│    CONCERT_DATE                  │        │
│    VENUE                         │        │
│    TOTAL_BUDGET                  │        │
│    PROGRAM_NOTES                 │        │
│    SEASON_ID                     │        │
│    SEASON_NAME                   │        │
│    SEASON_DESCRIPTION            │        │
│    FISCAL_YEAR_ID                │        │
│    FISCAL_YEAR_NAME              │        │
│    FISCAL_YEAR_START             │        │
│    FISCAL_YEAR_END               │        │
│    DIMENSION_UPDATED_AT          │        │
└──────────────────────────────────┘        │
                                             │
                                             │ Many-to-One
                                             │ (Many payments per concert)
                                             │
┌──────────────────────────────────┐        │
│      FCT_MUSICIAN_PAYMENT        │ ───────┘
│      (Fact Table)                │
├──────────────────────────────────┤
│ 🔑 PAYMENT_KEY (PK)              │
│ 🔗 CONCERT_ID (FK) ──────────────┼────────┐
│ 🔗 MUSICIAN_ID (FK) ─────────────┼───┐    │
│    PAY_TYPE                      │   │    │
│    AGREED_AMOUNT                 │   │    │
│    ATTENDED_SERVICES             │   │    │
│    REQUIRED_SERVICES             │   │    │
│ 💰 GROSS_AMOUNT                  │   │    │
│ 💰 DEDUCTIONS                    │   │    │
│ 💰 NET_AMOUNT                    │   │    │
│    CALCULATED_AT                 │   │    │
└──────────────────────────────────┘   │    │
                                       │    │
                                       │    │
                Many-to-One            │    │
    (Many payments per musician)       │    │
                                       │    │
                                       ▼    │
┌──────────────────────────────────┐        │
│      DIM_MUSICIAN                │        │
│      (Dimension Table)           │ ◄──────┘
├──────────────────────────────────┤
│ 🔑 MUSICIAN_ID (PK)              │
│    PERSON_ID                     │
│    FULL_NAME                     │
│    FIRST_NAME                    │
│    LAST_NAME                     │
│    EMAIL                         │
│    PHONE                         │
│    INSTRUMENT                    │
│    SECTION                       │
│    CHAIR_POSITION                │
│    HIRE_DATE                     │
│    STATUS                        │
│    DIMENSION_UPDATED_AT          │
└──────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         RELATIONSHIP SUMMARY                             │
└─────────────────────────────────────────────────────────────────────────┘

1. DIM_CONCERT (1) ──< FCT_MUSICIAN_PAYMENT (Many)
   - One concert can have many payments
   - Join: DIM_CONCERT.CONCERT_ID = FCT_MUSICIAN_PAYMENT.CONCERT_ID

2. DIM_MUSICIAN (1) ──< FCT_MUSICIAN_PAYMENT (Many)
   - One musician can have many payments
   - Join: DIM_MUSICIAN.MUSICIAN_ID = FCT_MUSICIAN_PAYMENT.MUSICIAN_ID

3. FCT_MUSICIAN_PAYMENT is the FACT TABLE (center of star)
   - Contains measurable business metrics (amounts, services)
   - References both dimension tables via foreign keys
```

---

## 📊 Table Details

### 🎭 DIM_CONCERT (Dimension)
**Purpose:** Concert details with season and fiscal year context

**Key Columns:**
- `CONCERT_ID` - Primary Key
- `TITLE` - Concert name
- `CONCERT_DATE` - When the concert occurred
- `VENUE` - Where it was held
- `TOTAL_BUDGET` - Allocated budget
- `SEASON_NAME` - Which season (e.g., "Fall 2024")
- `FISCAL_YEAR_NAME` - Which fiscal year (e.g., "FY 2024")

**Use For:** Concert analysis, budget planning, venue utilization

---

### 🎵 DIM_MUSICIAN (Dimension)
**Purpose:** Musician details including instrument and position

**Key Columns:**
- `MUSICIAN_ID` - Primary Key
- `FULL_NAME` - Complete name
- `INSTRUMENT` - What they play
- `SECTION` - Orchestra section (strings, brass, etc.)
- `CHAIR_POSITION` - Seating position
- `STATUS` - Active/Inactive

**Use For:** Musician roster, section analysis, contact information

---

### 💰 FCT_MUSICIAN_PAYMENT (Fact)
**Purpose:** Payment transactions linking musicians to concerts

**Key Columns:**
- `PAYMENT_KEY` - Primary Key (surrogate)
- `CONCERT_ID` - Foreign Key to DIM_CONCERT
- `MUSICIAN_ID` - Foreign Key to DIM_MUSICIAN
- `GROSS_AMOUNT` - Payment before deductions
- `DEDUCTIONS` - Amount deducted
- `NET_AMOUNT` - Final payment amount
- `ATTENDED_SERVICES` - Services attended
- `REQUIRED_SERVICES` - Services required

**Use For:** Payment analysis, budget tracking, musician compensation

---

## 🔗 Common JOIN Patterns

### Pattern 1: Concert with Payments
```sql
SELECT 
    c.TITLE,
    c.CONCERT_DATE,
    COUNT(*) as payment_count,
    SUM(f.GROSS_AMOUNT) as total_paid
FROM DIM_CONCERT c
LEFT JOIN FCT_MUSICIAN_PAYMENT f ON c.CONCERT_ID = f.CONCERT_ID
GROUP BY c.TITLE, c.CONCERT_DATE;
```

### Pattern 2: Musician with Payments
```sql
SELECT 
    m.FULL_NAME,
    m.INSTRUMENT,
    COUNT(*) as concerts_played,
    SUM(f.NET_AMOUNT) as total_earned
FROM DIM_MUSICIAN m
LEFT JOIN FCT_MUSICIAN_PAYMENT f ON m.MUSICIAN_ID = f.MUSICIAN_ID
GROUP BY m.FULL_NAME, m.INSTRUMENT;
```

### Pattern 3: Complete Star Schema Join
```sql
SELECT 
    c.TITLE as concert,
    m.FULL_NAME as musician,
    m.INSTRUMENT,
    f.GROSS_AMOUNT,
    f.NET_AMOUNT,
    c.TOTAL_BUDGET
FROM FCT_MUSICIAN_PAYMENT f
INNER JOIN DIM_CONCERT c ON f.CONCERT_ID = c.CONCERT_ID
INNER JOIN DIM_MUSICIAN m ON f.MUSICIAN_ID = m.MUSICIAN_ID
ORDER BY c.CONCERT_DATE, m.FULL_NAME;
```

---

## 📈 Analysis Examples

### Budget Analysis
```sql
-- Compare budget vs actual spending per concert
SELECT 
    c.TITLE,
    c.TOTAL_BUDGET,
    SUM(f.GROSS_AMOUNT) as actual_spending,
    c.TOTAL_BUDGET - SUM(f.GROSS_AMOUNT) as remaining_budget,
    ROUND((SUM(f.GROSS_AMOUNT) / c.TOTAL_BUDGET) * 100, 2) as budget_used_pct
FROM DIM_CONCERT c
LEFT JOIN FCT_MUSICIAN_PAYMENT f ON c.CONCERT_ID = f.CONCERT_ID
GROUP BY c.TITLE, c.TOTAL_BUDGET;
```

### Musician Earnings
```sql
-- Top earning musicians
SELECT 
    m.FULL_NAME,
    m.INSTRUMENT,
    m.SECTION,
    COUNT(DISTINCT f.CONCERT_ID) as concerts_played,
    SUM(f.NET_AMOUNT) as total_earnings,
    AVG(f.NET_AMOUNT) as avg_per_concert
FROM DIM_MUSICIAN m
INNER JOIN FCT_MUSICIAN_PAYMENT f ON m.MUSICIAN_ID = f.MUSICIAN_ID
GROUP BY m.FULL_NAME, m.INSTRUMENT, m.SECTION
ORDER BY total_earnings DESC;
```

### Concert Participation
```sql
-- Musicians per concert
SELECT 
    c.TITLE,
    c.CONCERT_DATE,
    COUNT(DISTINCT f.MUSICIAN_ID) as musician_count,
    SUM(f.GROSS_AMOUNT) as total_payroll
FROM DIM_CONCERT c
LEFT JOIN FCT_MUSICIAN_PAYMENT f ON c.CONCERT_ID = f.CONCERT_ID
GROUP BY c.TITLE, c.CONCERT_DATE
ORDER BY c.CONCERT_DATE;
```

---

## 🎯 Star Schema Benefits

1. **Simple to Understand** - Clear center (fact) with surrounding dimensions
2. **Fast Queries** - Optimized for analytical queries
3. **Easy to Extend** - Add new dimensions without changing fact table
4. **Business-Friendly** - Matches how users think about data
5. **Aggregation-Ready** - Perfect for SUM, COUNT, AVG operations

---

## 🔑 Key Relationships

```
CONCERT ──< PAYMENT >── MUSICIAN
   1           M    M        1

One concert has many payments
One musician has many payments
Each payment belongs to one concert and one musician
```

---

## 💡 Query Tips

1. **Always start with the FACT table** when joining all three
2. **Use LEFT JOIN** from dimensions to preserve all dimension records
3. **Use INNER JOIN** from fact to dimensions for actual transactions only
4. **Group by dimension attributes** for aggregations
5. **Filter on dimensions** for better performance

---

## 📍 Location in Snowflake

```
Database: GCMS_DEV
Schema: MOVEMENT_II_FINALE

Tables:
- DIM_CONCERT
- DIM_MUSICIAN  
- FCT_MUSICIAN_PAYMENT
```

**Your star schema is ready for analytics!** 🌟
