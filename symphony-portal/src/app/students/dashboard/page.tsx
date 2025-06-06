'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Music, Calendar, FileText, Users, Settings, LogOut, Bell, Clock, Download, Heart, Star, Award } from 'lucide-react'

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  const upcomingEvents = [
    { id: 1, date: '2025-05-30', time: '4:00 PM', title: 'Student Orchestra Practice', location: 'Music Room A', type: 'practice' },
    { id: 2, date: '2025-06-05', time: '6:00 PM', title: 'Spring Student Showcase', location: 'Main Auditorium', type: 'performance' },
    { id: 3, date: '2025-06-12', time: '4:30 PM', title: 'Music Theory Workshop', location: 'Classroom 2', type: 'workshop' },
    { id: 4, date: '2025-06-20', time: '7:00 PM', title: 'End of Year Concert', location: 'Symphony Hall', type: 'performance' }
  ]

  const newsletters = [
    { 
      id: 1, 
      title: 'June 2025 Newsletter', 
      date: '2025-05-25', 
      preview: 'Exciting updates about our upcoming student showcase and summer program opportunities...',
      downloadUrl: '#'
    },
    { 
      id: 2, 
      title: 'May 2025 Newsletter', 
      date: '2025-04-28', 
      preview: 'Student spotlight features, practice tips, and important dates for families...',
      downloadUrl: '#'
    },
    { 
      id: 3, 
      title: 'April 2025 Newsletter', 
      date: '2025-03-30', 
      preview: 'Spring concert preparations and new instrument rental information...',
      downloadUrl: '#'
    }
  ]

  const announcements = [
    { 
      id: 1, 
      date: '2025-05-26', 
      title: 'Instrument Maintenance Workshop', 
      content: 'Learn how to properly care for your instrument! Workshop this Saturday at 10 AM.',
      priority: 'high'
    },
    { 
      id: 2, 
      date: '2025-05-24', 
      title: 'Parent Volunteer Opportunities', 
      content: 'We need parent volunteers for our upcoming student showcase. Sign up at the front desk.',
      priority: 'medium'
    },
    { 
      id: 3, 
      date: '2025-05-22', 
      title: 'Summer Program Registration Open', 
      content: 'Registration for our summer music camp is now open! Limited spots available.',
      priority: 'high'
    }
  ]

  const studentProgress = {
    studentName: 'Emma Johnson',
    instrument: 'Violin',
    level: 'Intermediate',
    lessonsCompleted: 12,
    totalLessons: 16,
    nextLesson: '2025-05-28',
    achievements: ['First Recital', 'Music Theory Level 1', 'Perfect Attendance']
  }

  const upcomingConcerts = [
    { 
      id: 1, 
      date: '2025-06-03', 
      time: '8:00 PM', 
      title: 'Spring Gala Concert', 
      venue: 'Symphony Hall',
      description: 'Join us for an evening of classical masterpieces performed by our professional orchestra.',
      ticketInfo: 'Free for student families'
    },
    { 
      id: 2, 
      date: '2025-06-15', 
      time: '7:30 PM', 
      title: 'Chamber Music Evening', 
      venue: 'Recital Hall',
      description: 'Intimate chamber music performances featuring small ensembles.',
      ticketInfo: 'Free admission'
    }
  ]

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
            <div className="flex items-center space-x-4">
              <Bell className="h-6 w-6 text-gray-300 hover:text-amber-400 cursor-pointer" />
              <Link href="/students/signup" className="flex items-center space-x-2 text-gray-300 hover:text-amber-400">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Student Portal</h1>
          <p className="text-gray-300">Welcome to your music education journey! Here's everything you need to know.</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-600">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: Heart },
                { id: 'schedule', name: 'My Schedule', icon: Calendar },
                { id: 'concerts', name: 'Upcoming Concerts', icon: Music },
                { id: 'newsletters', name: 'Newsletters', icon: FileText },
                { id: 'progress', name: 'My Progress', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-amber-400 text-amber-400'
                        : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
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
            {/* Welcome Message */}
            <div className="lg:col-span-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg p-6 border border-amber-500/30">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="h-8 w-8 text-amber-400" />
                <h3 className="text-2xl font-semibold text-white">Welcome to the Student Outreach Program!</h3>
              </div>
              <p className="text-gray-200 mb-4">
                We're thrilled to have {studentProgress.studentName} as part of our music family. This portal is your central hub for 
                all program information, schedules, and resources.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-400">{studentProgress.lessonsCompleted}</div>
                  <div className="text-sm text-gray-300">Lessons Completed</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-400">{studentProgress.instrument}</div>
                  <div className="text-sm text-gray-300">Primary Instrument</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-amber-400">{studentProgress.level}</div>
                  <div className="text-sm text-gray-300">Current Level</div>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Calendar className="h-6 w-6 text-amber-400 mr-2" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{event.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        event.type === 'performance' ? 'bg-amber-900 text-amber-300' :
                        event.type === 'practice' ? 'bg-blue-900 text-blue-300' :
                        'bg-green-900 text-green-300'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{event.date} • {event.time}</p>
                    <p className="text-gray-400 text-xs">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Bell className="h-6 w-6 text-amber-400 mr-2" />
                Important Announcements
              </h3>
              <div className="space-y-4">
                {announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement.id} className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-white">{announcement.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        announcement.priority === 'high' ? 'bg-red-900 text-red-300' : 'bg-yellow-900 text-yellow-300'
                      }`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm mb-1">{announcement.content}</p>
                    <p className="text-gray-400 text-xs">{announcement.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">My Schedule</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-amber-400 mb-3">This Week</h4>
                <div className="space-y-3">
                  {upcomingEvents.filter(event => event.date <= '2025-06-01').map((event) => (
                    <div key={event.id} className="bg-slate-800/50 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-white">{event.title}</h5>
                        <p className="text-gray-300 text-sm">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{event.date}</p>
                        <p className="text-gray-400 text-sm">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-amber-400 mb-3">Upcoming Events</h4>
                <div className="space-y-3">
                  {upcomingEvents.filter(event => event.date > '2025-06-01').map((event) => (
                    <div key={event.id} className="bg-slate-800/50 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h5 className="font-medium text-white">{event.title}</h5>
                        <p className="text-gray-300 text-sm">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">{event.date}</p>
                        <p className="text-gray-400 text-sm">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'concerts' && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Professional Orchestra Concerts</h3>
              <p className="text-gray-300 mb-6">
                As part of our student program, your family receives complimentary tickets to all professional orchestra performances. 
                These concerts are excellent learning opportunities to hear the music you're studying performed at the highest level.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingConcerts.map((concert) => (
                  <div key={concert.id} className="bg-slate-800/50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-medium text-white">{concert.title}</h4>
                      <span className="text-sm text-gray-400">{concert.date}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{concert.description}</p>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-400">📅 {concert.date} at {concert.time}</p>
                      <p className="text-gray-400">📍 {concert.venue}</p>
                      <p className="text-amber-400 font-medium">🎫 {concert.ticketInfo}</p>
                    </div>
                    <button className="mt-4 bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-md transition-colors w-full">
                      Reserve Family Tickets
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'newsletters' && (
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-6">Monthly Newsletters</h3>
            <p className="text-gray-300 mb-6">
              Stay informed with our monthly newsletters featuring student spotlights, upcoming events, practice tips, and important program updates.
            </p>
            <div className="space-y-4">
              {newsletters.map((newsletter) => (
                <div key={newsletter.id} className="bg-slate-800/50 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-2">{newsletter.title}</h4>
                      <p className="text-gray-300 text-sm">{newsletter.preview}</p>
                    </div>
                    <span className="text-sm text-gray-400">{newsletter.date}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400">PDF Download Available</span>
                    <button className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black font-medium py-2 px-4 rounded-md transition-colors">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-6">Student Progress Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Current Status</h4>
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Lessons Progress</span>
                        <span className="text-amber-400">{studentProgress.lessonsCompleted}/{studentProgress.totalLessons}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-amber-400 h-2 rounded-full" 
                          style={{ width: `${(studentProgress.lessonsCompleted / studentProgress.totalLessons) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h5 className="text-white font-medium mb-2">Next Lesson</h5>
                      <p className="text-gray-300">{studentProgress.nextLesson}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Achievements</h4>
                  <div className="space-y-3">
                    {studentProgress.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-3 bg-slate-800/50 rounded-lg p-3">
                        <Star className="h-5 w-5 text-amber-400" />
                        <span className="text-gray-300">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-4">Practice Tips</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="text-amber-400 font-medium mb-2">Daily Practice</h5>
                  <p className="text-gray-300 text-sm">Aim for 20-30 minutes of focused practice each day. Consistency is more important than duration.</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="text-amber-400 font-medium mb-2">Warm-Up Routine</h5>
                  <p className="text-gray-300 text-sm">Always start with scales and simple exercises to prepare your fingers and mind for practice.</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="text-amber-400 font-medium mb-2">Slow Practice</h5>
                  <p className="text-gray-300 text-sm">Practice slowly and accurately first. Speed will come naturally with proper technique.</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <h5 className="text-amber-400 font-medium mb-2">Record Yourself</h5>
                  <p className="text-gray-300 text-sm">Recording your practice helps you hear mistakes and track your improvement over time.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
