'use client'

import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft } from 'lucide-react'

export default function EldredPage() {
  const handlePurchaseTicket = () => {
    // Redirect to ticket purchase page
    window.location.href = 'https://tickets.example.com/eldred-concert'
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
                Eldred Concert
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience the artistry of Eldred in an intimate concert setting, featuring masterful interpretations of classical and contemporary repertoire.
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
                src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/chamber.png`}
                alt="Eldred performing in concert"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">About Eldred Concerts</h2>
          
          <div className="prose prose-lg text-gray-300 space-y-6">
            <p>
              Eldred concerts offer audiences a unique opportunity to experience classical music through the lens of 
              exceptional artistry and deep musical understanding. These performances showcase a commitment to both 
              traditional repertoire and innovative programming, creating memorable musical experiences that resonate 
              long after the final note.
            </p>
            
            <p>
              Each Eldred performance is characterized by meticulous attention to detail, expressive interpretation, 
              and a profound connection to the music. Whether presenting beloved classics or introducing audiences 
              to lesser-known gems, these concerts demonstrate the transformative power of live classical music 
              performance.
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Concert Features</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Expertly curated programs spanning multiple musical eras</li>
              <li>Intimate venue settings for optimal listening experience</li>
              <li>Educational program notes and pre-concert discussions</li>
              <li>Opportunities for audience interaction and Q&A</li>
              <li>Collaborative performances with guest musicians</li>
              <li>Focus on both technical excellence and emotional expression</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Upcoming Performance</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h4 className="text-xl font-semibold text-white mb-2">Fall Concert</h4>
              <p className="text-gray-300 text-sm mb-3">
                An evening of classical masterworks and contemporary interpretations
              </p>
              <div className="space-y-1 text-sm text-gray-300">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>November 8, 2025</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Heritage Main Library</span>
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
              <div className="text-3xl font-bold text-amber-400 mb-2">$35</div>
              <p className="text-gray-300 text-sm">Standard seating</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-amber-500">
              <h3 className="text-xl font-semibold text-white mb-2">Premium Seating</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$50</div>
              <p className="text-gray-300 text-sm">Front rows with best acoustics</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Student/Senior</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$20</div>
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
