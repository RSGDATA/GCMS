'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Music, Calendar, FileText, LogOut, Bell, Heart, Star, Award } from 'lucide-react'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Student Portal</h1>
          <p className="text-gray-600 text-lg">Welcome to your music education journey!</p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome, Emma!</h2>
          </div>
          <p className="text-gray-600 mb-4">
            You're enrolled in our Student Outreach Program. Here's your musical journey with us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Music className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Instrument</span>
              </div>
              <p className="text-lg font-bold text-blue-600 mt-1">Violin</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Level</span>
              </div>
              <p className="text-lg font-bold text-green-600 mt-1">Intermediate</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-gray-900">Lessons</span>
              </div>
              <p className="text-lg font-bold text-purple-600 mt-1">12 / 16</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Student Orchestra Practice</h4>
                <p className="text-sm text-gray-600">Music Room A</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-600">May 30, 4:00 PM</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Practice
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Spring Student Showcase</h4>
                <p className="text-sm text-gray-600">Main Auditorium</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">June 5, 6:00 PM</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Performance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Important Announcements</h3>
          <div className="space-y-4">
            <div className="border-l-4 border-red-400 bg-red-50 p-4">
              <h4 className="text-sm font-medium text-red-800">Instrument Maintenance Workshop</h4>
              <p className="text-sm text-red-700 mt-1">Learn how to properly care for your instrument! Workshop this Saturday at 10 AM.</p>
              <p className="text-xs text-red-600 mt-2">May 26, 2025</p>
            </div>
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
              <h4 className="text-sm font-medium text-yellow-800">Summer Program Registration Open</h4>
              <p className="text-sm text-yellow-700 mt-1">Registration for our summer music camp is now open! Limited spots available.</p>
              <p className="text-xs text-yellow-600 mt-2">May 22, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
