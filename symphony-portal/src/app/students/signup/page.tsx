'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Music, Mail, Phone, User, Users, Heart, AlertCircle } from 'lucide-react'
// import { supabase } from '@/lib/supabase'
import { sanitizeInput, validateEmail, validatePhone } from '@/lib/utils'

export default function StudentSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    parent_email: '',
    parent_name: '',
    parent_phone: '',
    student_name: '',
    student_age: '',
    student_grade: '',
    emergency_contact: '',
    emergency_phone: '',
    medical_conditions: '',
    program_interest: 'orchestra'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Sanitize inputs
      const sanitizedData = {
        parent_email: sanitizeInput(formData.parent_email),
        parent_name: sanitizeInput(formData.parent_name),
        parent_phone: sanitizeInput(formData.parent_phone),
        student_name: sanitizeInput(formData.student_name),
        student_age: parseInt(formData.student_age),
        student_grade: sanitizeInput(formData.student_grade),
        emergency_contact: sanitizeInput(formData.emergency_contact),
        emergency_phone: sanitizeInput(formData.emergency_phone),
        medical_conditions: sanitizeInput(formData.medical_conditions) || null,
        program_interest: formData.program_interest
      }

      // Validate inputs
      if (!validateEmail(sanitizedData.parent_email)) {
        setMessage('Please enter a valid email address')
        setLoading(false)
        return
      }

      if (!validatePhone(sanitizedData.parent_phone) || !validatePhone(sanitizedData.emergency_phone)) {
        setMessage('Please enter valid phone numbers')
        setLoading(false)
        return
      }

      if (!sanitizedData.parent_name || !sanitizedData.student_name || !sanitizedData.student_grade || !sanitizedData.emergency_contact) {
        setMessage('Please fill in all required fields')
        setLoading(false)
        return
      }

      if (isNaN(sanitizedData.student_age) || sanitizedData.student_age < 5 || sanitizedData.student_age > 18) {
        setMessage('Student age must be between 5 and 18')
        setLoading(false)
        return
      }

      // Register student
        // For demo purposes, simulate successful registration
        setMessage('Registration successful! Redirecting to student portal...')
        setTimeout(() => {
          router.push('/students/dashboard')
        }, 2000)
    } catch {
      setMessage('An error occurred. Please try again.')
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
              <span className="text-xl font-bold text-white">Symphony Portal</span>
            </Link>
            <Link href="/" className="text-white hover:text-amber-400 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-amber-400" />
            <h2 className="mt-6 text-3xl font-bold text-white">
              Student Outreach Program
            </h2>
            <p className="mt-2 text-sm text-gray-300">
              Free music education for underserved youth - Register your child today
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Program Benefits</h3>
            <ul className="text-gray-300 space-y-2">
              <li>• Free orchestra classes and music theory instruction</li>
              <li>• Complimentary instrument rental and maintenance</li>
              <li>• Professional mentorship from experienced musicians</li>
              <li>• Performance opportunities throughout the year</li>
              <li>• Music supplies and sheet music provided</li>
            </ul>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Parent/Guardian Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parent_name" className="block text-sm font-medium text-gray-300">
                    Full Name *
                  </label>
                  <div className="mt-1 relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="parent_name"
                      name="parent_name"
                      type="text"
                      required
                      value={formData.parent_name}
                      onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="parent_email" className="block text-sm font-medium text-gray-300">
                    Email Address *
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="parent_email"
                      name="parent_email"
                      type="email"
                      required
                      value={formData.parent_email}
                      onChange={(e) => setFormData({...formData, parent_email: e.target.value})}
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="parent_phone" className="block text-sm font-medium text-gray-300">
                    Phone Number *
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="parent_phone"
                      name="parent_phone"
                      type="tel"
                      required
                      value={formData.parent_phone}
                      onChange={(e) => setFormData({...formData, parent_phone: e.target.value})}
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Student Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="student_name" className="block text-sm font-medium text-gray-300">
                    Student Full Name *
                  </label>
                  <div className="mt-1 relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="student_name"
                      name="student_name"
                      type="text"
                      required
                      value={formData.student_name}
                      onChange={(e) => setFormData({...formData, student_name: e.target.value})}
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Enter student's full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="student_age" className="block text-sm font-medium text-gray-300">
                    Age *
                  </label>
                  <input
                    id="student_age"
                    name="student_age"
                    type="number"
                    min="5"
                    max="18"
                    required
                    value={formData.student_age}
                    onChange={(e) => setFormData({...formData, student_age: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    placeholder="Age (5-18)"
                  />
                </div>

                <div>
                  <label htmlFor="student_grade" className="block text-sm font-medium text-gray-300">
                    Grade Level *
                  </label>
                  <input
                    id="student_grade"
                    name="student_grade"
                    type="text"
                    required
                    value={formData.student_grade}
                    onChange={(e) => setFormData({...formData, student_grade: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    placeholder="e.g., 5th Grade, 9th Grade"
                  />
                </div>

                <div>
                  <label htmlFor="program_interest" className="block text-sm font-medium text-gray-300">
                    Program Interest
                  </label>
                  <select
                    id="program_interest"
                    name="program_interest"
                    value={formData.program_interest}
                    onChange={(e) => setFormData({...formData, program_interest: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="orchestra">Orchestra</option>
                    <option value="choir">Choir</option>
                    <option value="band">Band</option>
                    <option value="music_theory">Music Theory</option>
                    <option value="individual_lessons">Individual Lessons</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-300">
                    Emergency Contact Name *
                  </label>
                  <div className="mt-1 relative">
                    <AlertCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="emergency_contact"
                      name="emergency_contact"
                      type="text"
                      required
                      value={formData.emergency_contact}
                      onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Emergency contact name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="emergency_phone" className="block text-sm font-medium text-gray-300">
                    Emergency Phone *
                  </label>
                  <div className="mt-1 relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="emergency_phone"
                      name="emergency_phone"
                      type="tel"
                      required
                      value={formData.emergency_phone}
                      onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                      placeholder="Emergency phone number"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-300">
                    Medical Conditions or Allergies (Optional)
                  </label>
                  <textarea
                    id="medical_conditions"
                    name="medical_conditions"
                    rows={3}
                    value={formData.medical_conditions}
                    onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800/50 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                    placeholder="Please list any medical conditions, allergies, or special needs we should be aware of..."
                  />
                </div>
              </div>
            </div>

            {message && (
              <div className={`text-center text-sm ${
                message.includes('successful') ? 'text-green-400' : 'text-red-400'
              }`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register for Program'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-400">
              By registering, you agree to our program terms and conditions. 
              All information will be kept confidential and secure.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
