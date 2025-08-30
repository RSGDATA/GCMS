# Contractor Invitation System Guide

## 🎯 Overview
This system allows you to invite contractors via email with unique invitation codes. Contractors can then register their own username and password to access the musicians portal.

## 🚀 Setup Instructions

### Step 1: Create Invitation Tables
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `invitation_system.sql`
4. Click **Run** to execute

This creates:
- `musician_invitations` table to store invitation codes
- Sample test invitation codes
- Proper permissions and policies

### Step 2: Test the System
The system comes with these test invitation codes:
- `GCMS-TEST001` for contractor1@example.com
- `GCMS-TEST002` for contractor2@example.com  
- `GCMS-DEMO123` for demo@example.com

## 📧 How the Invitation Process Works

### For Administrators:
1. **Create Invitation**: Generate invitation codes for contractors
2. **Send Email**: Email the contractor with their invitation code and registration link
3. **Monitor**: Track which invitations have been used

### For Contractors:
1. **Receive Email**: Get invitation code via email
2. **Visit Registration**: Go to `/musicians/register`
3. **Enter Code**: Input invitation code to verify eligibility
4. **Create Account**: Choose username and password
5. **Login**: Use new credentials to access the portal

## 🔧 Using the System

### Registration Process
1. **Step 1**: Contractor visits `/musicians/register`
2. **Step 2**: Enters invitation code (e.g., `GCMS-TEST001`)
3. **Step 3**: System verifies code is valid and not expired
4. **Step 4**: Contractor creates username and password
5. **Step 5**: Account is created and invitation marked as used
6. **Step 6**: Contractor can now login normally

### Testing the Registration
1. Visit: `http://localhost:3000/musicians/register`
2. Enter invitation code: `GCMS-DEMO123`
3. Create account with your chosen username/password
4. Login at: `http://localhost:3000/musicians/login`

## 🛠️ Managing Invitations

### Creating New Invitations
You can create new invitation codes by running SQL in Supabase:

```sql
-- Generate a new invitation code
INSERT INTO public.musician_invitations (invitation_code, email, invited_by) 
VALUES (
    'GCMS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)),
    'contractor@example.com',
    'admin'
);
```

### Viewing All Invitations
```sql
SELECT invitation_code, email, is_used, expires_at, created_at 
FROM public.musician_invitations 
ORDER BY created_at DESC;
```

### Checking Invitation Status
```sql
-- See which invitations are still available
SELECT invitation_code, email, expires_at 
FROM public.musician_invitations 
WHERE is_used = false AND expires_at > NOW()
ORDER BY created_at DESC;
```

## 📧 Email Template for Contractors

Here's a sample email template you can use:

```
Subject: Invitation to Join GCMS Musicians Portal

Dear [Contractor Name],

You've been invited to join the Greenville Chamber Music Society musicians portal.

Your invitation code: GCMS-XXXXXXXX

To create your account:
1. Visit: [your-domain]/musicians/register
2. Enter your invitation code: GCMS-XXXXXXXX
3. Create your username and password
4. Start using the portal!

This invitation expires in 30 days.

If you have any questions, please contact us.

Best regards,
GCMS Administration
```

## 🔒 Security Features

### Invitation Security
- **Unique Codes**: Each invitation has a unique code
- **Expiration**: Invitations expire after 30 days
- **One-Time Use**: Each code can only be used once
- **Email Verification**: Code is tied to specific email address

### Account Security
- **Username Validation**: Checks for duplicate usernames
- **Password Requirements**: Minimum 8 characters
- **Secure Storage**: Passwords stored securely in database

## 📋 File Structure

```
src/
├── app/
│   ├── musicians/
│   │   ├── register/
│   │   │   └── page.tsx          # Registration page
│   │   └── login/
│   │       └── page.tsx          # Login page
│   └── admin/
│       └── musicians/
│           └── page.tsx          # Admin management
├── lib/
│   ├── auth.ts                   # Authentication logic
│   └── supabase.ts              # Database client
└── ...

invitation_system.sql            # Database setup script
```

## 🎯 Workflow Summary

1. **Admin creates invitation** → Generates unique code
2. **Admin emails contractor** → Sends code and registration link  
3. **Contractor registers** → Uses code to create account
4. **System validates** → Checks code, creates account
5. **Contractor logs in** → Uses new credentials normally

The system is now ready for contractor invitations and registrations!
