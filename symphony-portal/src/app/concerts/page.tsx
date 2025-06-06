'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Music, Calendar, MapPin, Users, CreditCard } from 'lucide-react'
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
              <Music className="h-8 w-8 text-amber-400" />
              <span className="text-xl font-bold text-white">Symphony Portal</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-amber-400 transition-colors">
                Home
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
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Upcoming Concerts
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {concerts.map((concert) => (
                <div key={concert.id} className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/15 transition-all duration-300">
                  {concert.image_url && (
                    <div className="h-48 bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                      <Music className="h-16 w-16 text-white" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{concert.title}</h3>
                    <p className="text-gray-300 mb-4 line-clamp-3">{concert.description}</p>
                    
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
                        disabled={concert.available_seats === 0}
                        className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black disabled:text-gray-400 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>{concert.available_seats === 0 ? 'Sold Out' : 'Buy Tickets'}</span>
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
