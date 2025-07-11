import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft, Trophy, Users } from 'lucide-react'

export default function PianoContestPage() {
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
                Piano <span className="font-bold">Contest</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Witness the next generation of piano virtuosos compete in our prestigious annual piano competition, featuring talented young musicians from across the region.
              </p>
              <a
                href="https://tickets.example.com/piano-contest"
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
                src={`${process.env.NODE_ENV === 'production' ? '/GCMS' : ''}/soloist.jpg`}
                alt="Young pianist performing at piano contest"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-8">About Our Piano Contest</h2>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            <p className="text-lg leading-relaxed">
              Our annual Piano Contest celebrates the exceptional talent of young pianists in our community and beyond. 
              This prestigious competition provides a platform for emerging artists to showcase their skills, compete for 
              valuable prizes, and gain performance experience in a professional setting.
            </p>
            
            <p className="text-lg leading-relaxed">
              The contest features multiple age categories and attracts participants from across the Southeast. 
              Each contestant performs a carefully prepared program, demonstrating technical proficiency, musical 
              interpretation, and artistic maturity. Our distinguished panel of judges includes renowned pianists, 
              pedagogues, and music professionals.
            </p>

            <h3 className="text-2xl font-light text-gray-900 mt-12 mb-6">Contest Features</h3>
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-600">
              <li>Multiple age divisions from elementary through college level</li>
              <li>Distinguished panel of professional judges</li>
              <li>Cash prizes, trophies, and certificates for winners</li>
              <li>Master class opportunities with guest artists</li>
              <li>Performance opportunities with local ensembles</li>
              <li>Professional recording of winning performances</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contest Schedule */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">Contest Schedule</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Fall Competition</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Annual competition featuring young pianists ages 8-18, showcasing their technical skills and musical interpretation.
              </p>
              <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>October 18, 2025 at 2:00 PM</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Heritage Main Library</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Judges, Certificates, Trophies</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Ages 8-18</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">$15</div>
              <a
                href="https://tickets.example.com/piano-contest-fall"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-flex items-center space-x-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Buy Tickets</span>
              </a>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-light text-gray-900 mb-4">Spring Competition</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Spring showcase featuring advanced young pianists competing for scholarships and performance opportunities.
              </p>
              <div className="space-y-3 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>April 18, 2025 at 1:00 PM</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Greenville Concert Hall</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Scholarships & Awards</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Ages 14-22</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">$15</div>
              <a
                href="https://tickets.example.com/piano-contest-spring"
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
