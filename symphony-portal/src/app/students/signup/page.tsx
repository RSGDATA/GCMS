'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Music, Mail, Phone, User, Users, Heart, AlertCircle } from 'lucide-react'
import { getImagePath } from '@/lib/imagePath'
import { supabase } from '@/lib/supabase'

export default function StudentSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [formData, setFormData] = useState({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    student_name: '',
    student_age: '',
    student_grade: '',
    program_interest: 'orchestra',
    emergency_contact: '',
    emergency_phone: '',
    medical_conditions: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Convert student_age to number
      const studentData = {
        ...formData,
        student_age: parseInt(formData.student_age)
      }

      // Log the data being sent
      console.log('Sending student data:', studentData)

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(error.message || 'Database error occurred')
      }

      console.log('Student registered successfully:', data)
      setMessage('Registration successful! Redirecting to student portal...')
      
      setTimeout(() => {
        router.push('/students/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Registration error:', error)
      setMessage(`An error occurred: ${error instanceof Error ? error.message : 'Please try again.'}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-12">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Student Outreach Program
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Free music education for underserved youth - Register your child today
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Benefits</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Free orchestra classes and music theory instruction</li>
              <li>• Complimentary instrument rental and maintenance</li>
              <li>• Professional mentorship from experienced musicians</li>
              <li>• Performance opportunities throughout the year</li>
              <li>• Music supplies and sheet music provided</li>
            </ul>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Parent Information */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parent/Guardian Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700">
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
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="parent_email" className="block text-sm font-medium text-gray-700">
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
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="parent_phone" className="block text-sm font-medium text-gray-700">
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
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Student Information */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="student_name" className="block text-sm font-medium text-gray-700">
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
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter student's full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="student_age" className="block text-sm font-medium text-gray-700">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Age (5-18)"
                  />
                </div>

                <div>
                  <label htmlFor="student_grade" className="block text-sm font-medium text-gray-700">
                    Grade *
                  </label>
                  <input
                    id="student_grade"
                    name="student_grade"
                    type="text"
                    required
                    value={formData.student_grade}
                    onChange={(e) => setFormData({...formData, student_grade: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g., 5th Grade, 9th Grade"
                  />
                </div>

                <div>
                  <label htmlFor="program_interest" className="block text-sm font-medium text-gray-700">
                    Program Interest
                  </label>
                  <select
                    id="program_interest"
                    name="program_interest"
                    value={formData.program_interest}
                    onChange={(e) => setFormData({...formData, program_interest: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700">
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
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Emergency contact name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="emergency_phone" className="block text-sm font-medium text-gray-700">
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
                      className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Emergency phone number"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700">
                    Medical Conditions or Allergies (Optional)
                  </label>
                  <textarea
                    id="medical_conditions"
                    name="medical_conditions"
                    rows={3}
                    value={formData.medical_conditions}
                    onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Please list any medical conditions, allergies, or special needs we should be aware of..."
                  />
                </div>
              </div>
            </div>

            {message && (
              <div className={`text-center text-sm ${
                message.includes('successful') ? 'text-green-600' : 'text-red-600'
              }`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register for Program'}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              By registering, you agree to our program terms and conditions. 
              All information will be kept confidential and secure.
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
