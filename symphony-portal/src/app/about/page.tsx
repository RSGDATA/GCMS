'use client'

import Link from 'next/link'
import { Music, Heart, Users, Award, Star, Calendar, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/GCMS_Logo.png`}
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
              <Link href="/concerts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Concerts
              </Link>
              <Link href="/calendar" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Calendar
              </Link>
              <Link href="/about" className="text-blue-600 font-medium uppercase text-sm tracking-wide">
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
                  href="/concerts"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Concerts
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
                  className="block px-3 py-2 text-blue-600 bg-blue-50 rounded-md font-medium"
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

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            About Greenville Chamber Music Society
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Bringing the intimate beauty of chamber music to the Upstate through 
            world-class performances and educational outreach programs since 1985.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Greenville Chamber Music Society exists to present the finest chamber music 
                performances to our community while fostering the next generation of musicians 
                through education and mentorship.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that chamber music, with its intimate scale and collaborative spirit, 
                offers a unique and transformative musical experience that enriches both performers 
                and audiences alike.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <Heart className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Impact</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 40+ years of musical excellence</li>
                <li>• 200+ students served annually</li>
                <li>• 15+ concerts performed each season</li>
                <li>• Partnerships with local schools</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 text-center mb-12">Our Programs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <Star className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Concert Series</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our annual concert series features world-renowned chamber music ensembles 
                performing in intimate venues throughout Greenville, creating unforgettable 
                musical experiences.
              </p>
              <ul className="text-gray-600 space-y-1">
                <li>• String quartets and piano trios</li>
                <li>• Wind quintets and brass ensembles</li>
                <li>• Solo recitals and masterclasses</li>
                <li>• Contemporary and classical repertoire</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Educational Outreach</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our educational programs bring chamber music directly to students, offering 
                workshops, masterclasses, and performance opportunities that inspire the 
                next generation of musicians.
              </p>
              <ul className="text-gray-600 space-y-1">
                <li>• School visit programs</li>
                <li>• Student ensemble coaching</li>
                <li>• Young artist competitions</li>
                <li>• Summer chamber music camps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 text-center mb-12">Our Story</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1985 - Foundation</h3>
                <p className="text-gray-600">
                  The Greenville Chamber Music Society was founded by a group of music lovers 
                  dedicated to bringing world-class chamber music to the Upstate region.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <Music className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1990s - Growth & Recognition</h3>
                <p className="text-gray-600">
                  Our concert series gained regional recognition, attracting internationally 
                  acclaimed ensembles and establishing Greenville as a chamber music destination.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2000s - Educational Expansion</h3>
                <p className="text-gray-600">
                  We launched our educational outreach programs, bringing chamber music 
                  education to local schools and nurturing young talent in our community.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2024 - Digital Innovation</h3>
                <p className="text-gray-600">
                  The launch of our digital platform enhances accessibility and connects 
                  our community with chamber music like never before.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-light mb-6">Join Our Musical Community</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the magic of chamber music with us. Whether you're a seasoned music lover 
            or new to classical music, we welcome you to our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/concerts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition-colors"
            >
              View Concerts
            </Link>
            <Link 
              href="/faculty"
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
            >
              Meet Our Faculty
            </Link>
            <Link 
              href="/students/signup"
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
            >
              Student Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/GCMS_Logo.png`}
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
                <li><Link href="/faculty" className="text-gray-400 hover:text-white transition-colors">Faculty</Link></li>
                <li><Link href="/concerts/piano-contest" className="text-gray-400 hover:text-white transition-colors">Piano Contest</Link></li>
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
