#!/usr/bin/env python3
"""
Test Supabase connection and data retrieval
"""

import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

print("🔍 Testing Supabase Connection...")
print(f"URL: {SUPABASE_URL}")
print(f"Key: {SUPABASE_KEY[:20]}..." if SUPABASE_KEY else "Key: None")
print()

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Missing credentials!")
    exit(1)

try:
    # Create client
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("✅ Client created successfully")
    
    # Test each table
    tables = ['person', 'musician', 'concert', 'rehearsal', 'attendance']
    
    for table in tables:
        try:
            response = supabase.table(table).select("*").limit(1).execute()
            count = len(response.data)
            print(f"✅ {table}: {count} row(s) retrieved")
        except Exception as e:
            print(f"❌ {table}: {str(e)}")
    
    print("\n🎉 Supabase connection test complete!")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    exit(1)
