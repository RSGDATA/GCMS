# Musician Portal Auth Redesign — Supabase Auth Migration

## Problem

The current musician portal uses a custom auth system with plain-text passwords stored in `musician_auth_simple`, sessions in localStorage, and no route protection. This is a development-mode setup that isn't suitable for real musicians to use.

## Goal

Migrate to Supabase Auth so musicians get a professional invite-only portal with:
- Hashed passwords (handled automatically by Supabase)
- Secure JWT sessions (no more localStorage)
- Email-based invitations
- Password reset ("forgot password")
- Protected routes (can't access dashboard without logging in)

## How Professional Portals Do This

The standard pattern for an invite-only portal (used by Notion, Linear, Slack, etc.):

1. **Admin invites** a musician by email
2. **Musician receives an email** with a link to set up their account
3. **Musician creates a password** and is logged in
4. **Sessions are JWT-based** — cryptographically signed, auto-refreshing, can't be faked
5. **Data is protected server-side** via RLS — even if someone navigates to `/dashboard`, they can't read any data without a valid session

## Architecture

### What Changes

| Component | Current | New |
|---|---|---|
| User storage | `musician_auth_simple` table (plain-text passwords) | Supabase Auth `auth.users` (bcrypt-hashed) |
| Session storage | localStorage (fakeable) | Supabase Auth session (JWT, httpOnly) |
| Login | Custom query against `musician_auth_simple` | `supabase.auth.signInWithPassword()` |
| Registration | Custom insert into `musician_auth_simple` | `supabase.auth.signUp()` |
| Invitation | Code in `musician_invitations`, shared manually | Admin enters email → Supabase Edge Function sends invite email with magic link |
| Password reset | Not supported | `supabase.auth.resetPasswordForEmail()` — built-in |
| Route protection | None | Auth check in a shared layout or wrapper component |
| User profile data | Stored in `musician_auth_simple` | `profiles` table joined to `auth.users` via user ID |
| Admin operations | Direct table queries with anon key | Supabase Edge Function with service role key |

### What Stays The Same

- All existing UI pages (login, register, dashboard, admin) — just rewired
- The concept of invite-only access
- Supabase as the backend
- Static export to GitHub Pages (Supabase Auth is fully client-side)

## Data Model

### New `profiles` table (replaces `musician_auth_simple`)

```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  first_name text,
  last_name text,
  email text,
  phone text,
  instrument text,
  role text default 'musician' check (role in ('musician', 'admin', 'conductor')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: users can read their own profile, admins can read all
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can manage all profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
```

### Keep `musician_invitations` table (minor update)

Add a `role` column so admins can assign roles at invite time:

```sql
alter table public.musician_invitations
  add column role text default 'musician';
```

## Invitation Flow

### How it works (professional approach)

```
Admin Panel                    Supabase                      Musician
    |                              |                              |
    |-- 1. Enter email + role ---->|                              |
    |                              |-- 2. Send invite email ----->|
    |                              |                              |
    |                              |<-- 3. Click link ------------|
    |                              |                              |
    |                              |-- 4. Show set-password page->|
    |                              |                              |
    |                              |<-- 5. Set password ----------|
    |                              |                              |
    |                              |-- 6. Create auth.user ------>|
    |                              |-- 7. Create profile row ---->|
    |                              |-- 8. Return JWT session ---->|
    |                              |                              |
    |                              |          Musician is now     |
    |                              |          logged in           |
```

### Option A: Magic Link Invites (recommended)

Uses Supabase's built-in `inviteUserByEmail()`. Requires a Supabase Edge Function since it needs the service role key.

**Edge Function: `invite-musician`**
```typescript
// supabase/functions/invite-musician/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Verify the caller is an admin
  const authHeader = req.headers.get('Authorization')!
  const { data: { user } } = await supabaseAdmin.auth.getUser(
    authHeader.replace('Bearer ', '')
  )

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return new Response('Unauthorized', { status: 403 })
  }

  // Send the invite
  const { email, role, first_name, last_name } = await req.json()

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: { role, first_name, last_name }
  })

  if (error) return new Response(JSON.stringify({ error }), { status: 400 })

  return new Response(JSON.stringify({ data }), { status: 200 })
})
```

**Admin panel calls it:**
```typescript
const inviteMusician = async (email: string, role: string) => {
  const { data: { session } } = await supabase.auth.getSession()

  const res = await supabase.functions.invoke('invite-musician', {
    body: { email, role, first_name, last_name }
  })
}
```

### Option B: Invitation Codes (keep current UX, upgrade backend)

If you prefer giving codes in person (natural for a chamber music society):

1. Admin generates code in admin panel → stored in `musician_invitations`
2. Admin gives code to musician (email, text, in person)
3. Musician goes to `/musicians/register`, enters code + email + password
4. Frontend validates code, then calls `supabase.auth.signUp()`
5. A database trigger auto-creates the `profiles` row

Both options work. **Option A is more professional** (musician just clicks a link). **Option B is simpler** to implement and keeps your existing flow.

## Auth Library Rewrite

### New `src/lib/auth.ts`

```typescript
import { supabase } from './supabase'

// Login
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Logout
export async function logout() {
  await supabase.auth.signOut()
}

// Get current session
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Get current user's profile
export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return data
}

// Password reset
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/musicians/reset-password`
  })
  return { error }
}

// Listen for auth changes (login, logout, token refresh)
export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}
```

## Route Protection

### Auth wrapper component

```typescript
// src/components/AuthGuard.tsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/musicians/login')
      } else {
        setAuthenticated(true)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.push('/musicians/login')
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) return <div>Loading...</div>
  if (!authenticated) return null

  return <>{children}</>
}
```

Used in dashboard layout:
```typescript
// src/app/musicians/dashboard/layout.tsx
import AuthGuard from '@/components/AuthGuard'

export default function DashboardLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>
}
```

## Migration Plan

### Phase 1: Foundation
1. Create `profiles` table with RLS policies
2. Create Supabase Edge Function for admin operations
3. Rewrite `src/lib/auth.ts` to use Supabase Auth

### Phase 2: UI Updates
4. Update login page — use email + password with `signInWithPassword()`
5. Update register page — use `signUp()` (with invitation code validation if Option B)
6. Add "Forgot Password" link on login page
7. Add `AuthGuard` wrapper to protected routes

### Phase 3: Admin
8. Update admin page to use Edge Function for invitations
9. Remove password visibility (no longer applicable — passwords are hashed)
10. Add role management (musician, conductor, admin)

### Phase 4: Cleanup
11. Migrate existing users from `musician_auth_simple` → Supabase Auth
12. Drop `musician_auth_simple` table
13. Update CLAUDE.md to reflect new auth architecture

## What You Get

- Passwords are hashed automatically (bcrypt)
- Sessions are JWT-based and auto-refresh
- "Forgot password" works out of the box
- RLS protects data even if someone bypasses the UI
- Musicians get a real invite email (or keep the code flow)
- Admin can't accidentally see passwords (they're hashed)
- No custom security code to maintain — Supabase handles it
