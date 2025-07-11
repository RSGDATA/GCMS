'use client'

import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft } from 'lucide-react'

export default function GPOPage() {
  const handlePurchaseTicket = () => {
    // Redirect to ticket purchase page
    window.location.href = 'https://tickets.example.com/gpo-concert'
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
                GPO Concert
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience the grandeur of orchestral music with the Greenville Philharmonic Orchestra in spectacular performances featuring classical masterworks.
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
                src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/london-symphony-orchestra-589180035-597b9cd003f40200109cd349.jpg`}
                alt="GPO Orchestra performing on stage"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">About GPO Concerts</h2>
          
          <div className="prose prose-lg text-gray-300 space-y-6">
            <p>
              The Greenville Philharmonic Orchestra (GPO) concerts represent the pinnacle of orchestral performance in our region. 
              These magnificent concerts feature full orchestral works by the greatest composers in classical music history, 
              performed by world-class musicians under the direction of renowned conductors.
            </p>
            
            <p>
              From Beethoven's powerful symphonies to Tchaikovsky's romantic masterpieces, GPO concerts offer audiences 
              the opportunity to experience the full emotional range and technical brilliance of orchestral music. 
              Each performance is carefully programmed to create a cohesive and inspiring musical journey.
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">What to Expect</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Full orchestral performances with 60+ professional musicians</li>
              <li>World-renowned guest conductors and soloists</li>
              <li>Classical masterworks and contemporary compositions</li>
              <li>Pre-concert lectures and program notes</li>
              <li>Premium concert hall acoustics and seating</li>
              <li>Special themed concerts throughout the season</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">This Season's GPO Concerts</h3>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold text-white mb-2">October Concert</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Opening night featuring classical favorites and seasonal selections
                </p>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>October 3, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Peace Center Concert Hall</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold text-white mb-2">Holiday Spectacular</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Festive holiday program with seasonal classics and audience favorites
                </p>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>December 7, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Peace Center Concert Hall</span>
                  </div>
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
              <div className="text-3xl font-bold text-amber-400 mb-2">$55</div>
              <p className="text-gray-300 text-sm">Standard seating</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-amber-500">
              <h3 className="text-xl font-semibold text-white mb-2">Premium Seating</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$75</div>
              <p className="text-gray-300 text-sm">Front rows with best acoustics</p>
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
