# Supabase CORS Fix for GitHub Pages

## 🚨 Issue: "Failed to fetch" Error

The error occurs because your GitHub Pages domain isn't in Supabase's allowed origins list.

## 🔧 Fix: Add GitHub Pages Domain to Supabase

### **Step 1: Go to Supabase Dashboard**
1. Visit your Supabase project dashboard
2. Go to **Settings** → **API**
3. Scroll down to **Site URL** section

### **Step 2: Add Your GitHub Pages URL**
Add your GitHub Pages URL to the allowed origins:

**Your GitHub Pages URL**: `https://rsgdata.github.io`

**In Supabase Settings:**
- **Site URL**: `https://rsgdata.github.io`
- **Additional allowed origins**: Add `https://rsgdata.github.io/GCMS`

### **Step 3: Save Settings**
Click **Save** to update the CORS settings.

## 🔄 Alternative: Update Environment Variables

If you want to use a different Supabase URL for production, you can:

1. **Create production environment variables**
2. **Update your GitHub repository secrets**
3. **Modify the GitHub Actions workflow** to use production variables

## 🧪 Test After Fix

1. **Wait 2-3 minutes** for Supabase settings to propagate
2. **Try the invitation code again** on your GitHub Pages site
3. **Check browser console** for any remaining errors

## 📋 Common CORS Issues

- ✅ **Site URL**: Must match your GitHub Pages domain exactly
- ✅ **Protocol**: Must use `https://` (not `http://`)
- ✅ **Subdomain**: Include full subdomain (`rsgdata.github.io`)
- ✅ **Path**: May need to include `/GCMS` if that's your repo name

## 🎯 Expected Result

After adding your GitHub Pages domain to Supabase:
- ✅ Database queries will work
- ✅ Invitation codes will validate
- ✅ User registration will function
- ✅ Login system will work

The fix should resolve the "Failed to fetch" error immediately!
