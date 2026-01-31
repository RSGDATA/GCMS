#!/usr/bin/env python3
"""
Insert missing concert data directly into Snowflake
"""

import snowflake.connector
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

print("=" * 80)
print("INSERTING MISSING CONCERT DATA")
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

# Connect
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
print("   ✓ Connected!")

# Spring Awakening concert ID
spring_id = 'e94ffdc0-99f5-4a38-a78f-e4e428420615'
summer_id = 'b31b2263-43a2-41c6-8689-280b3afbe604'

print("\n2. Adding concert participants...")

# Add participants for Spring Awakening WITH pay_type and agreed_amount
cursor.execute(f"""
INSERT INTO SUPABASE_CONCERT_PARTICIPANT (concert_participant_id, concert_id, musician_id, role, pay_type, agreed_amount, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), '{spring_id}', musician_id, 'musician',
    CASE WHEN ROW_NUMBER() OVER (ORDER BY musician_id) = 1 THEN 'lump_sum' ELSE 'per_service' END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY musician_id) = 1 THEN 500.00 ELSE 125.00 END,
    'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM (SELECT musician_id FROM BR_SUPABASE_MUSICIAN LIMIT 5)
""")
print(f"   ✓ Added {cursor.rowcount} participants for Spring Awakening")

# Add participants for Summer Festival WITH pay_type and agreed_amount
cursor.execute(f"""
INSERT INTO SUPABASE_CONCERT_PARTICIPANT (concert_participant_id, concert_id, musician_id, role, pay_type, agreed_amount, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), '{summer_id}', musician_id, 'musician',
    CASE WHEN ROW_NUMBER() OVER (ORDER BY musician_id) <= 2 THEN 'lump_sum' ELSE 'per_service' END,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY musician_id) <= 2 THEN 450.00 ELSE 120.00 END,
    'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM (SELECT musician_id FROM BR_SUPABASE_MUSICIAN LIMIT 5 OFFSET 5)
""")
print(f"   ✓ Added {cursor.rowcount} participants for Summer Festival")

print("\n3. Adding payments...")

# Add payments for Spring Awakening
cursor.execute(f"""
INSERT INTO SUPABASE_PAYMENT (payment_id, musician_id, concert_id, gross_amount, deductions, net_amount, paid, payment_date, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), cp.musician_id, cp.concert_id,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) = 1 THEN 500.00 ELSE 250.00 END,
    0.00,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) = 1 THEN 500.00 ELSE 250.00 END,
    TRUE,
    '2025-03-15'::DATE, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM SUPABASE_CONCERT_PARTICIPANT cp WHERE cp.concert_id = '{spring_id}'
""")
print(f"   ✓ Added {cursor.rowcount} payments for Spring Awakening")

# Add payments for Summer Festival
cursor.execute(f"""
INSERT INTO SUPABASE_PAYMENT (payment_id, musician_id, concert_id, gross_amount, deductions, net_amount, paid, payment_date, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), cp.musician_id, cp.concert_id,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) <= 2 THEN 450.00 ELSE 240.00 END,
    0.00,
    CASE WHEN ROW_NUMBER() OVER (ORDER BY cp.musician_id) <= 2 THEN 450.00 ELSE 240.00 END,
    TRUE,
    '2025-06-20'::DATE, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM SUPABASE_CONCERT_PARTICIPANT cp WHERE cp.concert_id = '{summer_id}'
""")
print(f"   ✓ Added {cursor.rowcount} payments for Summer Festival")

print("\n4. Adding rehearsals...")

# Add rehearsals for Spring Awakening
cursor.execute(f"""
INSERT INTO SUPABASE_REHEARSAL (rehearsal_id, concert_id, rehearsal_date, required, service_value, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), '{spring_id}', '2025-03-13'::TIMESTAMP, TRUE, 125.00, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
UNION ALL
SELECT UUID_STRING(), '{spring_id}', '2025-03-15'::TIMESTAMP, TRUE, 125.00, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
""")
print(f"   ✓ Added {cursor.rowcount} rehearsals for Spring Awakening")

# Add rehearsals for Summer Festival
cursor.execute(f"""
INSERT INTO SUPABASE_REHEARSAL (rehearsal_id, concert_id, rehearsal_date, required, service_value, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), '{summer_id}', '2025-06-18'::TIMESTAMP, TRUE, 120.00, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
UNION ALL
SELECT UUID_STRING(), '{summer_id}', '2025-06-20'::TIMESTAMP, TRUE, 120.00, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
""")
print(f"   ✓ Added {cursor.rowcount} rehearsals for Summer Festival")

print("\n5. Adding attendance records...")

# Add attendance for Spring Awakening
cursor.execute(f"""
INSERT INTO SUPABASE_ATTENDANCE (attendance_id, rehearsal_id, musician_id, attended, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), r.rehearsal_id, cp.musician_id, TRUE, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM SUPABASE_REHEARSAL r CROSS JOIN SUPABASE_CONCERT_PARTICIPANT cp
WHERE r.concert_id = '{spring_id}' AND cp.concert_id = '{spring_id}'
""")
print(f"   ✓ Added {cursor.rowcount} attendance records for Spring Awakening")

# Add attendance for Summer Festival
cursor.execute(f"""
INSERT INTO SUPABASE_ATTENDANCE (attendance_id, rehearsal_id, musician_id, attended, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
SELECT UUID_STRING(), r.rehearsal_id, cp.musician_id, TRUE, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
FROM SUPABASE_REHEARSAL r CROSS JOIN SUPABASE_CONCERT_PARTICIPANT cp
WHERE r.concert_id = '{summer_id}' AND cp.concert_id = '{summer_id}'
""")
print(f"   ✓ Added {cursor.rowcount} attendance records for Summer Festival")

cursor.close()
conn.close()

print("\n" + "=" * 80)
print("SUCCESS! Raw data inserted into Snowflake!")
print("=" * 80)
print("\nNow run dbt to process this data:")
print("  cd dbt")
print("  docker-compose run dbt run --profiles-dir . --target prod")
print("\nOr if dbt is in your PATH:")
print("  cd dbt && dbt run --profiles-dir . --target prod")
