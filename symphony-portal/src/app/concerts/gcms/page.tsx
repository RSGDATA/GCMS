'use client'

import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft, Users } from 'lucide-react'

export default function GCMSPage() {
  const handlePurchaseTicket = () => {
    // Redirect to ticket purchase page
    window.location.href = 'https://tickets.example.com/gcms-concert'
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
                GCMS Concert
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience the Greenville Chamber Music Society's signature performances featuring our talented resident musicians and special guest artists in intimate chamber music settings.
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
                alt="GCMS ensemble performing"
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">About GCMS Concerts</h2>
          
          <div className="prose prose-lg text-gray-300 space-y-6">
            <p>
              GCMS concerts showcase the very best of our chamber music society, featuring performances by our 
              resident musicians alongside distinguished guest artists. These concerts represent the heart of our 
              organization's mission to bring exceptional chamber music to the Greenville community.
            </p>
            
            <p>
              Each GCMS concert is carefully programmed to highlight the unique strengths of our ensemble members 
              while exploring diverse repertoire from baroque masterpieces to contemporary works. These performances 
              demonstrate the collaborative spirit and artistic excellence that define the Greenville Chamber Music Society.
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">Featured Artists</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Giordi - Renowned for expressive interpretations and technical mastery</li>
              <li>Hamin - Celebrated chamber musician with international experience</li>
              <li>Robert - Versatile performer specializing in both classical and contemporary works</li>
              <li>John - Accomplished musician with extensive solo and ensemble experience</li>
              <li>Amanda - Dynamic performer known for engaging stage presence</li>
              <li>Ashley - Talented artist bringing fresh perspectives to classical repertoire</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4">This Season's GCMS Concerts</h3>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold text-white mb-2">Holiday Concert</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Featuring Giordi, Hamin, and Robert in festive chamber works
                </p>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>December 20, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Heritage Main Library</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Giordi, Hamin, Robert</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h4 className="text-xl font-semibold text-white mb-2">Spring Showcase</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Collaborative performance featuring John, Amanda, and Ashley
                </p>
                <div className="space-y-1 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>March 22, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Greenville Concert Hall</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>John, Amanda, Ashley</span>
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
              <div className="text-3xl font-bold text-amber-400 mb-2">$40</div>
              <p className="text-gray-300 text-sm">Standard seating</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border-2 border-amber-500">
              <h3 className="text-xl font-semibold text-white mb-2">Premium Seating</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$60</div>
              <p className="text-gray-300 text-sm">Front rows with best acoustics</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Student/Senior</h3>
              <div className="text-3xl font-bold text-amber-400 mb-2">$25</div>
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
