'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Music, Calendar, MapPin, Users, CreditCard, Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { getImagePath } from '@/lib/imagePath'
import { getNavigationPath } from '@/lib/navigationPath'

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
      // Use the new season's concerts - all concerts from calendar
      const newSeasonConcerts: Concert[] = [
        {
          id: 'NightAtTheMovies-oct',
          title: 'Night at the Movies',
          description: 'Experience the magic of cinema with the Greenville Pops Orchestra as blockbuster movies come to life.',
          date: '2025-10-03T14:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 35,
          available_seats: 500,
          image_url: null
        },
        {
          id: 'ashley-oct',
          title: 'The Melodies of Nature',
          description: 'Intimate performances showcasing technical brilliance and emotional depth',
          date: '2025-10-19T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 40,
          available_seats: 120,
          image_url: null
        },
        {
          id: 'eldred-nov',
          title: 'Eldred Concert',
          description: 'Experience the artistry of Eldred in an intimate concert setting with masterful interpretations.',
          date: '2025-11-08T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 35,
          available_seats: 100,
          image_url: null
        },
        {
          id: 'gpo-dec',
          title: 'All Star Christmas Concert',
          description: 'Holiday orchestral performance featuring festive classics and seasonal favorites.',
          date: '2025-12-07T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 50,
          available_seats: 250,
          image_url: null
        },
        {
          id: 'gcms-dec',
          title: 'Echoes And Elegance',
          description: 'Holiday concert featuring Giordi, Hamin, and Robert in festive chamber works.',
          date: '2025-12-20T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 40,
          available_seats: 120,
          image_url: null
        },
        {
          id: 'rhythms-of-belonging-jan',
          title: 'Rhythms of Belonging',
          description: 'A unique musical experience celebrating the rhythms that connect us all, featuring a blend of global and classical influences.',
          date: '2026-01-15T19:00:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 45,
          available_seats: 300,
          image_url: null
        },
        {
          id: 'retro-rewind-feb',
          title: 'Retro Rewind: The Ultimate Mixtape',
          description: 'A nostalgic journey through the greatest hits of the \'70s, \'80s, and \'90s with live performances.',
          date: '2026-02-06T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 50,
          available_seats: 400,
          image_url: null
        },
        {
          id: 'gpo-feb',
          title: 'GPO Concert',
          description: 'Winter orchestral performance featuring classical masterworks.',
          date: '2025-02-06T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 50,
          available_seats: 200,
          image_url: null
        },
        {
          id: 'songs-of-the-land-and-soul-feb',
          title: 'Songs of the Land and Soul',
          description: 'A journey through landscapes of spiritual depth and natural beauty.',
          date: '2026-02-21T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 45,
          available_seats: 200,
          image_url: null
        },
        {
          id: 'mt-vernon-feb',
          title: 'Mt. Vernon Concert',
          description: 'Special concert at Mt. Vernon featuring exceptional chamber music performances.',
          date: '2025-02-21T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 45,
          available_seats: 100,
          image_url: null
        },
        {
          id: 'winds-of-change-mar',
          title: 'Winds of Change',
          description: 'A transformative musical journey exploring themes of growth, renewal, and the power of change through dynamic chamber works.',
          date: '2026-03-14T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 50,
          available_seats: 250,
          image_url: null
        },
        {
          id: 'gcms-mar',
          title: 'GCMS Concert',
          description: 'Spring showcase featuring John, Amanda, and Ashley in collaborative performances.',
          date: '2025-03-22T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 40,
          available_seats: 150,
          image_url: null
        },
        {
          id: 'dhaka-standard-apr',
          title: 'Dhaka Standard Concert',
          description: 'International concert celebrating global musical traditions and cross-cultural collaboration.',
          date: '2025-04-25T19:30:00Z',
          venue: 'Greenville Municipal Auditorium',
          ticket_price: 50,
          available_seats: 180,
          image_url: null
        }
      ]
      setConcerts(newSeasonConcerts)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLearnMore = (concertId: string) => {
    // Determine the concert series based on the ID and redirect to concert page
    let concertType = 'NightAtTheMovies'
    if (concertId.includes('NightAtTheMovies')) {
      concertType = 'NightAtTheMovies'
    } else if (concertId.includes('gpo-dec')) {
      concertType = 'AllStarChristmasConcert'
    } else if (concertId.includes('gpo')) {
      concertType = 'NightAtTheMovies'
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
    } else if (concertId.includes('rhythms-of-belonging')) {
      concertType = 'RhythmOfBelonging'
    } else if (concertId.includes('retro-rewind')) {
      concertType = 'RetroRewind'
    } else if (concertId.includes('songs-of-the-land-and-soul')) {
      concertType = 'SongsOfTheLandAndTheSoul'
    } else if (concertId.includes('winds-of-change')) {
      concertType = 'WindsOfChange'
    }
    
    // Redirect to concert description page using navigation utility
    window.location.href = getNavigationPath(`/concerts/${concertType}`)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src={getImagePath("/GCMS_Logo.png")}
                alt="GCMS Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-bold text-gray-900">
                <span className="hidden sm:inline">Greenville Chamber Music Society</span>
                <span className="sm:hidden">GCMS</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Home
              </Link>
              <Link href="/calendar" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/calendar"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calendar
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/musicians/login"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Musicians
                </Link>
                <Link
                  href="/students/signup"
                  className="block px-3 py-2 bg-blue-600 text-white rounded-md font-medium"
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            Upcoming Concerts & Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the beauty of chamber music with our world-class artists. 
            Secure your tickets today for an unforgettable evening of musical excellence.
          </p>
        </div>
      </section>

      {/* Concerts Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4">Loading concerts...</p>
            </div>
          ) : concerts.length === 0 ? (
            <div className="text-center text-gray-900">
              <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Upcoming Concerts</h3>
              <p className="text-gray-600">Check back soon for our next performance schedule.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {concerts.map((concert) => (
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
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0 text-blue-600" />
                        <span className="text-sm">{concert.available_seats} seats available</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        ${concert.ticket_price}
                      </div>
                      <button
                        onClick={() => handleLearnMore(concert.id)}
                        disabled={concert.available_seats === 0}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        <Music className="h-4 w-4" />
                        <span>{concert.available_seats === 0 ? 'Sold Out' : 'Learn More'}</span>
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
                        onClick={() => handleLearnMore(concert.id)}
                        className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <Music className="h-4 w-4" />
                        <span>Learn More</span>
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
      <footer className="bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={getImagePath("/GCMS_Logo.png")}
                  alt="GCMS Logo" 
                  className="h-12 w-auto object-contain"
                />
                <span className="text-xl font-bold text-white">Greenville Chamber Music Society</span>
              </div>
              <p className="text-gray-400 mb-4">
                Bringing world-class chamber music to the Upstate since 1985.
              </p>
              <div className="text-gray-400">
                <p>Heritage Main Library</p>
                <p>25 Heritage Green Pl, Greenville, SC 29601</p>
                <p className="mt-2">(864) 467-3000</p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/concerts" className="text-gray-400 hover:text-white transition-colors">Concerts</Link></li>
                <li><Link href="/calendar" className="text-gray-400 hover:text-white transition-colors">Calendar</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/musicians/login" className="text-gray-400 hover:text-white transition-colors">Musicians</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Programs</h3>
              <ul className="space-y-2">
                <li><Link href="/students/signup" className="text-gray-400 hover:text-white transition-colors">Student Program</Link></li>
                <li><Link href="/concerts/piano-contest" className="text-gray-400 hover:text-white transition-colors">Piano Contest</Link></li>
                <li><Link href="/concerts/gcms" className="text-gray-400 hover:text-white transition-colors">GCMS Ensemble</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Greenville Chamber Music Society. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
