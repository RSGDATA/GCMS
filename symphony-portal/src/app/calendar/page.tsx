'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react'
import { getNavigationPath } from '@/lib/navigationPath'
import { concertData, getConcertsForDate, getConcertRoute, type Concert } from '@/lib/concertData'

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
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchConcerts()
  }, [])

  const fetchConcerts = async () => {
    try {
      // Use centralized concert data
      setConcerts(concertData)
    } catch (error) {
      console.error('Error:', error)
      setConcerts([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewConcert = (concertId: string) => {
    // Use centralized routing logic
    const concertType = getConcertRoute(concertId)
    
    // Use navigation utility for consistent path handling across deployment environments
    const targetUrl = getNavigationPath(`/concerts/${concertType}`)
    
    // Use window.location for reliable navigation in static export
    window.location.href = targetUrl
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
                        <div key={event.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{event.description}</p>
                          
                          <div className="space-y-1 mb-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-blue-600" />
                              <span>{event.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                              <span>{event.venue}</span>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => handleViewConcert(event.id)}
                              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm transition-colors"
                            >
                              <CreditCard className="h-3 w-3" />
                              <span>Learn More</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : selectedDate ? (
                    <p className="text-gray-600">No events scheduled for this date.</p>
                  ) : (
                    <div className="text-center text-gray-600">
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 text-center mb-12">All Upcoming Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {concerts.slice(0, 6).map((concert) => (
              <div key={concert.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <Music className="h-16 w-16 text-white" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{concert.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{concert.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
                      <span className="text-sm">{formatDate(concert.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
                      <span className="text-sm truncate">{concert.venue}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleViewConcert(concert.id)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span>Learn More</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/concerts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
            >
              View All Concerts
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
