'use client'

import Link from 'next/link'
import { Music, ArrowLeft } from 'lucide-react'

export default function FacultyPage() {
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
              <Link href="/concerts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
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
          href="/about"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to About
        </Link>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            Our Faculty
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Meet our distinguished faculty of world-class musicians and educators 
            who bring passion, expertise, and dedication to every lesson and performance.
          </p>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. Sarah Mitchell</h3>
                <p className="text-blue-600 font-medium">Artistic Director & Violin</p>
              </div>
              <p className="text-gray-600 mb-4">
                Dr. Sarah Mitchell brings over 20 years of performance and teaching experience to GCMS. 
                A graduate of Juilliard School, she has performed with major orchestras worldwide.
              </p>
              <div className="text-sm text-gray-500">
                <p>• DMA, Juilliard School</p>
                <p>• MM, New England Conservatory</p>
                <p>• BM, Oberlin Conservatory</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Professor James Chen</h3>
                <p className="text-blue-600 font-medium">Piano Faculty & Collaborative Artist</p>
              </div>
              <p className="text-gray-600 mb-4">
                Professor James Chen is renowned for his collaborative piano work and has accompanied 
                world-class soloists in major concert halls.
              </p>
              <div className="text-sm text-gray-500">
                <p>• MM, Curtis Institute</p>
                <p>• BM, Yale School of Music</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Dr. Maria Rodriguez</h3>
                <p className="text-blue-600 font-medium">Cello Faculty & Ensemble Coach</p>
              </div>
              <p className="text-gray-600 mb-4">
                Dr. Maria Rodriguez combines her extensive performance career with a passion for teaching. 
                She has been featured as a soloist with numerous orchestras.
              </p>
              <div className="text-sm text-gray-500">
                <p>• DMA, Indiana University</p>
                <p>• MM, Cleveland Institute</p>
                <p>• BM, Rice University</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-light mb-6">Learn from the Best</h2>
          <p className="text-xl mb-8 opacity-90">
            Our faculty members are not only accomplished performers but also dedicated educators 
            committed to nurturing the next generation of musicians.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/students/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
            >
              Join Our Programs
            </Link>
            <Link 
              href="/concerts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors border border-white"
            >
              See Them Perform
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
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
      </footer>
    </div>
  )
}
