-- ============================================================
-- Add Public Key to Snowflake User for Key Pair Authentication
-- ============================================================
-- Run this in your Snowflake SQL Editor
-- ============================================================

-- Set the public key for ACCOUNTADMIN user
ALTER USER ACCOUNTADMIN SET RSA_PUBLIC_KEY='MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAxzv2XOKujHOTB18OdYFm8jSuseZgYzr9ZWxVcp4EVskIgv1yWNjf1y6yd59MEJCxq9rt+ILvzm92E4YjJrQHUp1u6NpuBfuBHnnrE92ujCqWqUY877VjwSMVLIB7EDIvPWAHfoccUpL0p+IZATF9Nye0p6V2M7+xJTpC1Jo/9MGfrjx8l3upLUgLb6UaQIFKmX4XIf0KKcY5QOux0RAKBLVe4hVxQqgXReO05Qs1109VkS+wzCtZ+hzzgbCK+8TQdfHlaJX92/RHWtvQtqqr9bZn2cB3FTCQN5IHbcNKrHD0bpdXtzoJRewg904dfsaJNpk5AcCJEgspxKhb3fahGzi/Z8moE4o9xl6mve8KArQ3tJO6Fdomx0d3eg5YzqqojFrIqelZg9DW0VVoKMEG2JeF4e4Wrtd2oC8Ie/vTaY0NLFwNQYlcvbOqVtEPBCmOeAXX/7T9XTwRD9y3F09dFqTtMKsbvxAENKZ+KVM+BAZTBAjA8vAXA+OsrhA5WHQLFkVPjPQ0UVpK0x9s4sphRlOYijTbH7hmU/t7s3swoxByfn7uoFSy1JUF3M0pbMxhdT6cI3ddy1kaPhvlvgkwPIPBL0M14+8mnahX5ra9U8Vmlur7ewbSnkrXHVF8MxjHn1a5ypeDv8Oy1vqDxq7p1pftQGh/j6TRRZKNzVOwBfMCAwEAAQ==';

-- Verify the key was added
DESC USER ACCOUNTADMIN;

-- ============================================================
-- SUCCESS!
-- ============================================================
-- If you see RSA_PUBLIC_KEY_FP with a fingerprint value,
-- the key was added successfully!
-- ============================================================
