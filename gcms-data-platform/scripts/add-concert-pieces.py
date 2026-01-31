#!/usr/bin/env python3
"""
Add concert pieces (program) for concerts missing them
"""

import snowflake.connector
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

print("=" * 80)
print("ADDING CONCERT PIECES (PROGRAM DATA)")
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

# Get piece IDs
cursor.execute("SELECT piece_id, title FROM SUPABASE_PIECE")
pieces = {row[1]: row[0] for row in cursor.fetchall()}
print(f"\n2. Found {len(pieces)} pieces in database")

# Concert IDs
spring_id = 'e94ffdc0-99f5-4a38-a78f-e4e428420615'
summer_id = 'b31b2263-43a2-41c6-8689-280b3afbe604'

print("\n3. Adding concert pieces...")

# Spring Awakening - Vivaldi Four Seasons & Mozart Symphony 40
spring_pieces = [
    ('The Four Seasons: Spring', 1),
    ('Symphony No. 40 in G minor, K. 550', 2)
]

for piece_title, order in spring_pieces:
    if piece_title in pieces:
        cursor.execute(f"""
        INSERT INTO SUPABASE_CONCERT_PIECE (concert_piece_id, concert_id, piece_id, program_order, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
        SELECT UUID_STRING(), '{spring_id}', '{pieces[piece_title]}', {order}, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
        """)
        print(f"   ✓ Added '{piece_title}' to Spring Awakening (order {order})")

# Season Finale - Mahler Symphony 1
summer_pieces = [
    ('Symphony No. 1 in D major "Titan"', 1)
]

for piece_title, order in summer_pieces:
    if piece_title in pieces:
        cursor.execute(f"""
        INSERT INTO SUPABASE_CONCERT_PIECE (concert_piece_id, concert_id, piece_id, program_order, _AIRBYTE_AB_ID, _AIRBYTE_EMITTED_AT, _AIRBYTE_NORMALIZED_AT)
        SELECT UUID_STRING(), '{summer_id}', '{pieces[piece_title]}', {order}, 'manual_' || UUID_STRING(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()
        """)
        print(f"   ✓ Added '{piece_title}' to Season Finale (order {order})")

cursor.close()
conn.close()

print("\n" + "=" * 80)
print("SUCCESS! Concert pieces added!")
print("=" * 80)
