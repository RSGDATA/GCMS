# Supabase Setup - Complete Documentation

## ✅ Status: COMPLETE

All 14 transactional tables have been successfully created in Supabase.

---

## 📊 Database Architecture

### Data Flow
```
Supabase (OLTP Transactional)
    ↓ Airbyte Sync
Snowflake RAW (Untransformed Landing)
    ↓ dbt Bronze Layer
Bronze (SCD2 Applied)
    ↓ dbt Silver Layer
Silver (Staging + Intermediate)
    ↓ dbt Gold Layer
Gold (Dimensions + Facts)
```

### Design Philosophy
- **Supabase**: Simple transactional tables (OLTP) - current state only
- **No SCD2 in source**: Historical tracking happens in dbt, not in the source database
- **Clean separation**: Transactional layer vs. analytical layer

---

## 📋 Tables Created (14 Total)

### Core Foundation (4 tables)

#### 1. fiscal_year
Top-level accounting periods for the organization.

**Columns:**
- `fiscal_year_id` (UUID, PK) - Unique identifier
- `name` (TEXT, UNIQUE) - e.g., "FY2024-2025"
- `start_date` (DATE) - Fiscal year start
- `end_date` (DATE) - Fiscal year end

**Constraints:**
- `start_date < end_date`

#### 2. season
Artistic seasons within fiscal years (e.g., "Fall 2024", "Spring 2025").

**Columns:**
- `season_id` (UUID, PK)
- `fiscal_year_id` (UUID, FK → fiscal_year)
- `name` (TEXT) - Season name
- `description` (TEXT) - Optional description

**Constraints:**
- UNIQUE(fiscal_year_id, name)

#### 3. concert
Individual concert events.

**Columns:**
- `concert_id` (UUID, PK)
- `season_id` (UUID, FK → season)
- `title` (TEXT) - Concert title
- `program_notes` (TEXT) - Program notes
- `concert_date` (DATE) - Performance date
- `venue` (TEXT) - Performance location
- `total_budget` (NUMERIC(10,2)) - Concert budget

**Indexes:**
- `idx_concert_season` on season_id
- `idx_concert_date` on concert_date

#### 4. person
All people in the system (musicians, conductors, guests, admins).

**Columns:**
- `person_id` (UUID, PK)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `email` (TEXT, UNIQUE)
- `phone` (TEXT)
- `role` (TEXT) - CHECK: 'musician', 'conductor', 'guest', 'admin'

**Indexes:**
- `idx_person_role` on role

---

### People & Authentication (2 tables)

#### 5. musician
Musician-specific information (extends person).

**Columns:**
- `musician_id` (UUID, PK, FK → person)
- `instrument` (TEXT) - Primary instrument
- `union_member` (BOOLEAN) - Union membership status

**Indexes:**
- `idx_musician_instrument` on instrument

#### 6. user_profile
Links Supabase auth.users to person records.

**Columns:**
- `user_id` (UUID, PK, FK → auth.users)
- `person_id` (UUID, FK → person, UNIQUE)
- `created_at` (TIMESTAMP) - Account creation time

---

### Music Catalog (2 tables)

#### 7. piece
Musical pieces in the repertoire.

**Columns:**
- `piece_id` (UUID, PK)
- `title` (TEXT) - Piece title
- `composer` (TEXT) - Composer name
- `duration_minutes` (INTEGER) - Performance duration
- `difficulty_level` (TEXT) - CHECK: 'easy', 'medium', 'hard', 'advanced'

#### 8. concert_piece
Junction table linking pieces to concerts.

**Columns:**
- `concert_piece_id` (UUID, PK)
- `concert_id` (UUID, FK → concert)
- `piece_id` (UUID, FK → piece)
- `performance_order` (INTEGER) - Order in program

**Constraints:**
- UNIQUE(concert_id, piece_id)
- UNIQUE(concert_id, performance_order)

---

### Rehearsals & Participation (4 tables)

#### 9. rehearsal
Rehearsal schedule and details.

**Columns:**
- `rehearsal_id` (UUID, PK)
- `concert_id` (UUID, FK → concert)
- `rehearsal_date` (DATE)
- `start_time` (TIME)
- `end_time` (TIME)
- `location` (TEXT)
- `notes` (TEXT)

**Constraints:**
- `start_time < end_time`

**Indexes:**
- `idx_rehearsal_concert` on concert_id
- `idx_rehearsal_date` on rehearsal_date

#### 10. concert_participant
Musicians assigned to concerts.

**Columns:**
- `participant_id` (UUID, PK)
- `concert_id` (UUID, FK → concert)
- `musician_id` (UUID, FK → musician)
- `role` (TEXT) - CHECK: 'principal', 'section', 'substitute'
- `confirmed` (BOOLEAN) - Confirmation status

**Constraints:**
- UNIQUE(concert_id, musician_id)

**Indexes:**
- `idx_participant_concert` on concert_id
- `idx_participant_musician` on musician_id

**Note:** SCD2 tracking (valid_from, valid_to, is_current) is applied in dbt Bronze layer, not here.

#### 11. rsvp
Rehearsal RSVPs from musicians.

**Columns:**
- `rsvp_id` (UUID, PK)
- `rehearsal_id` (UUID, FK → rehearsal)
- `musician_id` (UUID, FK → musician)
- `status` (TEXT) - CHECK: 'yes', 'no', 'maybe'
- `response_date` (TIMESTAMP)
- `notes` (TEXT)

**Constraints:**
- UNIQUE(rehearsal_id, musician_id)

**Indexes:**
- `idx_rsvp_rehearsal` on rehearsal_id
- `idx_rsvp_musician` on musician_id

#### 12. attendance
Actual rehearsal attendance tracking.

**Columns:**
- `attendance_id` (UUID, PK)
- `rehearsal_id` (UUID, FK → rehearsal)
- `musician_id` (UUID, FK → musician)
- `attended` (BOOLEAN) - Did they attend?
- `minutes_late` (INTEGER) - Lateness tracking
- `notes` (TEXT)
- `recorded_at` (TIMESTAMP) - When recorded

**Constraints:**
- UNIQUE(rehearsal_id, musician_id)

**Indexes:**
- `idx_attendance_rehearsal` on rehearsal_id
- `idx_attendance_musician` on musician_id

**Note:** SCD2 tracking is applied in dbt Bronze layer (br_attendance_scd2).

---

### Financial (2 tables)

#### 13. payment
Musician payments per concert.

**Columns:**
- `payment_id` (UUID, PK)
- `musician_id` (UUID, FK → musician)
- `concert_id` (UUID, FK → concert)
- `amount` (NUMERIC(10,2)) - Payment amount
- `payment_date` (DATE) - When paid
- `payment_method` (TEXT) - CHECK: 'check', 'direct_deposit', 'cash', 'other'
- `notes` (TEXT)

**Indexes:**
- `idx_payment_musician` on musician_id
- `idx_payment_concert` on concert_id
- `idx_payment_date` on payment_date

#### 14. contract
Musician contracts per season.

**Columns:**
- `contract_id` (UUID, PK)
- `musician_id` (UUID, FK → musician)
- `season_id` (UUID, FK → season)
- `contract_type` (TEXT) - CHECK: 'per_service', 'seasonal', 'annual'
- `rate_per_service` (NUMERIC(10,2)) - Service rate
- `guaranteed_services` (INTEGER) - Minimum services
- `start_date` (DATE) - Contract start
- `end_date` (DATE) - Contract end (nullable)
- `notes` (TEXT)

**Constraints:**
- UNIQUE(musician_id, season_id)
- `end_date IS NULL OR start_date < end_date`

**Indexes:**
- `idx_contract_musician` on musician_id
- `idx_contract_season` on season_id

**Note:** SCD2 tracking is applied in dbt Bronze layer (br_contract_scd2).

---

## 🔧 Setup Process

### Prerequisites
- Supabase account with project created
- Supabase CLI installed (v2.67.1+)
- Project credentials in `.env` file

### Installation Steps

1. **Login to Supabase CLI**
   ```bash
   supabase login
   # Follow browser authentication flow
   ```

2. **Link Project**
   ```bash
   supabase link --project-ref stttpmepakavlubbsqaq
   ```

3. **Run SQL in Supabase SQL Editor**
   - Open: https://supabase.com/dashboard/project/stttpmepakavlubbsqaq/editor
   - Use file: `RUN_IN_SUPABASE_SQL_EDITOR_CLEAN.sql`
   - This file drops existing tables and recreates them cleanly

### Files Used
- `RUN_IN_SUPABASE_SQL_EDITOR_CLEAN.sql` - Clean install (drops & recreates)
- `supabase/migrations/` - Original migration files (for reference)

---

## 🔄 Data Pipeline Integration

### Airbyte Configuration
**Source:** Supabase (Postgres)
- Host: `db.stttpmepakavlubbsqaq.supabase.co`
- Port: `5432`
- Database: `postgres`
- Schema: `public`
- Tables: All 14 tables listed above

**Destination:** Snowflake
- Database: `GCMS_DEV`
- Schema: `raw`
- Sync mode: Full refresh (initially), then incremental

### dbt Transformations

#### Bronze Layer
**Simple pass-through models** (`dbt/models/bronze/supabase/`):
- `br_supabase_fiscal_year.sql`
- `br_supabase_season.sql`
- `br_supabase_concert.sql`
- `br_supabase_person.sql`
- `br_supabase_musician.sql`
- `br_supabase_user_profile.sql`
- `br_supabase_piece.sql`
- `br_supabase_concert_piece.sql`
- `br_supabase_rehearsal.sql`
- `br_supabase_concert_participant.sql`
- `br_supabase_rsvp.sql`
- `br_supabase_attendance.sql`
- `br_supabase_payment.sql`
- `br_supabase_contract.sql`

**SCD2 models** (`dbt/models/bronze/scd2/`):
- `br_attendance_scd2.sql` - Tracks attendance history
- `br_concert_participant_scd2.sql` - Tracks participant changes
- `br_contract_scd2.sql` - Tracks contract changes

#### Silver Layer
**Staging** (`dbt/models/silver/staging/`):
- `stg_rehearsal.sql` - Cleaned rehearsal data
- `stg_attendance.sql` - Cleaned attendance data
- `stg_concert_participant.sql` - Cleaned participant data

**Intermediate** (`dbt/models/silver/intermediate/`):
- `int_required_services.sql` - Required services per musician
- `int_attended_services.sql` - Attended services per musician
- `int_service_value.sql` - Service value calculations

#### Gold Layer
**Dimensions** (`dbt/models/gold/dimensions/`):
- `dim_musician.sql` - Musician dimension
- `dim_concert.sql` - Concert dimension

**Facts** (`dbt/models/gold/facts/`):
- `fct_musician_payment.sql` - Payment fact table

---

## 📝 Usage Examples

### Adding a New Fiscal Year
```sql
INSERT INTO fiscal_year (name, start_date, end_date)
VALUES ('FY2025-2026', '2025-07-01', '2026-06-30');
```

### Creating a Season
```sql
INSERT INTO season (fiscal_year_id, name, description)
VALUES (
    (SELECT fiscal_year_id FROM fiscal_year WHERE name = 'FY2025-2026'),
    'Fall 2025',
    'Fall concert season'
);
```

### Adding a Concert
```sql
INSERT INTO concert (season_id, title, concert_date, venue, total_budget)
VALUES (
    (SELECT season_id FROM season WHERE name = 'Fall 2025'),
    'Opening Night Gala',
    '2025-09-15',
    'Symphony Hall',
    15000.00
);
```

### Assigning Musicians to Concert
```sql
INSERT INTO concert_participant (concert_id, musician_id, role, confirmed)
VALUES (
    (SELECT concert_id FROM concert WHERE title = 'Opening Night Gala'),
    (SELECT musician_id FROM musician WHERE instrument = 'Violin'),
    'principal',
    true
);
```

---

## 🔒 Security & Access

### Row Level Security (RLS)
Currently **not enabled** - tables are in `public` schema with default permissions.

**Future Enhancement:** Enable RLS policies for:
- Musicians can only see their own data
- Admins can see all data
- Conductors can see concert-specific data

### Authentication
- Uses Supabase Auth (`auth.users` table)
- `user_profile` table links auth to `person` records
- Symphony Portal handles authentication UI

---

## 🚀 Next Steps

1. **Configure Airbyte Connection**
   - Set up Supabase source
   - Set up Snowflake destination
   - Configure sync schedule

2. **Set Up Snowflake**
   - Create database: `GCMS_DEV`
   - Create schemas: `raw`, `bronze`, `silver`, `gold`
   - Configure dbt connection

3. **Run dbt Transformations**
   ```bash
   dbt run --models bronze
   dbt run --models silver
   dbt run --models gold
   ```

4. **Test Complete Pipeline**
   - Add sample data in Supabase
   - Trigger Airbyte sync
   - Run dbt transformations
   - Query Gold layer tables

---

## 📚 Related Documentation

- [dbt Runbook](./DBT_RUNBOOK.md) - dbt model documentation
- [Airbyte Setup Guide](./AIRBYTE_SETUP_GUIDE.md) - Airbyte configuration
- [Snowflake Setup](./SNOWFLAKE_SETUP_INSTRUCTIONS.md) - Snowflake configuration
- [Project Status](../PROJECT_STATUS.md) - Overall project status

---

## 🐛 Troubleshooting

### Issue: "column does not exist" errors
**Solution:** Use `RUN_IN_SUPABASE_SQL_EDITOR_CLEAN.sql` which drops all tables first.

### Issue: CLI connection fails
**Solution:** Use Supabase SQL Editor in dashboard instead of CLI.

### Issue: Foreign key constraint errors
**Solution:** Ensure parent records exist before inserting child records.

---

## ✅ Verification Checklist

- [x] All 14 tables created
- [x] All indexes created
- [x] All foreign keys configured
- [x] All check constraints in place
- [x] UUID extension enabled
- [ ] Sample data inserted (optional)
- [ ] Airbyte connection configured
- [ ] dbt models tested

---

**Last Updated:** January 10, 2026  
**Status:** ✅ Production Ready  
**Version:** 1.0
