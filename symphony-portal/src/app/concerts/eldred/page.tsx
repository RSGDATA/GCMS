'use client'

import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft } from 'lucide-react'

export default function EldredPage() {
  const handlePurchaseTicket = () => {
    // Redirect to ticket purchase page
    window.location.href = 'https://tickets.example.com/eldred-concert'
  }

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
              <Link href="/concerts" className="text-blue-600 font-medium uppercase text-sm tracking-wide">
                Concerts
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
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link 
          href="/concerts"
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Concerts
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
                Eldred <span className="font-bold">Concert</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience the artistry of Eldred in an intimate concert setting, featuring masterful interpretations of classical and contemporary repertoire.
              </p>
              <a
                href="https://tickets.example.com/eldred-concert"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-md transition-colors inline-flex items-center space-x-2 text-lg"
              >
                <CreditCard className="h-5 w-5" />
                <span>Purchase Tickets</span>
              </a>
            </div>
            <div className="relative">
              <img
                src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/chamber.png`}
                alt="Eldred performing in concert"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-8">About Eldred Concerts</h2>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p className="text-lg leading-relaxed">
              Eldred concerts offer audiences a unique opportunity to experience classical music through the lens of 
              exceptional artistry and deep musical understanding. These performances showcase a commitment to both 
              traditional repertoire and innovative programming, creating memorable musical experiences that resonate 
              long after the final note.
            </p>
            
            <p className="text-lg leading-relaxed">
              Each Eldred performance is characterized by meticulous attention to detail, expressive interpretation, 
              and a profound connection to the music. Whether presenting beloved classics or introducing audiences 
              to lesser-known gems, these concerts demonstrate the transformative power of live classical music 
              performance.
            </p>

            <h3 className="text-2xl font-light text-gray-900 mt-12 mb-6">What to Expect</h3>
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-600">
              <li>Expertly curated programs spanning multiple musical eras</li>
              <li>Intimate venue settings for optimal listening experience</li>
              <li>Educational program notes and pre-concert discussions</li>
              <li>Opportunities for audience interaction and Q&A</li>
              <li>Collaborative performances with guest musicians</li>
              <li>Focus on both technical excellence and emotional expression</li>
            </ul>
          </div>
        </div>
      </section>

      {/* This Season's Concerts */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">This Season's Eldred Concerts</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Fall Concert</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                An evening of classical masterworks and contemporary interpretations showcasing exceptional artistry.
              </p>
              <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>November 8, 2025 at 7:30 PM</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Heritage Main Library</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <span>100 seats available</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">$35</div>
              <a
                href="https://tickets.example.com/eldred-fall"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Buy Tickets</span>
              </a>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Spring Recital</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                A special spring performance featuring beloved classical favorites and innovative contemporary works.
              </p>
              <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>April 12, 2026 at 7:30 PM</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Heritage Main Library</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <span>100 seats available</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">$35</div>
              <a
                href="https://tickets.example.com/eldred-spring"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Buy Tickets</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Music className="h-8 w-8 text-blue-400" />
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
