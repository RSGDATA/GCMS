'use client'

import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft, Globe } from 'lucide-react'

export default function DhakaStandardPage() {
  const handlePurchaseTicket = () => {
    // Redirect to ticket purchase page
    window.location.href = 'https://tickets.example.com/dhaka-standard-concert'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-amber-400" />
              <span className="text-xl font-bold text-white">Greenville Chamber Music Society</span>
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-white hover:text-amber-400 transition-colors">
                Home
              </Link>
              <Link href="/concerts" className="text-white hover:text-amber-400 transition-colors">
                Concerts
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
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/"
          className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Dhaka Standard Concert
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience a unique fusion of classical traditions and international influences with the Dhaka Standard concert series, celebrating global musical heritage.
              </p>
              <button
                onClick={handlePurchaseTicket}
                className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <CreditCard className="h-5 w-5" />
                <span>Purchase Tickets</span>
              </button>
            </div>
            <div className="relative">
              <img
                src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/soloist.jpg`}
                alt="Dhaka Standard concert performance"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">About Dhaka Standard Concerts</h2>
          
          <div className="prose prose-lg text-gray-300 space-y-6">
            <p>
              The Dhaka Standard concert series represents a groundbreaking approach to classical music, blending 
              traditional Western classical repertoire with influences from South Asian musical traditions. These 
              performances celebrate the universal language of music while honoring diverse cultural heritage.
            </p>
            
            <p>
              Each Dhaka Standard concert features carefully selected works that demonstrate the interconnectedness 
              of global musical traditions. From classical masterpieces to contemporary compositions that bridge 
              cultural divides, these performances offer audiences a unique perspective on the evolution and 
              universality of musical expression.
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Concert Highlights</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Fusion of Western classical and South Asian musical traditions</li>
              <li>International guest artists and cultural ambassadors</li>
              <li>Educational components exploring global musical heritage</li>
              <li>Contemporary compositions celebrating cultural diversity</li>
              <li>Interactive elements showcasing different musical instruments</li>
              <li>Post-concert discussions on cross-cultural musical influences</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Upcoming Performance</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-xl font-semibold text-white mb-2">Spring International Concert</h4>
              <p className="text-gray-300 text-sm mb-3">
                A celebration of global musical traditions and cross-cultural collaboration
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>April 25, 2025</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Greenville Concert Hall</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>International Cultural Exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticket Information */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Ticket Information</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">General Admission</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$50</div>
              <p className="text-gray-300 text-sm">Standard seating</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-amber-500">
              <h3 className="text-xl font-semibold text-white mb-2">Premium Experience</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$75</div>
              <p className="text-gray-300 text-sm">Includes pre-concert reception</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Student/Senior</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$35</div>
              <p className="text-gray-300 text-sm">With valid ID</p>
            </div>
          </div>

          <button
            onClick={handlePurchaseTicket}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-4 px-12 rounded-lg transition-colors inline-flex items-center space-x-2 text-lg"
          >
            <CreditCard className="h-6 w-6" />
            <span>Purchase Tickets Now</span>
          </button>
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
