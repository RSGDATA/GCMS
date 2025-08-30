import { supabase } from './supabase'

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResult {
  success: boolean
  message: string
  user?: {
    id: string
    username: string
    email: string
  }
}

// Simple authentication function for development
// In production, you should use proper password hashing (bcrypt, etc.)
export async function authenticateMusician(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const { username, password } = credentials

    if (!username || !password) {
      return {
        success: false,
        message: 'Username and password are required'
      }
    }

    // Query the simple auth table (for development) - using public schema
    const { data, error } = await supabase
      .from('musician_auth_simple')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (error) {
      // Only log errors for debugging if needed
      // console.error('Database query error:', error)
      
      // Check if table doesn't exist
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Database table not found. Please run the setup SQL script first.'
        }
      }
      
      // Check if no rows returned (PGRST116 is "no rows returned" error)
      if (error.code === 'PGRST116' || error.message?.includes('No rows found')) {
        return {
          success: false,
          message: 'Invalid username or password'
        }
      }
      
      return {
        success: false,
        message: 'Authentication failed. Please check your credentials and try again.'
      }
    }

    if (!data) {
      return {
        success: false,
        message: 'Invalid username or password'
      }
    }

    // Simple password comparison (for development only)
    if (data.password !== password) {
      return {
        success: false,
        message: 'Invalid username or password'
      }
    }

    // Update last login time
    await supabase
      .from('musician_auth_simple')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id)

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: data.id,
        username: data.username,
        email: data.email
      }
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred during authentication'
    }
  }
}

// Session management
export function setUserSession(user: { id: string; username: string; email: string }) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('musician_session', JSON.stringify({
      ...user,
      loginTime: new Date().toISOString()
    }))
  }
}

export function getUserSession() {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('musician_session')
    if (session) {
      try {
        const parsed = JSON.parse(session)
        // Check if session is less than 24 hours old
        const loginTime = new Date(parsed.loginTime)
        const now = new Date()
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)
        
        if (hoursDiff < 24) {
          return parsed
        } else {
          // Session expired
          clearUserSession()
          return null
        }
      } catch {
        return null
      }
    }
  }
  return null
}

export function clearUserSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('musician_session')
  }
}

export function isAuthenticated(): boolean {
  return getUserSession() !== null
}
