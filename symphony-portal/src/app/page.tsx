import Link from 'next/link'
import { Music, Calendar, MapPin, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-amber-400" />
              <span className="text-xl font-bold text-white">Greenville Chamber Music Society</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/concerts" className="text-white hover:text-amber-400 transition-colors">
                Concerts
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

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Greenville Chamber Music
            <span className="text-amber-400 block">Society</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience intimate chamber music performances featuring world-class musicians in the heart of Greenville.
          </p>
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-amber-400/20 to-orange-600/20 rounded-lg p-8 backdrop-blur-sm border border-amber-400/30">
              <div className="flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="flex justify-center space-x-4 mb-4">
                    <Music className="h-16 w-16 text-amber-400" />
                    <Music className="h-20 w-20 text-amber-300" />
                    <Music className="h-16 w-16 text-amber-400" />
                    <Music className="h-16 w-16 text-amber-200" />
                    <Music className="h-16 w-16 text-amber-400" />
                  </div>
                  <p className="text-lg font-medium text-amber-200">Chamber Orchestra</p>
                  <p className="text-sm text-gray-300 mt-2">World-class musicians performing intimate classical masterpieces</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Concerts Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Upcoming Concerts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Concert 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Music className="h-16 w-16 mx-auto mb-2" />
                  <p className="text-sm font-medium">String Quartet Performance</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Mozart & Beethoven Evening</h3>
                <div className="space-y-2 text-gray-300 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>March 15, 2024</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>7:30 PM</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Greenville Concert Hall</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  An intimate evening featuring Mozart&apos;s String Quartet No. 19 and Beethoven&apos;s String Quartet No. 14.
                </p>
                <Link 
                  href="/concerts"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded transition-colors inline-block"
                >
                  Get Tickets
                </Link>
              </div>
            </div>

            {/* Concert 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Music className="h-16 w-16 mx-auto mb-2" />
                  <p className="text-sm font-medium">Piano Trio</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Romantic Masterpieces</h3>
                <div className="space-y-2 text-gray-300 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>April 2, 2024</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>7:30 PM</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Heritage Main Library</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Featuring Brahms Piano Trio No. 1 and Schumann Piano Trio No. 1 performed by acclaimed artists.
                </p>
                <Link 
                  href="/concerts"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded transition-colors inline-block"
                >
                  Get Tickets
                </Link>
              </div>
            </div>

            {/* Concert 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-teal-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Music className="h-16 w-16 mx-auto mb-2" />
                  <p className="text-sm font-medium">Wind Quintet</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Spring Serenade</h3>
                <div className="space-y-2 text-gray-300 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>April 20, 2024</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>3:00 PM</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Falls Park Amphitheater</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-4">
                  Outdoor concert featuring Mozart Wind Serenade and contemporary works celebrating spring.
                </p>
                <Link 
                  href="/concerts"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-4 rounded transition-colors inline-block"
                >
                  Get Tickets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            About Our Society
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The Greenville Chamber Music Society has been bringing world-class chamber music to the Upstate since 1985. 
            We present intimate concerts featuring renowned artists and emerging talents, fostering a deep appreciation 
            for the chamber music tradition in our community.
          </p>
          <Link 
            href="/about"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-8 rounded-lg transition-colors"
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
