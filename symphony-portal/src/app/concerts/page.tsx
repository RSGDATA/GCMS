'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Music, Calendar, MapPin, Users, CreditCard, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

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

export default function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchConcerts()
  }, [])

  const fetchConcerts = async () => {
    try {
      const { data, error } = await supabase
        .from('concerts')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })

      if (error) {
        console.error('Error fetching concerts:', error)
      } else {
        setConcerts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchaseTicket = (concertId: string) => {
    // Redirect to ticket purchase page
    window.location.href = `/concerts/${concertId}/purchase`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
              <span className="text-lg sm:text-xl font-bold text-white truncate">
                <span className="hidden sm:inline">Greenville Chamber Music Society</span>
                <span className="sm:hidden">GCMS</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-amber-400 transition-colors">
                Home
              </Link>
              <Link href="/calendar" className="text-white hover:text-amber-400 transition-colors">
                Calendar
              </Link>
              <Link href="/about" className="text-white hover:text-amber-400 transition-colors">
                About
              </Link>
              <Link href="/musicians/login" className="text-white hover:text-amber-400 transition-colors">
                Musicians
              </Link>
              <Link href="/students/signup" className="text-white hover:text-amber-400 transition-colors">
                Student Program
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-amber-400 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-sm border-t border-white/10">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/calendar"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calendar
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/musicians/login"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Musicians
                </Link>
                <Link
                  href="/students/signup"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Student Program
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            Upcoming Concerts
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the beauty of classical music with our world-class orchestra. 
            Secure your tickets today for an unforgettable evening.
          </p>
        </div>
      </section>

      {/* Concerts Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
              <p className="mt-4">Loading concerts...</p>
            </div>
          ) : concerts.length === 0 ? (
            <div className="text-center text-white">
              <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Upcoming Concerts</h3>
              <p className="text-gray-400">Check back soon for our next performance schedule.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {concerts.map((concert) => (
                <div key={concert.id} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/15 transition-all duration-300">
                  {concert.image_url && (
                    <div className="h-40 sm:h-48 bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                      <Music className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                    </div>
                  )}
                  
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{concert.title}</h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">{concert.description}</p>
                    
                    <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{formatDate(concert.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                        <span className="text-xs sm:text-sm truncate">{concert.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{concert.available_seats} seats available</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <div className="text-xl sm:text-2xl font-bold text-amber-400">
                        ${concert.ticket_price}
                      </div>
                      <button
                        onClick={() => handlePurchaseTicket(concert.id)}
                        disabled={concert.available_seats === 0}
                        className="flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-semibold py-2 px-4 rounded-lg transition-colors touch-manipulation w-full sm:w-auto"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm sm:text-base">{concert.available_seats === 0 ? 'Sold Out' : 'Buy Tickets'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sample Concerts for Demo */}
      {concerts.length === 0 && !loading && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Sample Concert Listings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  id: 'sample-1',
                  title: 'Beethoven\'s Symphony No. 9',
                  description: 'Experience the power and beauty of Beethoven\'s final symphony, featuring the famous "Ode to Joy" with full orchestra and choir.',
                  date: '2024-12-15T19:30:00Z',
                  venue: 'Symphony Hall',
                  ticket_price: 75,
                  available_seats: 150
                },
                {
                  id: 'sample-2',
                  title: 'Mozart Masterpieces',
                  description: 'An evening dedicated to Wolfgang Amadeus Mozart featuring Piano Concerto No. 21 and Symphony No. 40.',
                  date: '2024-12-22T20:00:00Z',
                  venue: 'Grand Opera House',
                  ticket_price: 65,
                  available_seats: 200
                },
                {
                  id: 'sample-3',
                  title: 'Holiday Spectacular',
                  description: 'Celebrate the season with beloved holiday classics and traditional carols performed by our full orchestra.',
                  date: '2024-12-24T18:00:00Z',
                  venue: 'City Concert Hall',
                  ticket_price: 55,
                  available_seats: 300
                }
              ].map((concert) => (
                <div key={concert.id} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/15 transition-all duration-300">
                  <div className="h-48 bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                    <Music className="h-16 w-16 text-white" />
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{concert.title}</h3>
                    <p className="text-gray-300 mb-4">{concert.description}</p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-gray-300">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{formatDate(concert.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{concert.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{concert.available_seats} seats available</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-amber-400">
                        ${concert.ticket_price}
                      </div>
                      <button
                        onClick={() => handlePurchaseTicket(concert.id)}
                        className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Buy Tickets</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black/40 py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-6 w-6 text-amber-400" />
            <span className="text-lg font-semibold text-white">Symphony Portal</span>
          </div>
          <p className="text-gray-400">
            © 2024 Symphony Portal. Bringing classical music to our community.
          </p>
        </div>
      </footer>
    </div>
  )
}
