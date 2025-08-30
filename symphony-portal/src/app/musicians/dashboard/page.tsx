'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Music, Calendar, FileText, Users, Settings, LogOut, Bell, Clock } from 'lucide-react'

export default function MusicianDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  const upcomingRehearsals = [
    { id: 1, date: '2025-05-28', time: '7:00 PM', piece: 'Symphony No. 9 - Beethoven', location: 'Main Hall' },
    { id: 2, date: '2025-05-30', time: '7:00 PM', piece: 'The Four Seasons - Vivaldi', location: 'Main Hall' },
    { id: 3, date: '2025-06-02', time: '6:30 PM', piece: 'Dress Rehearsal - Full Program', location: 'Concert Hall' }
  ]

  const upcomingConcerts = [
    { id: 1, date: '2025-06-03', time: '8:00 PM', title: 'Spring Gala Concert', venue: 'Symphony Hall' },
    { id: 2, date: '2025-06-15', time: '7:30 PM', title: 'Chamber Music Evening', venue: 'Recital Hall' }
  ]

  const announcements = [
    { id: 1, date: '2025-05-25', title: 'New Music Distribution', content: 'Sheet music for June concerts now available in the music library.' },
    { id: 2, date: '2025-05-23', title: 'Parking Update', content: 'Please use the north parking lot for evening rehearsals.' },
    { id: 3, date: '2025-05-20', title: 'Guest Conductor', content: 'Maestro Johnson will be conducting our June 3rd performance.' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-4">Musician Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome back! Here's what's happening with the orchestra.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: Calendar },
                { id: 'schedule', name: 'Schedule', icon: Clock },
                { id: 'music', name: 'Music Library', icon: FileText },
                { id: 'members', name: 'Members', icon: Users },
                { id: 'settings', name: 'Settings', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upcoming Rehearsals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-6 w-6 text-blue-600 mr-2" />
                Upcoming Rehearsals
              </h3>
              <div className="space-y-4">
                {upcomingRehearsals.map((rehearsal) => (
                  <div key={rehearsal.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{rehearsal.piece}</h4>
                      <span className="text-sm text-gray-500">{rehearsal.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{rehearsal.time} • {rehearsal.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Concerts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Music className="h-6 w-6 text-blue-600 mr-2" />
                Upcoming Concerts
              </h3>
              <div className="space-y-4">
                {upcomingConcerts.map((concert) => (
                  <div key={concert.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{concert.title}</h4>
                      <span className="text-sm text-gray-500">{concert.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{concert.time} • {concert.venue}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Announcements */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Bell className="h-6 w-6 text-blue-600 mr-2" />
                Recent Announcements
              </h3>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                      <span className="text-sm text-gray-500">{announcement.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Full Schedule</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-blue-600 mb-3">This Week</h4>
                <div className="space-y-3">
                  {upcomingRehearsals.slice(0, 2).map((rehearsal) => (
                    <div key={rehearsal.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center border border-gray-100">
                      <div>
                        <h5 className="font-medium text-gray-900">{rehearsal.piece}</h5>
                        <p className="text-gray-600 text-sm">{rehearsal.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{rehearsal.date}</p>
                        <p className="text-gray-500 text-sm">{rehearsal.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-blue-600 mb-3">Upcoming Concerts</h4>
                <div className="space-y-3">
                  {upcomingConcerts.map((concert) => (
                    <div key={concert.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center border border-gray-100">
                      <div>
                        <h5 className="font-medium text-gray-900">{concert.title}</h5>
                        <p className="text-gray-600 text-sm">{concert.venue}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">{concert.date}</p>
                        <p className="text-gray-500 text-sm">{concert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'music' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Music Library</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Symphony No. 9', composer: 'Beethoven', status: 'Current' },
                { title: 'The Four Seasons', composer: 'Vivaldi', status: 'Upcoming' },
                { title: 'Moonlight Sonata', composer: 'Beethoven', status: 'Archive' },
                { title: 'Canon in D', composer: 'Pachelbel', status: 'Archive' },
                { title: 'Ave Maria', composer: 'Schubert', status: 'Archive' },
                { title: 'Brandenburg Concerto', composer: 'Bach', status: 'Upcoming' }
              ].map((piece, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-1">{piece.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{piece.composer}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    piece.status === 'Current' ? 'bg-green-100 text-green-800' :
                    piece.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {piece.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Orchestra Members</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Sarah Johnson', instrument: 'First Violin', section: 'Strings' },
                { name: 'Michael Chen', instrument: 'Cello', section: 'Strings' },
                { name: 'Emily Rodriguez', instrument: 'Flute', section: 'Woodwinds' },
                { name: 'David Thompson', instrument: 'French Horn', section: 'Brass' },
                { name: 'Lisa Park', instrument: 'Percussion', section: 'Percussion' },
                { name: 'James Wilson', instrument: 'Viola', section: 'Strings' }
              ].map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-gray-600 text-sm">{member.instrument}</p>
                  <p className="text-gray-500 text-xs">{member.section}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Profile Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="John Musician"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue="(555) 123-4567"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Instrument</label>
                    <input
                      type="text"
                      defaultValue="Violin"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Update Profile
                </button>
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Notification Preferences</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-3 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">Email notifications for rehearsal changes</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-3 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">SMS reminders for upcoming concerts</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-3 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">Weekly schedule digest</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
