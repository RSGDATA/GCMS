'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Music, Calendar, MapPin, Users, CreditCard } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getNavigationPath } from '@/lib/navigationPath'
import { concertData, getUpcomingConcerts, getConcertRoute, type Concert } from '@/lib/concertData'

export default function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConcerts()
  }, [])

  const fetchConcerts = async () => {
    try {
      // Use centralized concert data
      const upcomingConcerts = getUpcomingConcerts()
      setConcerts(upcomingConcerts)
    } catch (error) {
      console.error('Error:', error)
      // Fallback to all concerts if getUpcomingConcerts fails
      setConcerts(concertData)
    } finally {
      setLoading(false)
    }
  }

  const handleLearnMore = (concertId: string) => {
    // Use centralized routing logic
    const concertType = getConcertRoute(concertId)
    
    // Redirect to concert description page using navigation utility
    window.location.href = getNavigationPath(`/concerts/${concertType}`)
  }

  return (
    <div className="min-h-screen bg-white">

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
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => handleLearnMore(concert.id)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        <Music className="h-4 w-4" />
                        <span>Learn More</span>
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
                    </div>

                    <div className="flex justify-end">
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

    </div>
  )
}
