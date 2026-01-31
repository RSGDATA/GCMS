# 🎯 Airbyte Manual Setup Guide (5 Minutes)

Since the abctl API has permission restrictions, here's the quickest way to configure Airbyte through the UI.

---

## ✅ **Prerequisites (Already Done!)**
- ✅ Supabase: 14 tables created
- ✅ Snowflake: Symphony Structure schemas ready
- ✅ Key pair authentication: Working
- ✅ Airbyte: Running at http://localhost:8000

---

## 🚀 **Step 1: Open Airbyte**

```bash
open http://localhost:8000
```

**Login with:**
- Email: `rgviolin1234@gmail.com`
- Password: `5SZliBqqB88TLLrC7tCkFKwIk6rbZfIR`

---

## 📥 **Step 2: Create Supabase Source**

1. Click **"Sources"** → **"+ New source"**
2. Search for **"Postgres"**
3. Fill in:

```
Name: Supabase (GCMS)
Host: db.stttpmepakavlubbsqaq.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: h67BX5CDfNgSUy0I
Schemas: public
SSL Mode: require
```

4. Click **"Set up source"**

---

## ❄️ **Step 3: Create Snowflake Destination**

1. Click **"Destinations"** → **"+ New destination"**
2. Search for **"Snowflake"**
3. Fill in:

```
Name: Snowflake (GCMS)
Host: hndffbt-te29703.snowflakecomputing.com
Role: ACCOUNTADMIN
Warehouse: TRANSFORMING
Database: GCMS_DEV
Default Schema: MOVEMENT_I
Username: ROBERTGONZALEZ
```

4. **Authentication Method:** Select **"Key Pair Authentication"**
5. **Private Key:** Paste the contents of `.snowflake/snowflake_key`

To get the key:
```bash
cat /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/.snowflake/snowflake_key
```

6. Click **"Set up destination"**

---

## 🔗 **Step 4: Create Connection**

1. Click **"Connections"** → **"+ New connection"**
2. **Source:** Select "Supabase (GCMS)"
3. **Destination:** Select "Snowflake (GCMS)"
4. **Replication frequency:** Every 24 hours
5. **Destination Namespace:** Custom format → `MOVEMENT_I`
6. **Destination Stream Prefix:** Leave empty

### **Select Tables:**
Check all 14 tables:
- ✅ fiscal_year
- ✅ season
- ✅ concert
- ✅ person
- ✅ musician
- ✅ user_profile
- ✅ piece
- ✅ concert_piece
- ✅ rehearsal
- ✅ concert_participant
- ✅ rsvp
- ✅ attendance
- ✅ payment
- ✅ contract

7. **Sync mode:** Full refresh | Overwrite
8. Click **"Set up connection"**

---

## 🎉 **Step 5: Trigger First Sync**

1. Click **"Sync now"** to start the initial sync
2. Monitor progress in the UI
3. Once complete, data will be in Snowflake `GCMS_DEV.MOVEMENT_I`

---

## ✅ **Verify in Snowflake**

```sql
USE DATABASE GCMS_DEV;
USE SCHEMA MOVEMENT_I;

-- Check tables
SHOW TABLES;

-- Check data
SELECT * FROM fiscal_year LIMIT 10;
SELECT * FROM person LIMIT 10;
SELECT * FROM concert LIMIT 10;
```

---

## 🎵 **Your Complete Data Flow**

```
Supabase (14 tables) ✅
    ↓ Airbyte (every 24 hours)
MOVEMENT_I (raw data) ✅
    ↓ dbt models
MOVEMENT_II (SCD2 history) ✅
    ↓ dbt models
MOVEMENT_III (business logic) ✅
    ↓ dbt models
FINALE (analytics) ✅
```

---

## 📝 **Notes**

- **Sync Schedule:** Every 24 hours (configurable)
- **Schema:** All data lands in `MOVEMENT_I`
- **Table Prefix:** Airbyte adds `supabase_` prefix
- **Metadata:** Airbyte adds `_airbyte_*` columns

---

## 🆘 **Troubleshooting**

**Connection test fails?**
- Check Supabase password is correct
- Verify Snowflake key pair is properly formatted
- Ensure Snowflake user has correct permissions

**No data syncing?**
- Check Supabase tables have data
- Verify network connectivity
- Check Airbyte logs in the UI

---

**That's it! 5 minutes and your data pipeline is live!** 🚀
