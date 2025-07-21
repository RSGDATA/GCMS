

"use client";
import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

const ConcertCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const concerts = [
    {
      id: 'NightAtTheMovies',
      title: 'Night at the Movies',
      image: '/NightAtTheMovies-carousel.png',
      description: 'Experience the magic of cinema with the Greenville Pops Orchestra as blockbuster movies come to life.',
      link: '/concerts/NightAtTheMovies'
    },
    {
      id: 'piano-contest',
      title: 'Piano Contest',
      image: '/soloist.jpg',
      description: 'Witness the next generation of piano virtuosos compete in our prestigious annual competition.',
      link: '/concerts/piano-contest'
    },
    {
      id: 'ashley',
      title: 'Ashley Concerts',
      image: '/soloist.jpg',
      description: 'Intimate performances showcasing technical brilliance and emotional depth in classical repertoire.',
      link: '/concerts/ashley'
    },
    {
      id: 'gcms',
      title: 'GCMS Ensemble',
      image: '/chamber.png',
      description: 'Our signature performances featuring talented resident musicians and special guest artists.',
      link: '/concerts/gcms'
    },
    {
      id: 'dhaka-standard',
      title: 'Dhaka Standard',
      image: '/soloist.jpg',
      description: 'A unique fusion of classical traditions and international influences celebrating global heritage.',
      link: '/concerts/dhaka-standard'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % concerts.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + concerts.length) % concerts.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {concerts.map((concert, index) => (
            <div key={concert.id} className="w-full flex-shrink-0">
              <div className="relative">
                <img
                  src={concert.image}
                  alt={concert.title}
                  className="w-full h-64 sm:h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                  <div className="p-4 sm:p-6 md:p-8 text-white w-full">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">{concert.title}</h3>
                    <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 text-gray-200 line-clamp-2 sm:line-clamp-none">{concert.description}</p>
                    <Link
                      href={concert.link}
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors inline-block text-sm sm:text-base touch-manipulation"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 active:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-colors touch-manipulation"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 active:bg-black/80 text-white p-2 sm:p-3 rounded-full transition-colors touch-manipulation"
          aria-label="Next slide"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
        {concerts.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors touch-manipulation ${
              index === currentSlide ? 'bg-blue-600' : 'bg-white/30 hover:bg-white/50 active:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <img 
                src="/GCMS_Logo.png"
                alt="GCMS Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-bold text-gray-900 truncate">
                <span className="hidden sm:inline">Greenville Chamber Music Society</span>
                <span className="sm:hidden">GCMS</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/concerts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium uppercase text-sm tracking-wide">
                Concerts & Events
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
                  href="/concerts"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Concerts & Events
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
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors font-medium"
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

      {/* Hero Image Section */}
      <section className="relative pt-20">
        <div className="w-full h-[70vh] relative flex items-center justify-center overflow-hidden">
          <img
            src="/london-symphony-orchestra-589180035-597b9cd003f40200109cd349.jpg"
            alt="Orchestra performing on stage"
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable="false"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light mb-6 leading-tight">
              Experience the Beauty of <br />
              <span className="font-bold">Chamber Music</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
              Intimate performances. World-class artists. Unforgettable moments.
            </p>
            <Link 
              href="/concerts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-md transition-colors text-lg"
            >
              View Upcoming Concerts
            </Link>
          </div>
        </div>
      </section>

      {/* Concert Series Carousel Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Upcoming Concerts & Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our diverse season of chamber music performances featuring renowned artists and emerging talents.
            </p>
          </div>
          <ConcertCarousel />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                About Our Society
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Greenville Chamber Music Society has been bringing world-class chamber music to the Upstate since 1985. 
                We present intimate concerts featuring renowned artists and emerging talents, fostering a deep appreciation 
                for the chamber music tradition in our community.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our mission is to enrich the cultural landscape of Greenville through exceptional musical experiences 
                that inspire, educate, and connect our community.
              </p>
              <Link 
                href="/about"
                className="text-blue-600 hover:text-blue-700 font-medium text-lg border-b-2 border-blue-600 hover:border-blue-700 transition-colors"
              >
                Learn More About Us →
              </Link>
            </div>
            <div className="relative">
              <img
                src="/chamber.png"
                alt="Chamber music performance"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-light mb-6">
            Join Our Musical Community
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest concert announcements, artist spotlights, and exclusive content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-colors">
              Subscribe
            </button>
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
                  src="/GCMS_Logo.png"
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
