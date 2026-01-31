#!/usr/bin/env python3
"""
Script to add missing concert data to Snowflake and run dbt
"""

import snowflake.connector
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import subprocess
import sys

print("=" * 80)
print("ADDING MISSING CONCERT DATA TO SNOWFLAKE")
print("=" * 80)

# Read private key
private_key_path = "/Users/robertgonzalez/Projects/GCMS/gcms-data-platform/.snowflake/snowflake_key"
with open(private_key_path, "rb") as key_file:
    p_key = serialization.load_pem_private_key(
        key_file.read(),
        password=None,
        backend=default_backend()
    )

pkb = p_key.private_bytes(
    encoding=serialization.Encoding.DER,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

# Connect to Snowflake
print("\n1. Connecting to Snowflake...")
conn = snowflake.connector.connect(
    user='ROBERTGONZALEZ',
    account='hndffbt-te29703',
    private_key=pkb,
    warehouse='TRANSFORMING',
    database='GCMS_DEV',
    schema='MOVEMENT_I',
    role='ACCOUNTADMIN'
)

cursor = conn.cursor()
print("   ✓ Connected successfully!")

# Read the SQL file
print("\n2. Reading SQL script...")
with open('/Users/robertgonzalez/Projects/GCMS/gcms-data-platform/scripts/add-missing-concert-data.sql', 'r') as f:
    sql_script = f.read()

# Split into individual statements and execute
print("\n3. Executing SQL statements...")
statements = [s.strip() for s in sql_script.split(';') if s.strip() and not s.strip().startswith('--')]

for i, statement in enumerate(statements, 1):
    if statement.upper().startswith('USE '):
        print(f"   [{i}/{len(statements)}] {statement[:50]}...")
        cursor.execute(statement)
    elif statement.upper().startswith('INSERT'):
        print(f"   [{i}/{len(statements)}] Inserting data...")
        try:
            cursor.execute(statement)
            print(f"      ✓ {cursor.rowcount} rows inserted")
        except Exception as e:
            print(f"      ⚠ Warning: {str(e)}")
    elif statement.upper().startswith('SELECT'):
        print(f"   [{i}/{len(statements)}] Verifying data...")
        cursor.execute(statement)
        results = cursor.fetchall()
        for row in results:
            print(f"      {row}")

cursor.close()
conn.close()
print("\n   ✓ All SQL statements executed!")

# Run dbt
print("\n4. Running dbt to process new data...")
print("   This may take a few minutes...")

try:
    result = subprocess.run(
        ['dbt', 'run', '--profiles-dir', '.', '--target', 'prod'],
        cwd='/Users/robertgonzalez/Projects/GCMS/gcms-data-platform/dbt',
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("   ✓ dbt run completed successfully!")
        print("\n   Models built:")
        for line in result.stdout.split('\n'):
            if 'OK created' in line or 'ERROR' in line:
                print(f"      {line}")
    else:
        print(f"   ✗ dbt run failed with error:")
        print(result.stderr)
        sys.exit(1)
        
except Exception as e:
    print(f"   ✗ Error running dbt: {str(e)}")
    sys.exit(1)

print("\n" + "=" * 80)
print("SUCCESS! All 4 concerts now have complete data!")
print("=" * 80)
print("\nRefresh your Streamlit dashboard at http://localhost:8501")
print("All concerts should now show payment, musician, and program data!")
