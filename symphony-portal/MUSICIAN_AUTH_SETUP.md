# Musician Authentication System Setup Guide

## Overview
This system provides secure username/password authentication for musicians to access their portal. It includes:

1. **Authentication Database Tables** - Stores usernames and passwords
2. **Login System** - Secure login with session management
3. **Admin Interface** - Manage musician credentials
4. **Test Credentials** - Pre-configured accounts for testing

## Setup Instructions

### 1. Database Setup
First, you need to run the SQL commands to create the authentication tables in your Supabase database:

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Run the contents of `musician_auth_table.sql`

This will create:
- `musician_auth` table (for production with hashed passwords)
- `musician_auth_simple` table (for development with plain text passwords)
- Sample test accounts

### 2. Test the System

#### Access the Admin Panel
Visit: `http://localhost:3000/admin/musicians`

This page allows you to:
- View all musician accounts
- Add new musicians with username/password
- Delete existing accounts
- View/hide passwords
- See login activity

#### Test Login Credentials
The system comes with these pre-configured test accounts:

| Role | Username | Password |
|------|----------|----------|
| Conductor | `conductor` | `conductor123` |
| Concertmaster | `concertmaster` | `concert456` |
| Musician | `musician1` | `music789` |
| Admin | `admin` | `admin123` |

#### Test the Login Process
1. Go to: `http://localhost:3000/musicians/login`
2. Use any of the test credentials above
3. The system will authenticate and redirect to the dashboard

### 3. How Authentication Works

#### Login Process
1. User enters username and password
2. System queries the `musician_auth_simple` table
3. Compares password (plain text for development)
4. If valid, creates a session in localStorage
5. Redirects to musician dashboard

#### Session Management
- Sessions are stored in browser localStorage
- Sessions expire after 24 hours
- Users can be logged out by clearing the session

#### Security Features
- Username/password validation
- Session timeout
- Active/inactive user status
- Last login tracking

### 4. Adding New Musicians

#### Via Admin Interface
1. Go to `/admin/musicians`
2. Click "Add New Musician"
3. Enter username, email, and password
4. Click "Add Musician"

#### Via Database
You can also add musicians directly in Supabase:
```sql
INSERT INTO gcms_website.musician_auth_simple (username, email, password, is_active) 
VALUES ('newmusician', 'musician@example.com', 'password123', true);
```

### 5. Production Considerations

#### Security Improvements Needed
For production use, you should:

1. **Use Password Hashing**: Switch to the `musician_auth` table with bcrypt hashed passwords
2. **HTTPS Only**: Ensure all authentication happens over HTTPS
3. **Rate Limiting**: Add login attempt limits
4. **Strong Passwords**: Enforce password complexity requirements
5. **Session Security**: Use secure, httpOnly cookies instead of localStorage

#### Database Migration
To use hashed passwords in production:
1. Install bcrypt: `npm install bcrypt @types/bcrypt`
2. Update the auth service to hash passwords
3. Use the `musician_auth` table instead of `musician_auth_simple`

### 6. File Structure

```
src/
├── lib/
│   ├── auth.ts              # Authentication logic
│   └── supabase.ts          # Database types and client
├── app/
│   ├── musicians/
│   │   └── login/
│   │       └── page.tsx     # Login page
│   └── admin/
│       └── musicians/
│           └── page.tsx     # Admin management page
└── components/
    └── Footer.tsx           # Contains "Musicians Login" link

musician_auth_table.sql      # Database setup script
```

### 7. Troubleshooting

#### Common Issues
1. **Database Connection**: Ensure Supabase environment variables are set
2. **Table Not Found**: Run the SQL setup script in Supabase
3. **Login Fails**: Check that test credentials exist in the database
4. **Permission Errors**: Verify RLS policies allow public access for login

#### Debug Steps
1. Check browser console for errors
2. Verify database tables exist in Supabase
3. Test database connection in Supabase dashboard
4. Ensure environment variables are loaded

## Usage Summary

1. **For Musicians**: Use the "Musicians Login" link in the footer to access the login page
2. **For Admins**: Visit `/admin/musicians` to manage user accounts
3. **For Testing**: Use the provided test credentials to verify the system works

The system is now ready for use with secure username/password authentication!
