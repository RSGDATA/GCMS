# Supabase Production Environment Fix

## 🚨 **Issue Identified:**

Your production site is connecting to a **different Supabase project** than your local development:

- **Local**: `stttpmepakavlubbsqaq.supabase.co` ✅ (Working)
- **Production**: `fwkgwbzvsievnchjxgtq.supabase.co` ❌ (SSL Certificate Error)

## 🔧 **Solution Options:**

### **Option 1: Use Same Supabase Project (Recommended)**

Update your production environment to use the same Supabase project as local:

1. **Add GitHub Repository Secrets:**
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Add these secrets:
     - `NEXT_PUBLIC_SUPABASE_URL`: `https://stttpmepakavlubbsqaq.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0dHRwbWVwYWthdmx1YmJzcWFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MzA2OTUsImV4cCI6MjA3MDEwNjY5NX0.6cHtvtpLJwvStPx93G3NBAIy8rHSS-IIEBeeNXFM4ME`

2. **Update GitHub Actions Workflow** to use these secrets

### **Option 2: Fix Production Supabase Project**

If you want to keep using `fwkgwbzvsievnchjxgtq.supabase.co`:

1. **Check Supabase Project Status:**
   - Go to that Supabase project dashboard
   - Verify it's active and not paused
   - Check SSL certificate status

2. **Add Domain to CORS:**
   - Settings → API → Site URL
   - Add: `https://greenvillechambermusicsociety.org`

3. **Run Database Setup:**
   - Run all your SQL scripts in that project
   - Create invitation codes
   - Set up tables and permissions

## 🎯 **Recommended Action:**

**Use Option 1** - Update GitHub to use your working local Supabase project since:
- ✅ It's already set up with all your data
- ✅ All SQL scripts have been run
- ✅ Invitation codes exist
- ✅ No SSL certificate issues

## 📋 **Next Steps:**
1. **Add GitHub secrets** (Option 1)
2. **Update workflow** to use secrets
3. **Redeploy** and test

This will fix the SSL certificate error and use your working database!
