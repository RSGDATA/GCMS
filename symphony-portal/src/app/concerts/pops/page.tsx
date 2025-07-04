'use client'

import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft } from 'lucide-react'

export default function PopsPage() {
  const handlePurchaseTicket = () => {
    // Redirect to ticket purchase page
    window.location.href = 'https://tickets.example.com/pops-concert'
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
                Pops Concert
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Popular classics and contemporary favorites in a relaxed, family-friendly atmosphere that brings classical music to everyone.
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
          src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/pops.png`}
          alt="Pops concert with colorful lighting"
          className="w-full h-96 object-cover"
        />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">About Our Pops Concert Series</h2>
          
          <div className="prose prose-lg text-gray-300 space-y-6">
            <p>
              Our Pops Concert Series breaks down the barriers between classical and popular music, creating an 
              accessible and enjoyable experience for audiences of all ages and musical backgrounds. These concerts 
              feature beloved classical pieces alongside movie themes, Broadway hits, and contemporary arrangements 
              that showcase the versatility and relevance of orchestral music.
            </p>
            
            <p>
              From John Williams&apos; iconic film scores to arrangements of popular songs, our pops concerts prove 
              that classical music can be both sophisticated and fun. We create a relaxed atmosphere where families 
              can enjoy music together, often featuring interactive elements and opportunities for audience participation.
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">What Makes Our Pops Concerts Special</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Family-friendly programming suitable for all ages</li>
              <li>Mix of classical favorites and popular music arrangements</li>
              <li>Interactive elements and audience participation</li>
              <li>Relaxed atmosphere with optional pre-concert activities</li>
              <li>Educational components that make classical music accessible</li>
              <li>Special themed concerts throughout the year</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">This Season&apos;s Pops Highlights</h3>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold text-white mb-2">Movie Magic Night</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Iconic film scores from Star Wars, Harry Potter, and more
                </p>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>March 8, 2025 at 7:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Falls Park Amphitheater</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold text-white mb-2">Broadway Favorites</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Songs from Hamilton, Phantom of the Opera, and Les Misérables
                </p>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>May 17, 2025 at 7:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Greenville Concert Hall</span>
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
              <div className="text-3xl font-bold text-amber-400 mb-2">$25</div>
              <p className="text-gray-300 text-sm">Standard seating</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-amber-500">
              <h3 className="text-xl font-semibold text-white mb-2">Family Pack</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$80</div>
              <p className="text-gray-300 text-sm">4 tickets (2 adults + 2 children)</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Children Under 12</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$10</div>
              <p className="text-gray-300 text-sm">With adult ticket purchase</p>
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
