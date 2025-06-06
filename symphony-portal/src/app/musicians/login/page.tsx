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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-amber-400" />
              <span className="text-xl font-bold text-white">Greenville Chamber Music Society</span>
            </Link>
            <Link href="/" className="text-white hover:text-amber-400 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Music className="mx-auto h-12 w-12 text-amber-400" />
            <h2 className="mt-6 text-3xl font-bold text-white">
              {isLogin ? 'Musician Login' : 'Apply to Join Our Orchestra'}
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              {isLogin 
                ? 'Access your musician portal' 
                : 'Submit your application to join our professional orchestra'
              }
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
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
                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {isLogin && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
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
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
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
                        className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
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
                        className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instrument" className="block text-sm font-medium text-gray-300">
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
                        className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                        placeholder="e.g., Violin, Piano, Trumpet"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="experience_level" className="block text-sm font-medium text-gray-300">
                      Experience Level
                    </label>
                    <div className="mt-1">
                      <select
                        id="experience_level"
                        name="experience_level"
                        required
                        value={formData.experience_level}
                        onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
                    <p className="text-sm text-gray-300">
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
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
