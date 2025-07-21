'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Music, Mail, Lock, User, Phone, Guitar } from 'lucide-react'
import { supabase, type Musician } from '@/lib/supabase'

export default function MusicianLoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    instrument: '',
    experience_level: 'professional'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isLogin) {
        // Validate login inputs
        if (!formData.email || !formData.password) {
          setMessage('Please enter both email and password')
          setLoading(false)
          return
        }
        
        // For demo purposes, simulate login
        setMessage('Login successful! Redirecting to dashboard...')
        setTimeout(() => {
          router.push('/musicians/dashboard')
        }, 1500)
      } else {
        // Validate registration inputs (no password required for registration)
        if (!formData.email || !formData.name || !formData.phone || !formData.instrument) {
          setMessage('Please fill in all required fields')
          setLoading(false)
          return
        }

        // Log the application data for now
        console.log('Musician application submitted:', {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          instrument: formData.instrument,
          experience_level: formData.experience_level,
          timestamp: new Date().toISOString()
        })

        // Try to save to Supabase
        try {
          const musicianData: Omit<Musician, 'id' | 'created_at' | 'updated_at'> = {
            email: formData.email,
            name: formData.name,
            phone: formData.phone,
            instrument: formData.instrument,
            experience_level: formData.experience_level as 'beginner' | 'intermediate' | 'advanced' | 'professional'
          }

          console.log('Attempting to insert musician data:', musicianData)

          const { data, error } = await supabase
            .from('musicians')
            .insert([musicianData])
            .select()

          if (error) {
            console.error('Database error:', error)
            console.error('Error details:', {
              code: error.code,
              message: error.message,
              details: error.details,
              hint: error.hint
            })
            
            if (error.code === '42P01') {
              setMessage('Application received but could not be saved: The musicians table does not exist in the database. Please contact the administrator to set up the database.')
            } else if (error.code === '23505') {
              setMessage('A musician with this email is already registered.')
            } else if (error.code === 'PGRST116') {
              setMessage('Application received but could not be saved: The table schema may not match the expected format. Please contact the administrator.')
            } else {
              setMessage(`Application received but could not be saved to database: ${error.message || 'Unknown error'}. Please contact the administrator.`)
            }
            setLoading(false)
            return
          } else {
            console.log('Successfully saved to database:', data)
            setMessage('Application submitted successfully! Your information has been saved to our database and we will contact you if there are suitable openings.')
          }
        } catch (dbError: any) {
          console.error('Database connection error:', dbError)
          console.error('Error details:', {
            name: dbError?.name,
            message: dbError?.message,
            stack: dbError?.stack
          })
          setMessage('Application received but database connection failed. Please contact the administrator to ensure the database is properly configured.')
          setLoading(false)
          return
        }
        
        setTimeout(() => {
          setIsLogin(true)
          setFormData({
            email: '',
            password: '',
            name: '',
            phone: '',
            instrument: '',
            experience_level: 'professional'
          })
          setMessage('')
        }, 4000)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      if (isLogin) {
        setMessage('Login failed. Please try again.')
      } else {
        setMessage('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/GCMS_Logo.png`}
                alt="GCMS Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-bold text-gray-900">
                <span className="hidden sm:inline">Greenville Chamber Music Society</span>
                <span className="sm:hidden">GCMS</span>
              </span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Home
              </Link>
              <Link href="/concerts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Concerts
              </Link>
              <Link href="/calendar" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Calendar
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                About
              </Link>
              <Link href="/musicians/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm">
                Musicians
              </Link>
              <Link href="/students/signup" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Student Program
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Music className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              {isLogin ? 'Musician Portal' : 'Join Our Orchestra'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin 
                ? 'Sign in to access your musician dashboard' 
                : 'Apply to become a member of our orchestra'
              }
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {isLogin && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <div className="mt-1 relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instrument" className="block text-sm font-medium text-gray-700">
                      Primary Instrument
                    </label>
                    <div className="mt-1 relative">
                      <Guitar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        id="instrument"
                        name="instrument"
                        type="text"
                        required
                        value={formData.instrument}
                        onChange={(e) => setFormData({...formData, instrument: e.target.value})}
                        className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="e.g., Violin, Piano, Trumpet"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
                      Experience Level
                    </label>
                    <div className="mt-1">
                      <select
                        id="experience_level"
                        name="experience_level"
                        required
                        value={formData.experience_level}
                        onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Orchestra positions are by invitation only. We will review your application and contact you if there are openings that match your expertise.
                    </p>
                  </div>
                </>
              )}
            </div>

            {message && (
              <div className={`text-center text-sm p-3 rounded-lg ${
                message.includes('successfully') && message.includes('saved to our database')
                  ? 'bg-green-900/50 text-green-300 border border-green-700' 
                  : message.includes('could not be saved') || message.includes('failed') || message.includes('error')
                  ? 'bg-red-900/50 text-red-300 border border-red-700'
                  : 'bg-yellow-900/50 text-yellow-300 border border-yellow-700'
              }`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Submit Application')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setMessage('')
                  setFormData({
                    email: '',
                    password: '',
                    name: '',
                    phone: '',
                    instrument: '',
                    experience_level: 'professional'
                  })
                }}
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
              >
                {isLogin 
                  ? "Want to join our orchestra? Apply here" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
