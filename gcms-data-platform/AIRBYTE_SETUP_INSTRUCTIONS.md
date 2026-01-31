# 🎯 Airbyte Setup Instructions - FINAL VERSION

**Wait for `abctl local install` to complete, then follow these steps.**

---

## ✅ **Step 1: Get Your Login Credentials**

Once installation completes, run:
```bash
abctl local credentials
```

Copy the **Email** and **Password** shown.

---

## 🌐 **Step 2: Access Airbyte**

**URL:** http://localhost:8000

Log in with the credentials from Step 1.

---

## 📥 **Step 3: Create Supabase Source**

1. Click **"Sources"** → **"+ New source"**
2. Search for **"Postgres"**
3. Fill in these EXACT values:

```
Source name: Supabase GCMS
Host: db.stttpmepakavlubbsqaq.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: h67BX5CDfNgSUy0I
```

4. **Optional fields** (expand):
```
Schemas: public
SSL Mode: require
```

5. **Advanced** section:
```
Update Method: Select "Detect Changes with Xmin System Column" (2nd option)
Replication Slot: (leave EMPTY)
Publication: (leave EMPTY)
```

6. Click **"Set up source"**

---

## ❄️ **Step 4: Create Snowflake Destination**

1. Click **"Destinations"** → **"+ New destination"**
2. Search for **"Snowflake"**
3. Fill in:

```
Name: Snowflake GCMS
Host: hndffbt-te29703.snowflakecomputing.com
Role: ACCOUNTADMIN
Warehouse: TRANSFORMING
Database: GCMS_DEV
Default Schema: MOVEMENT_I
Username: ROBERTGONZALEZ
```

4. **Authentication:** Select **"Key Pair Authentication"**
5. **Private Key:** Run this command and paste the output:

```bash
cat /Users/robertgonzalez/Projects/GCMS/gcms-data-platform/.snowflake/snowflake_key
```

6. Click **"Set up destination"**

---

## 🔗 **Step 5: Create Connection**

1. Click **"Connections"** → **"+ New connection"**
2. **Source:** Supabase GCMS
3. **Destination:** Snowflake GCMS
4. **Replication frequency:** Every 24 hours
5. **Destination Namespace:** Custom format → `MOVEMENT_I`
6. **Select all 14 tables:**
   - fiscal_year, season, concert, person, musician, user_profile
   - piece, concert_piece, rehearsal, concert_participant
   - rsvp, attendance, payment, contract
7. **Sync mode:** Full refresh | Overwrite
8. Click **"Set up connection"**
9. Click **"Sync now"**

---

## ✅ **Done!**

Your data will flow: **Supabase → Airbyte → Snowflake MOVEMENT_I**

Then dbt will transform it through the Symphony Structure! 🎵
