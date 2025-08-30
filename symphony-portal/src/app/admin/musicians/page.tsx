'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase, type MusicianAuth } from '@/lib/supabase'
import { getImagePath } from '@/lib/imagePath'
import { User, Plus, Trash2, Eye, EyeOff, Mail } from 'lucide-react'

export default function AdminMusiciansPage() {
  const [musicians, setMusicians] = useState<MusicianAuth[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({})
  
  const [newMusician, setNewMusician] = useState({
    username: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    loadMusicians()
  }, [])

  const loadMusicians = async () => {
    try {
      const { data, error } = await supabase
        .from('musician_auth_simple')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading musicians:', error)
        setMessage('Error loading musicians: ' + error.message)
      } else {
        setMusicians(data || [])
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setMessage('Failed to load musicians')
    } finally {
      setLoading(false)
    }
  }

  const addMusician = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (!newMusician.username || !newMusician.email || !newMusician.password) {
        setMessage('Please fill in all fields')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('musician_auth_simple')
        .insert([{
          username: newMusician.username,
          email: newMusician.email,
          password: newMusician.password,
          is_active: true
        }])
        .select()

      if (error) {
        console.error('Error adding musician:', error)
        if (error.code === '23505') {
          setMessage('Username or email already exists')
        } else {
          setMessage('Error adding musician: ' + error.message)
        }
      } else {
        setMessage('Musician added successfully!')
        setNewMusician({ username: '', email: '', password: '' })
        setShowAddForm(false)
        loadMusicians()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setMessage('Failed to add musician')
    } finally {
      setLoading(false)
    }
  }

  const deleteMusician = async (id: string) => {
    if (!confirm('Are you sure you want to delete this musician?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('musician_auth_simple')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting musician:', error)
        setMessage('Error deleting musician: ' + error.message)
      } else {
        setMessage('Musician deleted successfully!')
        loadMusicians()
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setMessage('Failed to delete musician')
    }
  }

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Musician Management</h1>
          <p className="text-gray-600">Manage musician login credentials</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Musician</span>
          </button>
          <Link 
            href="/admin/invitations"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Manage Invitations</span>
          </Link>
        </div>

        {/* Add Musician Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border">
            <h2 className="text-xl font-semibold mb-4">Add New Musician</h2>
            <form onSubmit={addMusician} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    required
                    value={newMusician.username}
                    onChange={(e) => setNewMusician({...newMusician, username: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={newMusician.email}
                    onChange={(e) => setNewMusician({...newMusician, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="text"
                    required
                    value={newMusician.password}
                    onChange={(e) => setNewMusician({...newMusician, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter password"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Musician'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Musicians List */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Current Musicians</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : musicians.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No musicians found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {musicians.map((musician) => (
                    <tr key={musician.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {musician.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {musician.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono">
                            {showPasswords[musician.id!] ? musician.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(musician.id!)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords[musician.id!] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          musician.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {musician.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {musician.last_login 
                          ? new Date(musician.last_login).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteMusician(musician.id!)}
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Test Credentials */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Secure Test Credentials</h3>
          <p className="text-blue-800 mb-3">Use these secure credentials to test the login system (run update_secure_passwords.sql first):</p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">Conductor</div>
              <div className="text-gray-600">Username: conductor</div>
              <div className="text-gray-600 font-mono">Password: Gc#M5_Cond2024!</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">Concertmaster</div>
              <div className="text-gray-600">Username: concertmaster</div>
              <div className="text-gray-600 font-mono">Password: Cm$Master_9X7!</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">Musician</div>
              <div className="text-gray-600">Username: musician1</div>
              <div className="text-gray-600 font-mono">Password: Mus1c_P1ay3r#8</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium">Admin</div>
              <div className="text-gray-600">Username: admin</div>
              <div className="text-gray-600 font-mono">Password: Adm1n_S3cur3@24</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Run the SQL script <code>update_secure_passwords.sql</code> in Supabase to update to these secure passwords.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
