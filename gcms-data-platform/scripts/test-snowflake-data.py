#!/usr/bin/env python3
"""
Test script to query Snowflake and see what data exists
"""

import snowflake.connector
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import os

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
conn = snowflake.connector.connect(
    user='ROBERTGONZALEZ',
    account='hndffbt-te29703',
    private_key=pkb,
    warehouse='TRANSFORMING',
    database='GCMS_DEV',
    schema='MOVEMENT_II_FINALE',
    role='ACCOUNTADMIN'
)

cursor = conn.cursor()

print("=" * 80)
print("TESTING SNOWFLAKE DATA")
print("=" * 80)

# Test 1: List all schemas
print("\n1. ALL SCHEMAS IN GCMS_DEV:")
cursor.execute("SHOW SCHEMAS IN DATABASE GCMS_DEV")
schemas = cursor.fetchall()
for schema in schemas:
    print(f"   - {schema[1]}")

# Test 2: List tables in MOVEMENT_II_FINALE
print("\n2. TABLES IN MOVEMENT_II_FINALE:")
cursor.execute("SHOW TABLES IN SCHEMA GCMS_DEV.MOVEMENT_II_FINALE")
tables = cursor.fetchall()
for table in tables:
    print(f"   - {table[1]}")

# Test 3: Check DIM_CONCERT
print("\n3. DIM_CONCERT - Row count and sample:")
cursor.execute("SELECT COUNT(*) FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_CONCERT")
count = cursor.fetchone()[0]
print(f"   Row count: {count}")

if count > 0:
    cursor.execute("SELECT * FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_CONCERT LIMIT 3")
    columns = [desc[0] for desc in cursor.description]
    print(f"   Columns: {', '.join(columns)}")
    print("\n   Sample rows:")
    for row in cursor.fetchall():
        print(f"   {dict(zip(columns, row))}")

# Test 4: Check DIM_MUSICIAN
print("\n4. DIM_MUSICIAN - Row count and columns:")
cursor.execute("SELECT COUNT(*) FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_MUSICIAN")
count = cursor.fetchone()[0]
print(f"   Row count: {count}")

if count > 0:
    cursor.execute("SELECT * FROM GCMS_DEV.MOVEMENT_II_FINALE.DIM_MUSICIAN LIMIT 3")
    columns = [desc[0] for desc in cursor.description]
    print(f"   Columns: {', '.join(columns)}")
    print("\n   Sample rows:")
    for row in cursor.fetchall():
        print(f"   {dict(zip(columns, row))}")

# Test 5: Check FCT_MUSICIAN_PAYMENT
print("\n5. FCT_MUSICIAN_PAYMENT - Row count and columns:")
cursor.execute("SELECT COUNT(*) FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT")
count = cursor.fetchone()[0]
print(f"   Row count: {count}")

if count > 0:
    cursor.execute("SELECT * FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT LIMIT 3")
    columns = [desc[0] for desc in cursor.description]
    print(f"   Columns: {', '.join(columns)}")
    print("\n   Sample rows:")
    for row in cursor.fetchall():
        print(f"   {dict(zip(columns, row))}")

# Test 6: Check if concert_id exists in FCT_MUSICIAN_PAYMENT
print("\n6. CONCERT_IDs in FCT_MUSICIAN_PAYMENT:")
cursor.execute("SELECT DISTINCT concert_id FROM GCMS_DEV.MOVEMENT_II_FINALE.FCT_MUSICIAN_PAYMENT LIMIT 5")
concert_ids = cursor.fetchall()
for cid in concert_ids:
    print(f"   - {cid[0]}")

# Test 7: Check MOVEMENT_I tables for pieces
print("\n7. TABLES IN MOVEMENT_I:")
cursor.execute("SHOW TABLES IN SCHEMA GCMS_DEV.MOVEMENT_I")
tables = cursor.fetchall()
for table in tables:
    print(f"   - {table[1]}")

# Test 8: Check SUPABASE_CONCERT_PIECE
print("\n8. SUPABASE_CONCERT_PIECE - Sample data:")
cursor.execute("SELECT * FROM GCMS_DEV.MOVEMENT_I.SUPABASE_CONCERT_PIECE LIMIT 3")
columns = [desc[0] for desc in cursor.description]
print(f"   Columns: {', '.join(columns)}")
for row in cursor.fetchall():
    print(f"   {dict(zip(columns, row))}")

cursor.close()
conn.close()

print("\n" + "=" * 80)
print("TEST COMPLETE")
print("=" * 80)
