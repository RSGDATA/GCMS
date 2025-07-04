

"use client";
import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useState } from 'react'

const ConcertCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const concerts = [
    {
      id: 'soloist',
      title: 'Soloist Series',
      image: `${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/soloist.jpg`,
      description: 'Experience world-renowned soloists performing classical masterpieces with our chamber ensemble.',
      link: '/concerts/soloist'
    },
    {
      id: 'chamber',
      title: 'Chamber Music',
      image: `${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/chamber.png`,
      description: 'Intimate chamber music performances featuring string quartets, piano trios, and wind ensembles.',
      link: '/concerts/chamber'
    },
    {
      id: 'pops',
      title: 'Pops Concert',
      image: `${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/pops.png`,
      description: 'Popular classics and contemporary favorites in a relaxed, family-friendly atmosphere.',
      link: '/concerts/pops'
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
                      className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg transition-colors inline-block text-sm sm:text-base touch-manipulation"
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
              index === currentSlide ? 'bg-amber-500' : 'bg-white/30 hover:bg-white/50 active:bg-white/60'
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Music className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
              <span className="text-lg sm:text-xl font-bold text-white truncate">
                <span className="hidden sm:inline">Greenville Chamber Music Society</span>
                <span className="sm:hidden">GCMS</span>
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
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

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-amber-400 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-sm border-t border-white/10">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="/concerts"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Concerts
                </Link>
                <Link
                  href="/calendar"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Calendar
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/musicians/login"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Musicians
                </Link>
                <Link
                  href="/students/signup"
                  className="block px-3 py-2 text-white hover:text-amber-400 hover:bg-white/10 rounded-md transition-colors"
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
      <section className="relative">
        <div className="w-full min-h-[calc(100vh-4rem)] h-[calc(100vh-4rem)] relative flex items-center justify-center overflow-hidden">
          <img
            src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/london-symphony-orchestra-589180035-597b9cd003f40200109cd349.jpg`}
            alt="London Symphony Orchestra performing on stage"
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable="false"
          />
        </div>
      </section>

      {/* Concert Series Carousel Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center mb-8 sm:mb-12 md:mb-16">
            Our Concert Series
          </h2>
          <ConcertCarousel />
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            About Our Society
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
            The Greenville Chamber Music Society has been bringing world-class chamber music to the Upstate since 1985. 
            We present intimate concerts featuring renowned artists and emerging talents, fostering a deep appreciation 
            for the chamber music tradition in our community.
          </p>
          <Link 
            href="/about"
            className="bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-black font-semibold py-3 px-6 sm:px-8 rounded-lg transition-colors touch-manipulation inline-block"
          >
            Learn More About Us
          </Link>
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
