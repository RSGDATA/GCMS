#!/usr/bin/env python3
"""
Setup Airbyte Connection: Supabase → Snowflake
Programmatically configure Airbyte without using the UI
"""

import os
import sys
import time
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Airbyte API configuration
AIRBYTE_API_URL = os.getenv('AIRBYTE_API_URL', 'http://localhost:8000/api/public/v1')
AIRBYTE_CLIENT_ID = os.getenv('AIRBYTE_CLIENT_ID', '')
AIRBYTE_CLIENT_SECRET = os.getenv('AIRBYTE_CLIENT_SECRET', '')

# Connection details from .env
SUPABASE_HOST = os.getenv('SUPABASE_URL', '').replace('https://', '').replace('http://', '')
SUPABASE_DB_HOST = f"db.{SUPABASE_HOST.split('.')[0]}.supabase.co"
SUPABASE_PASSWORD = os.getenv('SUPABASE_DB_PASSWORD', '')

SNOWFLAKE_ACCOUNT = os.getenv('SNOWFLAKE_ACCOUNT', '')
SNOWFLAKE_USER = os.getenv('SNOWFLAKE_USER', '')
SNOWFLAKE_PASSWORD = os.getenv('SNOWFLAKE_PASSWORD', '')
SNOWFLAKE_PRIVATE_KEY_PATH = os.getenv('SNOWFLAKE_PRIVATE_KEY_PATH', '')
SNOWFLAKE_WAREHOUSE = os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING')
SNOWFLAKE_DATABASE = os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV')
SNOWFLAKE_SCHEMA = os.getenv('SNOWFLAKE_RAW_SCHEMA', 'MOVEMENT_I')  # Symphony Structure!
SNOWFLAKE_ROLE = os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN')


class AirbyteSetup:
    def __init__(self):
        self.api_url = AIRBYTE_API_URL
        self.workspace_id = None
        self.source_id = None
        self.destination_id = None
        self.connection_id = None
        self.access_token = None
    
    def get_access_token(self):
        """Get OAuth access token using client credentials"""
        print("🔐 Getting access token...")
        
        try:
            response = requests.post(
                "http://localhost:8000/api/public/v1/applications/token",
                json={
                    "client_id": AIRBYTE_CLIENT_ID,
                    "client_secret": AIRBYTE_CLIENT_SECRET
                },
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            
            self.access_token = response.json().get('access_token')
            print("✅ Access token obtained!")
            return True
            
        except Exception as e:
            print(f"❌ Error getting access token: {e}")
            print(f"   Response: {response.text if 'response' in locals() else 'No response'}")
            return False
    
    def get_headers(self):
        """Get headers with authorization"""
        return {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.access_token}"
        }
        
    def check_credentials(self):
        """Verify all required credentials are present"""
        print("🔍 Checking credentials...")
        
        missing = []
        if not SUPABASE_HOST:
            missing.append("SUPABASE_URL")
        if not SUPABASE_PASSWORD:
            missing.append("SUPABASE_DB_PASSWORD")
        if not SNOWFLAKE_ACCOUNT:
            missing.append("SNOWFLAKE_ACCOUNT")
        if not SNOWFLAKE_USER:
            missing.append("SNOWFLAKE_USER")
        if not SNOWFLAKE_PRIVATE_KEY_PATH:
            missing.append("SNOWFLAKE_PRIVATE_KEY_PATH")
            
        if missing:
            print(f"❌ Missing credentials in .env file:")
            for cred in missing:
                print(f"   - {cred}")
            print("\nPlease fill in these values in your .env file and try again.")
            return False
        
        # Check if private key file exists
        if not os.path.exists(SNOWFLAKE_PRIVATE_KEY_PATH):
            print(f"❌ Private key file not found: {SNOWFLAKE_PRIVATE_KEY_PATH}")
            print(f"   Make sure the path in SNOWFLAKE_PRIVATE_KEY_PATH is correct")
            return False
            
        print("✅ All credentials found!")
        print(f"✅ Private key file exists: {SNOWFLAKE_PRIVATE_KEY_PATH}")
        return True
    
    def wait_for_airbyte(self, max_retries=30):
        """Wait for Airbyte to be ready"""
        print("⏳ Waiting for Airbyte to be ready...")
        
        for i in range(max_retries):
            try:
                response = requests.get(f"{self.api_url}/health", timeout=5)
                if response.status_code == 200:
                    print("✅ Airbyte is ready!")
                    return True
            except requests.exceptions.RequestException:
                pass
            
            print(f"   Attempt {i+1}/{max_retries}... (waiting 2s)")
            time.sleep(2)
        
        print("❌ Airbyte is not responding. Make sure Docker containers are running:")
        print("   docker-compose up -d")
        return False
    
    def get_workspace(self):
        """Get or create workspace"""
        print("\n📁 Getting workspace...")
        
        try:
            response = requests.post(
                f"{self.api_url}/workspaces/list",
                json={},
                headers=self.get_headers()
            )
            response.raise_for_status()
            
            workspaces = response.json().get('workspaces', [])
            if workspaces:
                self.workspace_id = workspaces[0]['workspaceId']
                print(f"✅ Using workspace: {self.workspace_id}")
                return True
            else:
                print("❌ No workspace found. Creating one...")
                # Create workspace
                response = requests.post(
                    f"{self.api_url}/workspaces/create",
                    json={
                        "name": "GCMS Data Platform",
                        "email": "admin@gcms.org"
                    },
                    headers=self.get_headers()
                )
                response.raise_for_status()
                self.workspace_id = response.json()['workspaceId']
                print(f"✅ Created workspace: {self.workspace_id}")
                return True
                
        except Exception as e:
            print(f"❌ Error getting workspace: {e}")
            print(f"   Response: {response.text if 'response' in locals() else 'No response'}")
            return False
    
    def create_postgres_source(self):
        """Create Supabase (Postgres) source"""
        print("\n🔌 Creating Supabase source...")
        
        source_config = {
            "workspaceId": self.workspace_id,
            "sourceDefinitionId": "decd338e-5647-4c0b-adf4-da0e75f5a750",  # Postgres source
            "connectionConfiguration": {
                "host": SUPABASE_DB_HOST,
                "port": 5432,
                "database": "postgres",
                "username": "postgres",
                "password": SUPABASE_PASSWORD,
                "schemas": ["public"],
                "ssl": True,
                "replication_method": {
                    "method": "Standard"
                }
            },
            "name": "Supabase (GCMS)"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/sources/create",
                json=source_config
            )
            response.raise_for_status()
            
            self.source_id = response.json()['sourceId']
            print(f"✅ Created Supabase source: {self.source_id}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating source: {e}")
            print(f"   Response: {response.text if 'response' in locals() else 'No response'}")
            return False
    
    def create_snowflake_destination(self):
        """Create Snowflake destination with key pair authentication"""
        print("\n❄️  Creating Snowflake destination...")
        
        # Read private key file
        try:
            with open(SNOWFLAKE_PRIVATE_KEY_PATH, 'r') as f:
                private_key_content = f.read()
            print(f"✅ Loaded private key from: {SNOWFLAKE_PRIVATE_KEY_PATH}")
        except Exception as e:
            print(f"❌ Error reading private key: {e}")
            print(f"   Make sure SNOWFLAKE_PRIVATE_KEY_PATH is set correctly in .env")
            return False
        
        # Configure with key pair authentication
        destination_config = {
            "workspaceId": self.workspace_id,
            "destinationDefinitionId": "424892c4-daac-4491-b35d-c6688ba547ba",  # Snowflake destination
            "connectionConfiguration": {
                "host": f"{SNOWFLAKE_ACCOUNT}.snowflakecomputing.com",
                "role": SNOWFLAKE_ROLE,
                "warehouse": SNOWFLAKE_WAREHOUSE,
                "database": SNOWFLAKE_DATABASE,
                "schema": SNOWFLAKE_SCHEMA,
                "username": SNOWFLAKE_USER,
                "credentials": {
                    "auth_type": "Key Pair Authentication",
                    "private_key": private_key_content
                },
                "jdbc_url_params": ""
            },
            "name": "Snowflake (GCMS)"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/destinations/create",
                json=destination_config
            )
            response.raise_for_status()
            
            self.destination_id = response.json()['destinationId']
            print(f"✅ Created Snowflake destination: {self.destination_id}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating destination: {e}")
            print(f"   Response: {response.text if 'response' in locals() else 'No response'}")
            return False
    
    def create_connection(self):
        """Create connection between source and destination"""
        print("\n🔗 Creating connection...")
        
        # Tables to sync
        tables = [
            "fiscal_year",
            "season",
            "concert",
            "person",
            "musician",
            "user_profile",
            "piece",
            "concert_piece",
            "rehearsal",
            "concert_participant",
            "rsvp",
            "attendance",
            "payment",
            "contract"
        ]
        
        # Build sync catalog
        streams = []
        for table in tables:
            streams.append({
                "stream": {
                    "name": table,
                    "jsonSchema": {},
                    "supportedSyncModes": ["full_refresh", "incremental"],
                    "sourceDefinedCursor": False,
                    "defaultCursorField": [],
                    "sourceDefinedPrimaryKey": [["id"]],
                    "namespace": "public"
                },
                "config": {
                    "syncMode": "full_refresh",
                    "destinationSyncMode": "overwrite",
                    "cursorField": [],
                    "primaryKey": [["id"]],
                    "aliasName": table,
                    "selected": True
                }
            })
        
        connection_config = {
            "sourceId": self.source_id,
            "destinationId": self.destination_id,
            "syncCatalog": {
                "streams": streams
            },
            "schedule": {
                "units": 24,
                "timeUnit": "hours"
            },
            "status": "active",
            "name": "Supabase → Snowflake (GCMS)"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/connections/create",
                json=connection_config
            )
            response.raise_for_status()
            
            self.connection_id = response.json()['connectionId']
            print(f"✅ Created connection: {self.connection_id}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating connection: {e}")
            print(f"   Response: {response.text if 'response' in locals() else 'No response'}")
            return False
    
    def trigger_sync(self):
        """Trigger initial sync"""
        print("\n🚀 Triggering initial sync...")
        
        try:
            response = requests.post(
                f"{self.api_url}/connections/sync",
                json={"connectionId": self.connection_id}
            )
            response.raise_for_status()
            
            print("✅ Sync triggered! Data will start flowing from Supabase to Snowflake.")
            print(f"   You can monitor progress in Airflow or Airbyte UI")
            return True
            
        except Exception as e:
            print(f"❌ Error triggering sync: {e}")
            return False
    
    def save_ids_to_env(self):
        """Save IDs to .env file for future use"""
        print("\n💾 Saving connection IDs to .env...")
        
        try:
            # Read current .env
            with open('.env', 'r') as f:
                lines = f.readlines()
            
            # Update or add IDs
            ids_to_add = {
                'AIRBYTE_WORKSPACE_ID': self.workspace_id,
                'AIRBYTE_SOURCE_ID': self.source_id,
                'AIRBYTE_DESTINATION_ID': self.destination_id,
                'AIRBYTE_CONNECTION_ID': self.connection_id
            }
            
            updated_lines = []
            added_keys = set()
            
            for line in lines:
                updated = False
                for key, value in ids_to_add.items():
                    if line.startswith(f"{key}="):
                        updated_lines.append(f"{key}={value}\n")
                        added_keys.add(key)
                        updated = True
                        break
                if not updated:
                    updated_lines.append(line)
            
            # Add any missing keys
            for key, value in ids_to_add.items():
                if key not in added_keys:
                    updated_lines.append(f"\n# Airbyte Connection IDs (auto-generated)\n")
                    updated_lines.append(f"{key}={value}\n")
            
            # Write back
            with open('.env', 'w') as f:
                f.writelines(updated_lines)
            
            print("✅ Connection IDs saved to .env")
            return True
            
        except Exception as e:
            print(f"⚠️  Could not save to .env: {e}")
            print(f"   Workspace ID: {self.workspace_id}")
            print(f"   Connection ID: {self.connection_id}")
            return False
    
    def run(self):
        """Run the complete setup"""
        print("=" * 60)
        print("🚀 Airbyte Setup: Supabase → Snowflake")
        print("=" * 60)
        
        # Step 1: Check credentials
        if not self.check_credentials():
            return False
        
        # Step 2: Wait for Airbyte
        if not self.wait_for_airbyte():
            return False
        
        # Step 3: Get access token
        if not self.get_access_token():
            return False
        
        # Step 4: Get workspace
        if not self.get_workspace():
            return False
        
        # Step 4: Create source
        if not self.create_postgres_source():
            return False
        
        # Step 5: Create destination
        if not self.create_snowflake_destination():
            return False
        
        # Step 6: Create connection
        if not self.create_connection():
            return False
        
        # Step 7: Save IDs
        self.save_ids_to_env()
        
        # Step 8: Trigger sync
        self.trigger_sync()
        
        print("\n" + "=" * 60)
        print("✅ SETUP COMPLETE!")
        print("=" * 60)
        print(f"\n📊 Connection Details:")
        print(f"   Workspace ID:   {self.workspace_id}")
        print(f"   Source ID:      {self.source_id}")
        print(f"   Destination ID: {self.destination_id}")
        print(f"   Connection ID:  {self.connection_id}")
        print(f"\n🔄 Sync Schedule: Every 24 hours")
        print(f"\n🎯 Next Steps:")
        print(f"   1. Check Airbyte UI: http://localhost:8000")
        print(f"   2. Monitor sync progress")
        print(f"   3. Once complete, run dbt models")
        print(f"   4. Check Snowflake RAW schema for data")
        print("\n" + "=" * 60)
        
        return True


def main():
    """Main entry point"""
    setup = AirbyteSetup()
    success = setup.run()
    
    if not success:
        print("\n❌ Setup failed. Please check the errors above.")
        sys.exit(1)
    
    sys.exit(0)


if __name__ == "__main__":
    main()
