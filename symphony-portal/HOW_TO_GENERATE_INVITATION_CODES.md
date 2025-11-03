# How to Generate Invitation Codes

## 🎯 **Quick Method (Recommended)**

### **Generate a Single Invitation Code:**
```sql
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
VALUES (
    'GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
    '',
    'admin'
);
```

### **Generate Multiple Invitation Codes:**
```sql
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
VALUES 
('GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)), '', 'admin'),
('GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)), '', 'admin'),
('GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)), '', 'admin');
```

## 🔧 **Custom Invitation Codes**

### **Create Your Own Code:**
```sql
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
VALUES ('GCMS-JOHN2024', '', 'admin');
```

### **Create Code for Specific Person:**
```sql
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
VALUES ('GCMS-SARAH2024', '', 'admin');
```

## 📋 **Step-by-Step Process:**

### **1. Go to Supabase Dashboard**
- Visit your Supabase project dashboard
- Click **SQL Editor**

### **2. Copy and Paste SQL**
- Copy one of the SQL commands above
- Paste it in the SQL Editor
- Click **Run**

### **3. View Your New Codes**
```sql
SELECT 
    invitation_code, 
    is_used, 
    expires_at, 
    created_at,
    CASE 
        WHEN expires_at < NOW() THEN 'EXPIRED'
        WHEN is_used = true THEN 'USED'
        ELSE 'ACTIVE'
    END as status
FROM public.musician_invitations 
ORDER BY created_at DESC
LIMIT 10;
```

### **4. Send Code to Musician**
- Copy the new invitation code (e.g., `GCMS-A1B2C3D4`)
- Send it to the musician via email
- They use it at: `https://greenvillechambermusicsociety.org/musicians/register/`

## 🎨 **Code Format Examples:**
- `GCMS-A1B2C3D4` (Random)
- `GCMS-JOHN2024` (Custom for John)
- `GCMS-VIOLIN01` (Custom for violin player)
- `GCMS-SPRING24` (Custom for spring season)

## 📊 **Manage Existing Codes:**

### **View All Codes:**
```sql
SELECT invitation_code, is_used, expires_at, created_at
FROM public.musician_invitations 
ORDER BY created_at DESC;
```

### **View Only Active Codes:**
```sql
SELECT invitation_code, created_at
FROM public.musician_invitations 
WHERE is_used = false AND expires_at > NOW()
ORDER BY created_at DESC;
```

### **View Used Codes:**
```sql
SELECT invitation_code, used_at
FROM public.musician_invitations 
WHERE is_used = true
ORDER BY used_at DESC;
```

## ⚡ **Quick Commands:**

### **Generate 1 Code:**
```sql
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
VALUES ('GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)), '', 'admin');
```

### **Generate 5 Codes:**
```sql
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
SELECT 'GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)), '', 'admin'
FROM generate_series(1, 5);
```

## 🎯 **That's It!**
- **Generate codes** with SQL
- **Send to musicians** via email
- **They register** at your website
- **Codes get marked as used** automatically

Simple and effective! 🎵
