# Snowflake Setup Instructions

**Quick guide to get your Snowflake credentials and set up the database**

---

## 🎯 What You Need

You need to gather 5 pieces of information from Snowflake and fill them into your `.env` file.

---

## 📋 Step 1: Get Your Snowflake Credentials

### **1. Account Identifier**

**Where to find it:**
1. Log into Snowflake: https://app.snowflake.com
2. Click your name in the top-right corner
3. Hover over your account name
4. You'll see something like: `xy12345.us-east-1` or `abc123.snowflakecomputing.com`

**Copy the full identifier** (including the region)

**Example formats:**
- `xy12345.us-east-1` (AWS)
- `abc123.us-central1.gcp` (GCP)
- `def456.east-us-2.azure` (Azure)

**Put it in `.env` as:**
```bash
SNOWFLAKE_ACCOUNT=xy12345.us-east-1
```

---

### **2. Username**

This is the username you use to log into Snowflake.

**Put it in `.env` as:**
```bash
SNOWFLAKE_USER=your_username
```

---

### **3. Password**

This is the password you use to log into Snowflake.

**Put it in `.env` as:**
```bash
SNOWFLAKE_PASSWORD=your_password
```

---

### **4. Warehouse** (We'll create one if you don't have it)

**If you already have a warehouse:**
1. In Snowflake, click "Admin" → "Warehouses"
2. Copy the name of an existing warehouse

**If you don't have one, use:**
```bash
SNOWFLAKE_WAREHOUSE=TRANSFORMING
```
(We'll create it in the next step)

---

### **5. Role**

**Most common roles:**
- `ACCOUNTADMIN` (full access - recommended for setup)
- `SYSADMIN` (system admin)
- Your custom role name

**Put it in `.env` as:**
```bash
SNOWFLAKE_ROLE=ACCOUNTADMIN
```

---

## 📋 Step 2: Run the Setup Script in Snowflake

Now that you have your credentials, let's set up the database and schemas.

### **Option A: Using Snowflake Web UI** (Recommended)

1. **Log into Snowflake**
   - Go to: https://app.snowflake.com
   - Log in with your credentials

2. **Open a New Worksheet**
   - Click "Worksheets" in the left sidebar
   - Click "+ Worksheet" button (top right)

3. **Copy the Setup Script**
   - Open: `scripts/setup-snowflake-schemas.sql`
   - Copy the entire contents

4. **Paste and Run**
   - Paste into the worksheet
   - Click "Run All" (or press Cmd+Enter on Mac, Ctrl+Enter on Windows)

5. **Verify Success**
   - You should see: "Database GCMS_DEV created"
   - You should see: "Schema RAW created", "Schema BRONZE created", etc.
   - Check the results panel at the bottom

### **Option B: Using SnowSQL CLI** (Advanced)

If you have SnowSQL installed:

```bash
# Connect to Snowflake
snowsql -a your_account -u your_username

# Run the setup script
!source scripts/setup-snowflake-schemas.sql
```

---

## 📋 Step 3: Verify Everything is Set Up

### **Check in Snowflake UI:**

1. **Check Database**
   - Click "Data" → "Databases"
   - You should see: `GCMS_DEV`

2. **Check Schemas**
   - Click on `GCMS_DEV`
   - You should see: `RAW`, `BRONZE`, `SILVER`, `GOLD`

3. **Check Warehouse**
   - Click "Admin" → "Warehouses"
   - You should see: `TRANSFORMING`

4. **Check Roles**
   - Click "Admin" → "Roles"
   - You should see: `TRANSFORMER`, `READER`

### **Or run this query:**

```sql
-- Check everything
SHOW DATABASES LIKE 'GCMS_DEV';
SHOW SCHEMAS IN DATABASE GCMS_DEV;
SHOW WAREHOUSES LIKE 'TRANSFORMING';
SHOW ROLES LIKE 'TRANSFORMER';
```

---

## 📋 Step 4: Update dbt Profile

Now update your dbt profile with Snowflake credentials:

```bash
cd dbt
code profiles.yml  # or nano, vim, etc.
```

**Update these lines:**

```yaml
gcms_data_platform:
  outputs:
    prod:
      type: snowflake
      account: xy12345.us-east-1  # YOUR ACCOUNT from Step 1
      user: your_username          # YOUR USERNAME from Step 1
      password: your_password      # YOUR PASSWORD from Step 1
      role: ACCOUNTADMIN          # YOUR ROLE from Step 1
      database: GCMS_DEV
      warehouse: TRANSFORMING
      schema: bronze
      threads: 4
      client_session_keep_alive: False
      query_tag: dbt_gcms
  target: prod
```

---

## 📋 Step 5: Test the Connection

Test that dbt can connect to Snowflake:

```bash
cd dbt
/Users/robertgonzalez/Library/Python/3.9/bin/dbt debug
```

**You should see:**
```
Connection test: [OK connection ok]
```

**If it fails:**
- Double-check your account identifier format
- Verify username/password are correct
- Make sure warehouse is running (not suspended)
- Check that role has proper permissions

---

## 🎯 Quick Reference

### **Your .env file should look like:**

```bash
# Snowflake Configuration
SNOWFLAKE_ACCOUNT=xy12345.us-east-1
SNOWFLAKE_USER=robert_gonzalez
SNOWFLAKE_PASSWORD=your_secure_password
SNOWFLAKE_WAREHOUSE=TRANSFORMING
SNOWFLAKE_DATABASE=GCMS_DEV
SNOWFLAKE_ROLE=ACCOUNTADMIN
```

### **Your dbt/profiles.yml should match:**

```yaml
account: xy12345.us-east-1
user: robert_gonzalez
password: your_secure_password
warehouse: TRANSFORMING
database: GCMS_DEV
role: ACCOUNTADMIN
```

---

## ❓ Troubleshooting

### **Problem: "Account not found"**
- Check account identifier format
- Should include region: `account.region.cloud`
- NOT just: `account`

### **Problem: "Invalid username or password"**
- Verify credentials in Snowflake UI
- Try logging in manually first
- Check for typos

### **Problem: "Warehouse does not exist"**
- Run the setup script to create `TRANSFORMING`
- Or use an existing warehouse name

### **Problem: "Insufficient privileges"**
- Use `ACCOUNTADMIN` role for setup
- Or grant permissions to your role

### **Problem: "Database does not exist"**
- Run the setup script to create `GCMS_DEV`
- Or create manually in Snowflake UI

---

## ✅ Success Checklist

- [ ] Got Snowflake account identifier
- [ ] Got username and password
- [ ] Filled in `.env` file
- [ ] Ran setup script in Snowflake
- [ ] Verified database and schemas exist
- [ ] Updated `dbt/profiles.yml`
- [ ] Ran `dbt debug` successfully
- [ ] Connection test passed!

---

## 🚀 Next Steps

Once your connection test passes:

1. **Load sample data** (see `scripts/create-sample-data.sql`)
2. **Run dbt models** (see `docs/DEMO_SCRIPT.md`)
3. **Practice your demo!**

---

**Need help? Check the main setup guide: `docs/SETUP_GUIDE.md`**
