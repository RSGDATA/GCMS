'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Music, Calendar, MapPin, Clock, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react'
// import { supabase } from '@/lib/supabase'
// import { formatDate } from '@/lib/utils'

interface Concert {
  id: string
  title: string
  description: string
  date: string
  venue: string
  ticket_price: number
  available_seats: number
  image_url: string | null
}

interface CalendarEvent {
  id: string
  title: string
  description: string
  date: Date
  venue: string
  ticket_price: number
  available_seats: number
}

export default function CalendarPage() {
  const router = useRouter()
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchConcerts()
  }, [])

  const fetchConcerts = async () => {
    try {
      // Use sample data for now
      setSampleConcerts()
    } catch (error) {
      console.error('Error:', error)
      setSampleConcerts()
    } finally {
      setLoading(false)
    }
  }

  const setSampleConcerts = () => {
    const sampleConcerts: Concert[] = [
      {
        id: 'gpo-oct',
        title: 'GPO Concert',
        description: 'Experience the grandeur of orchestral performances with the Greenville Philharmonic Orchestra.',
        date: '2025-10-03T19:30:00Z',
        venue: 'Heritage Main Library',
        ticket_price: 50,
        available_seats: 200,
        image_url: null
      },
      {
        id: 'piano-contest-oct',
        title: 'Piano Contest',
        description: 'Witness the next generation of piano virtuosos compete in our prestigious annual competition.',
        date: '2025-10-18T19:00:00Z',
        venue: 'Heritage Main Library',
        ticket_price: 15,
        available_seats: 150,
        image_url: null
      },
      {
        id: 'ashley-oct',
        title: 'Ashley Concert',
        description: 'Intimate performances showcasing technical brilliance and emotional depth in classical repertoire.',
        date: '2025-10-19T19:30:00Z',
        venue: 'Heritage Main Library',
        ticket_price: 40,
        available_seats: 120,
        image_url: null
      },
      {
        id: 'eldred-nov',
        title: 'Eldred Concert',
        description: 'Experience the artistry of Eldred in an intimate concert setting with masterful interpretations.',
        date: '2025-11-08T19:30:00Z',
        venue: 'Heritage Main Library',
        ticket_price: 35,
        available_seats: 100,
        image_url: null
      },
      {
        id: 'gpo-dec',
        title: 'GPO Concert',
        description: 'Holiday orchestral performance featuring festive classics and seasonal favorites.',
        date: '2025-12-07T19:30:00Z',
        venue: 'Greenville Concert Hall',
        ticket_price: 50,
        available_seats: 250,
        image_url: null
      },
      {
        id: 'ashley-dec',
        title: 'Ashley Concert',
        description: 'Holiday performance featuring seasonal classics and beloved favorites.',
        date: '2025-12-13T19:30:00Z',
        venue: 'Greenville Concert Hall',
        ticket_price: 40,
        available_seats: 150,
        image_url: null
      },
      {
        id: 'gcms-dec',
        title: 'GCMS Concert',
        description: 'Holiday concert featuring Giordi, Hamin, and Robert in festive chamber works.',
        date: '2025-12-20T19:30:00Z',
        venue: 'Heritage Main Library',
        ticket_price: 40,
        available_seats: 120,
        image_url: null
      },
      {
        id: 'gpo-feb',
        title: 'GPO Concert',
        description: 'Winter orchestral performance featuring classical masterworks.',
        date: '2025-02-06T19:30:00Z',
        venue: 'Greenville Concert Hall',
        ticket_price: 50,
        available_seats: 200,
        image_url: null
      },
      {
        id: 'mt-vernon-feb',
        title: 'Mt. Vernon Concert',
        description: 'Special concert at Mt. Vernon featuring exceptional chamber music performances.',
        date: '2025-02-21T19:30:00Z',
        venue: 'Mt. Vernon Historic Hall',
        ticket_price: 45,
        available_seats: 100,
        image_url: null
      },
      {
        id: 'gcms-mar',
        title: 'GCMS Concert',
        description: 'Spring showcase featuring John, Amanda, and Ashley in collaborative performances.',
        date: '2025-03-22T19:30:00Z',
        venue: 'Greenville Concert Hall',
        ticket_price: 40,
        available_seats: 150,
        image_url: null
      },
      {
        id: 'ashley-apr',
        title: 'Ashley Concert',
        description: 'Spring recital featuring classical favorites and contemporary works.',
        date: '2025-04-17T19:30:00Z',
        venue: 'Heritage Main Library',
        ticket_price: 40,
        available_seats: 120,
        image_url: null
      },
      {
        id: 'piano-contest-apr',
        title: 'Piano Contest',
        description: 'Spring piano competition featuring advanced young pianists.',
        date: '2025-04-18T19:00:00Z',
        venue: 'Greenville Concert Hall',
        ticket_price: 15,
        available_seats: 200,
        image_url: null
      },
      {
        id: 'dhaka-standard-apr',
        title: 'Dhaka Standard Concert',
        description: 'International concert celebrating global musical traditions and cross-cultural collaboration.',
        date: '2025-04-25T19:30:00Z',
        venue: 'Greenville Concert Hall',
        ticket_price: 50,
        available_seats: 180,
        image_url: null
      }
    ]
    setConcerts(sampleConcerts)
  }

  const handleViewConcert = (concertId: string) => {
    console.log('Navigating to concert:', concertId)
    
    // Determine the concert series based on the ID
    let concertType: string | null = null
    
    if (concertId.includes('gpo')) {
      concertType = 'gpo'
    } else if (concertId.includes('piano-contest')) {
      concertType = 'piano-contest'
    } else if (concertId.includes('ashley')) {
      concertType = 'ashley'
    } else if (concertId.includes('eldred')) {
      concertType = 'eldred'
    } else if (concertId.includes('gcms')) {
      concertType = 'gcms'
    } else if (concertId.includes('mt-vernon')) {
      concertType = 'mt-vernon'
    } else if (concertId.includes('dhaka-standard')) {
      concertType = 'dhaka-standard'
    }
    
    // If no match found, log error and fallback to gpo
    if (!concertType) {
      console.error('Unknown concert ID:', concertId)
      concertType = 'gpo'
    }
    
    console.log('Resolved concert type:', concertType)
    
    // Get the base path for production (GitHub Pages)
    const basePath = process.env.NODE_ENV === 'production' ? '/GCMS' : ''
    const targetUrl = `${basePath}/concerts/${concertType}/`
    
    console.log('Target URL:', targetUrl)
    
    // Use Next.js router for navigation
    try {
      router.push(`/concerts/${concertType}/`)
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback to window.location with proper base path
      window.location.href = targetUrl
    }
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return concerts
      .filter(concert => {
        const concertDate = new Date(concert.date)
        return concertDate.toDateString() === date.toDateString()
      })
      .map(concert => ({
        ...concert,
        date: new Date(concert.date)
      }))
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Add day headers
    const dayHeaders = dayNames.map(day => (
      <div key={day} className="p-2 text-center text-sm font-semibold text-gray-300">
        {day}
      </div>
    ))

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-2 h-24 border border-gray-700"></div>
      )
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const events = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()
      const hasEvents = events.length > 0

      days.push(
        <div
          key={day}
          className={`p-2 h-24 border border-gray-700 cursor-pointer hover:bg-white/5 transition-colors ${
            isToday ? 'bg-amber-500/20 border-amber-500' : ''
          } ${hasEvents ? 'bg-blue-500/10' : ''}`}
          onClick={() => setSelectedDate(hasEvents ? date : null)}
        >
          <div className={`text-sm font-semibold ${isToday ? 'text-amber-400' : 'text-white'}`}>
            {day}
          </div>
          {hasEvents && (
            <div className="mt-1">
              {events.slice(0, 2).map((event, index) => (
                <div
                  key={event.id}
                  className="text-xs bg-amber-500/80 text-black px-1 py-0.5 rounded mb-1 truncate"
                >
                  {event.title}
                </div>
              ))}
              {events.length > 2 && (
                <div className="text-xs text-amber-400">
                  +{events.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="grid grid-cols-7">
          {dayHeaders}
          {days}
        </div>
      </div>
    )
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <Music className="h-8 w-8 text-blue-600" />
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
              <Link href="/calendar" className="text-blue-600 font-medium uppercase text-sm tracking-wide">
                Calendar
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                About
              </Link>
              <Link href="/musicians/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Musicians
              </Link>
              <Link href="/students/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm">
                Student Program
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            Concert Calendar
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            View all upcoming concerts and events in our interactive calendar. 
            Click on any date with events to see details and purchase tickets.
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4">Loading calendar...</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Calendar */}
              <div className="lg:col-span-2">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm border border-gray-200"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors shadow-sm border border-gray-200"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                {renderCalendar()}

                {/* Legend */}
                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded"></div>
                    <span>Today</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-50 border border-gray-300 rounded"></div>
                    <span>Has Events</span>
                  </div>
                </div>
              </div>

              {/* Event Details Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 sticky top-4 shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {selectedDate 
                      ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                      : 'Select a date with events'
                    }
                  </h3>

                  {selectedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedEvents.map((event) => (
                        <div key={event.id} className="bg-white/5 rounded-lg p-4">
                          <h4 className="font-semibold text-white mb-2">{event.title}</h4>
                          <p className="text-gray-300 text-sm mb-3 line-clamp-3">{event.description}</p>
                          
                          <div className="space-y-1 mb-4 text-sm text-gray-300">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>{event.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{event.venue}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-amber-400">
                              ${event.ticket_price}
                            </div>
                            <button
                              onClick={() => handleViewConcert(event.id)}
                              disabled={event.available_seats === 0}
                              className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-semibold py-1 px-3 rounded text-sm transition-colors"
                            >
                              <CreditCard className="h-3 w-3" />
                              <span>{event.available_seats === 0 ? 'Sold Out' : 'Learn More'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedDate ? (
                    <p className="text-gray-400">No events scheduled for this date.</p>
                  ) : (
                    <div className="text-center text-gray-400">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Click on a date with events to view details and purchase tickets.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events List */}
      <section className="py-12 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">All Upcoming Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerts.slice(0, 6).map((concert) => (
              <div key={concert.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all duration-300">
                <h3 className="text-lg font-bold text-white mb-2">{concert.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{concert.description}</p>
                
                <div className="space-y-2 mb-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(concert.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{concert.venue}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-amber-400">
                    ${concert.ticket_price}
                  </div>
                  <button
                    onClick={() => handleViewConcert(concert.id)}
                    disabled={concert.available_seats === 0}
                    className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-semibold py-2 px-3 rounded text-sm transition-colors"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>{concert.available_seats === 0 ? 'Sold Out' : 'Learn More'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/concerts"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View All Concerts
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-6 w-6 text-amber-400" />
            <span className="text-lg font-semibold text-white">Greenville Chamber Music Society</span>
          </div>
          <p className="text-gray-400">
            © 2024 Greenville Chamber Music Society. Bringing classical music to our community.
          </p>
        </div>
      </footer>
    </div>
  )
}
