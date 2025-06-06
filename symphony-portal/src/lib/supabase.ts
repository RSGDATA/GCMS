import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface Musician {
  id?: string
  email: string
  name: string
  phone: string
  instrument: string
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'professional'
  created_at?: string
  updated_at?: string
}

export interface Student {
  id: string
  parent_email: string
  parent_name: string
  parent_phone: string
  student_name: string
  student_age: number
  student_grade: string
  emergency_contact: string
  emergency_phone: string
  medical_conditions?: string
  program_interest: 'orchestra' | 'choir' | 'band' | 'music_theory' | 'individual_lessons'
  created_at: string
  updated_at: string
}

export interface Concert {
  id: string
  title: string
  description: string
  date: string
  venue: string
  ticket_price: number
  available_seats: number
  image_url?: string
  created_at: string
  updated_at: string
}

export interface TicketPurchase {
  id: string
  concert_id: string
  customer_email: string
  customer_name: string
  quantity: number
  total_amount: number
  stripe_payment_intent_id: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}
