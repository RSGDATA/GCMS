"""
Snowflake Connection Utility
Manages database connections for the Streamlit app
"""

import snowflake.connector
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import streamlit as st
import os

def load_private_key(private_key_path=None):
    """Load the Snowflake private key from file"""
    if private_key_path is None:
        private_key_path = os.getenv('SNOWFLAKE_PRIVATE_KEY_PATH', '/opt/airflow/.ssh/snowflake_key.p8')
    
    with open(private_key_path, 'rb') as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,
            backend=default_backend()
        )
    
    return private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

def get_snowflake_connection():
    """
    Create and return a Snowflake connection
    Uses Streamlit secrets or environment variables for credentials
    """
    try:
        # Try to get credentials from Streamlit secrets first
        if hasattr(st, 'secrets') and 'snowflake' in st.secrets:
            # Check if password is provided in secrets
            if 'password' in st.secrets.snowflake:
                conn = snowflake.connector.connect(
                    user=st.secrets.snowflake.user,
                    password=st.secrets.snowflake.password,
                    account=st.secrets.snowflake.account,
                    warehouse=st.secrets.snowflake.get('warehouse', 'TRANSFORMING'),
                    database=st.secrets.snowflake.get('database', 'GCMS_DEV'),
                    schema=st.secrets.snowflake.get('schema', 'FINALE'),
                    role=st.secrets.snowflake.get('role', 'ACCOUNTADMIN')
                )
            else:
                # Use private key authentication
                private_key_path = st.secrets.snowflake.get('private_key_path')
                conn = snowflake.connector.connect(
                    user=st.secrets.snowflake.user,
                    account=st.secrets.snowflake.account,
                    private_key=load_private_key(private_key_path),
                    warehouse=st.secrets.snowflake.get('warehouse', 'TRANSFORMING'),
                    database=st.secrets.snowflake.get('database', 'GCMS_DEV'),
                    schema=st.secrets.snowflake.get('schema', 'FINALE'),
                    role=st.secrets.snowflake.get('role', 'ACCOUNTADMIN')
                )
        else:
            # Fall back to environment variables
            password = os.getenv('SNOWFLAKE_PASSWORD')
            if password:
                conn = snowflake.connector.connect(
                    user=os.getenv('SNOWFLAKE_USER'),
                    password=password,
                    account=os.getenv('SNOWFLAKE_ACCOUNT'),
                    warehouse=os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING'),
                    database=os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV'),
                    schema=os.getenv('SNOWFLAKE_GOLD_SCHEMA', 'FINALE'),
                    role=os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN')
                )
            else:
                # Use private key authentication
                conn = snowflake.connector.connect(
                    user=os.getenv('SNOWFLAKE_USER'),
                    account=os.getenv('SNOWFLAKE_ACCOUNT'),
                    private_key=load_private_key(),
                    warehouse=os.getenv('SNOWFLAKE_WAREHOUSE', 'TRANSFORMING'),
                    database=os.getenv('SNOWFLAKE_DATABASE', 'GCMS_DEV'),
                    schema=os.getenv('SNOWFLAKE_GOLD_SCHEMA', 'FINALE'),
                    role=os.getenv('SNOWFLAKE_ROLE', 'ACCOUNTADMIN')
                )
        
        return conn
    
    except Exception as e:
        st.error(f"Failed to connect to Snowflake: {str(e)}")
        st.info("Please check your Snowflake credentials in .streamlit/secrets.toml or environment variables")
        st.stop()

def test_connection():
    """Test the Snowflake connection"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT CURRENT_VERSION()")
        version = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        return True, f"Connected successfully! Snowflake version: {version}"
    except Exception as e:
        return False, f"Connection failed: {str(e)}"
