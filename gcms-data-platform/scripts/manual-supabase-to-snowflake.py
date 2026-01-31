#!/usr/bin/env python3
"""
Manual data load from Supabase to Snowflake
Bypasses Airbyte for demo purposes
"""

import os
import sys
from datetime import datetime
import snowflake.connector
import requests

# Environment variables are set by docker-compose, no need for load_dotenv()

# Supabase connection
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

# Snowflake connection
SNOWFLAKE_ACCOUNT = os.getenv('SNOWFLAKE_ACCOUNT')
SNOWFLAKE_USER = os.getenv('SNOWFLAKE_USER')
SNOWFLAKE_PASSWORD = os.getenv('SNOWFLAKE_PASSWORD')
SNOWFLAKE_WAREHOUSE = os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING')
SNOWFLAKE_DATABASE = os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV')
SNOWFLAKE_SCHEMA = os.getenv('SNOWFLAKE_SCHEMA', 'MOVEMENT_I')

# Tables to sync
TABLES = [
    'fiscal_year',
    'season',
    'person',
    'musician',
    'user_profile',
    'piece',
    'concert',
    'concert_piece',
    'rehearsal',
    'concert_participant',
    'rsvp',
    'attendance',
    'payment',
    'contract',
    'tax_document',
    'media'
]

def fetch_supabase_data(table_name: str):
    """Fetch data from Supabase using REST API"""
    url = f"{SUPABASE_URL}/rest/v1/{table_name}?select=*"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def get_snowflake_connection():
    """Create Snowflake connection using key-pair authentication"""
    from cryptography.hazmat.backends import default_backend
    from cryptography.hazmat.primitives import serialization
    
    # Read the private key - use absolute path from env var
    private_key_path = os.getenv('SNOWFLAKE_PRIVATE_KEY_PATH')
    if not private_key_path:
        raise ValueError("SNOWFLAKE_PRIVATE_KEY_PATH environment variable not set")
    
    with open(private_key_path, 'rb') as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )
    
    pkb = private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    return snowflake.connector.connect(
        account=SNOWFLAKE_ACCOUNT,
        user=SNOWFLAKE_USER,
        private_key=pkb,
        warehouse=SNOWFLAKE_WAREHOUSE,
        database=SNOWFLAKE_DATABASE,
        schema=SNOWFLAKE_SCHEMA
    )

def create_bronze_table(cursor, table_name: str, sample_row: dict):
    """Create bronze table if it doesn't exist"""
    # Drop existing table (with fully qualified name)
    cursor.execute(f"DROP TABLE IF EXISTS {SNOWFLAKE_DATABASE}.{SNOWFLAKE_SCHEMA}.supabase_{table_name}")
    
    # Build column definitions from sample row
    columns = []
    for key, value in sample_row.items():
        if isinstance(value, bool):
            col_type = "BOOLEAN"
        elif isinstance(value, int):
            col_type = "NUMBER"
        elif isinstance(value, float):
            col_type = "FLOAT"
        elif isinstance(value, (datetime, str)) and ('_at' in key or '_date' in key or key.endswith('_time')):
            col_type = "TIMESTAMP_NTZ"
        else:
            col_type = "VARCHAR"
        columns.append(f"{key} {col_type}")
    
    # Add Airbyte metadata columns
    columns.extend([
        "_airbyte_ab_id VARCHAR",
        "_airbyte_emitted_at TIMESTAMP_NTZ",
        "_airbyte_normalized_at TIMESTAMP_NTZ",
        "_airbyte_data VARIANT"
    ])
    
    create_sql = f"""
    CREATE TABLE supabase_{table_name} (
        {', '.join(columns)}
    )
    """
    
    cursor.execute(create_sql)
    print(f"✅ Created table supabase_{table_name}")

def load_table_data(cursor, table_name: str):
    """Load data from Supabase table to Snowflake"""
    print(f"\n📊 Loading {table_name}...")
    
    try:
        # Fetch all data from Supabase
        data = fetch_supabase_data(table_name)
        
        if not data:
            print(f"⚠️  No data in {table_name} - creating empty table")
            # Create empty table with minimal schema
            cursor.execute(f"""
                CREATE OR REPLACE TABLE {SNOWFLAKE_DATABASE}.{SNOWFLAKE_SCHEMA}.supabase_{table_name} (
                    id VARCHAR,
                    _airbyte_ab_id VARCHAR,
                    _airbyte_emitted_at TIMESTAMP_NTZ,
                    _airbyte_normalized_at TIMESTAMP_NTZ,
                    _airbyte_data VARIANT
                )
            """)
            print(f"✅ Created empty table supabase_{table_name}")
            return
        
        print(f"   Found {len(data)} rows")
        
        # Create table based on first row
        create_bronze_table(cursor, table_name, data[0])
        
        # Insert data row by row
        now = datetime.utcnow()
        import json
        
        columns = list(data[0].keys())
        data_columns = columns.copy()
        columns.extend(['_airbyte_ab_id', '_airbyte_emitted_at', '_airbyte_normalized_at', '_airbyte_data'])
        
        for row in data:
            # Build values list
            values = [row.get(col) for col in data_columns]
            
            # Add Airbyte metadata
            airbyte_ab_id = f"{table_name}_{row.get('id', 'unknown')}_{now.timestamp()}"
            airbyte_data_json = json.dumps(row)
            
            # Create placeholders for regular columns
            regular_placeholders = ', '.join(['%s'] * (len(columns) - 1))
            
            # Build INSERT with PARSE_JSON inline - use fully qualified name
            insert_sql = f"""
            INSERT INTO {SNOWFLAKE_DATABASE}.{SNOWFLAKE_SCHEMA}.supabase_{table_name} ({', '.join(columns)})
            SELECT {regular_placeholders}, PARSE_JSON(%s)
            """
            
            # Combine all values
            all_values = values + [airbyte_ab_id, now, now, airbyte_data_json]
            cursor.execute(insert_sql, all_values)
        
        print(f"✅ Loaded {len(data)} rows into supabase_{table_name}")
        
    except Exception as e:
        print(f"❌ Error loading {table_name}: {str(e)}")
        raise

def main():
    """Main execution"""
    print("🚀 Starting manual Supabase to Snowflake sync...\n")
    
    # Validate environment variables
    required_vars = [
        'SUPABASE_URL', 'SUPABASE_SERVICE_KEY',
        'SNOWFLAKE_ACCOUNT', 'SNOWFLAKE_USER', 'SNOWFLAKE_PASSWORD'
    ]
    
    missing = [var for var in required_vars if not os.getenv(var)]
    if missing:
        print(f"❌ Missing environment variables: {', '.join(missing)}")
        print("   Please check your .env file")
        sys.exit(1)
    
    # Connect to Snowflake
    print("❄️  Connecting to Snowflake...")
    conn = get_snowflake_connection()
    cursor = conn.cursor()
    print("✅ Connected to Snowflake\n")
    
    try:
        # Load each table
        for table in TABLES:
            load_table_data(cursor, table)
        
        # Commit transaction
        conn.commit()
        
        print("\n" + "="*50)
        print("✅ SUCCESS! All data loaded to Snowflake")
        print("="*50)
        print("\n📋 Next steps:")
        print("   1. Run dbt to transform the data:")
        print("      cd dbt && dbt run")
        print("   2. Check your gold layer tables for demo")
        
    except Exception as e:
        conn.rollback()
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)
    
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
