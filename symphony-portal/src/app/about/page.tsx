import Link from 'next/link'
import { Music, Heart, Users, Award, Star, Calendar } from 'lucide-react'

export default function AboutPage() {
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
              <Link href="/students/signup" className="text-white hover:text-amber-400 transition-colors">
                Student Program
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Greenville Chamber Music Society
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Bringing the intimate beauty of chamber music to the Upstate through 
            world-class performances and educational outreach programs since 1985.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-300 mb-6">
                The Greenville Chamber Music Society exists to present the finest chamber music 
                performances to our community while fostering the next generation of musicians 
                through education and mentorship.
              </p>
              <p className="text-gray-300">
                We believe that chamber music, with its intimate scale and collaborative spirit, 
                offers a unique and transformative musical experience that enriches both performers 
                and audiences alike.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <Heart className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Community Impact</h3>
              <ul className="text-gray-300 space-y-2">
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
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Programs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <Star className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Concert Series</h3>
              <p className="text-gray-300 mb-4">
                Our annual concert series features world-renowned chamber music ensembles 
                performing in intimate venues throughout Greenville, creating unforgettable 
                musical experiences.
              </p>
              <ul className="text-gray-300 space-y-1">
                <li>• String quartets and piano trios</li>
                <li>• Wind quintets and brass ensembles</li>
                <li>• Solo recitals and masterclasses</li>
                <li>• Contemporary and classical repertoire</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <Users className="h-12 w-12 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-4">Educational Outreach</h3>
              <p className="text-gray-300 mb-4">
                Our educational programs bring chamber music directly to students, offering 
                workshops, masterclasses, and performance opportunities that inspire the 
                next generation of musicians.
              </p>
              <ul className="text-gray-300 space-y-1">
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
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Story</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-400 rounded-full p-2 mt-1">
                <Calendar className="h-4 w-4 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1985 - Foundation</h3>
                <p className="text-gray-300">
                  The Greenville Chamber Music Society was founded by a group of music lovers 
                  dedicated to bringing world-class chamber music to the Upstate region.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-400 rounded-full p-2 mt-1">
                <Music className="h-4 w-4 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1990s - Growth & Recognition</h3>
                <p className="text-gray-300">
                  Our concert series gained regional recognition, attracting internationally 
                  acclaimed ensembles and establishing Greenville as a chamber music destination.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-400 rounded-full p-2 mt-1">
                <Heart className="h-4 w-4 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2000s - Educational Expansion</h3>
                <p className="text-gray-300">
                  We launched our educational outreach programs, bringing chamber music 
                  education to local schools and nurturing young talent in our community.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-amber-400 rounded-full p-2 mt-1">
                <Award className="h-4 w-4 text-black" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2024 - Digital Innovation</h3>
                <p className="text-gray-300">
                  The launch of our digital platform enhances accessibility and connects 
                  our community with chamber music like never before.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Musical Community</h2>
          <p className="text-xl text-gray-300 mb-8">
            Experience the magic of chamber music with us. Whether you're a seasoned music lover 
            or new to classical music, we welcome you to our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/concerts"
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              View Concerts
            </Link>
            <Link 
              href="/students/signup"
              className="border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Student Programs
            </Link>
          </div>
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
