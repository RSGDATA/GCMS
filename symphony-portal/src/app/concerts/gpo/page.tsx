import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft } from 'lucide-react'

export default function GPOPage() {
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
                GPO <span className="font-bold">Concert</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Experience the grandeur of orchestral music with the Greenville Philharmonic Orchestra in spectacular performances featuring classical masterworks.
              </p>
              <a
                href="https://tickets.example.com/gpo-concert"
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
                src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/london-symphony-orchestra-589180035-597b9cd003f40200109cd349.jpg`}
                alt="GPO Orchestra performing on stage"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-8">About GPO Concerts</h2>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p className="text-lg leading-relaxed">
              The Greenville Philharmonic Orchestra (GPO) concerts represent the pinnacle of orchestral performance in our region. 
              These magnificent concerts feature full orchestral works by the greatest composers in classical music history, 
              performed by world-class musicians under the direction of renowned conductors.
            </p>
            
            <p className="text-lg leading-relaxed">
              From Beethoven's powerful symphonies to Tchaikovsky's romantic masterpieces, GPO concerts offer audiences 
              the opportunity to experience the full emotional range and technical brilliance of orchestral music. 
              Each performance is carefully programmed to create a cohesive and inspiring musical journey.
            </p>

            <h3 className="text-2xl font-light text-gray-900 mt-12 mb-6">What to Expect</h3>
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-600">
              <li>Full orchestral performances with 60+ professional musicians</li>
              <li>World-renowned guest conductors and soloists</li>
              <li>Classical masterworks and contemporary compositions</li>
              <li>Pre-concert lectures and program notes</li>
              <li>Premium concert hall acoustics and seating</li>
              <li>Special themed concerts throughout the season</li>
            </ul>
          </div>
        </div>
      </section>

      {/* This Season's Concerts */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">This Season's GPO Concerts</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-light text-gray-900 mb-4">October Concert</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Opening night featuring classical favorites and seasonal selections that showcase the full range of orchestral repertoire.
              </p>
              <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>October 3, 2025 at 2:30 PM</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Heritage Main Library</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <span>200 seats available</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">$50</div>
              <a
                href="https://tickets.example.com/gpo-october"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Buy Tickets</span>
              </a>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Holiday Spectacular</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Festive holiday program with seasonal classics and audience favorites that celebrate the joy of the season.
              </p>
              <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>December 7, 2025 at 1:30 PM</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Greenville Concert Hall</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-blue-600" />
                  <span>250 seats available</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">$50</div>
              <a
                href="https://tickets.example.com/gpo-holiday"
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
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Music className="h-6 w-6 text-blue-400" />
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
