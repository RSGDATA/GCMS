'use client'

import Link from 'next/link'
import { Music, Heart, Users, Award, Star, Calendar } from 'lucide-react'
import { getImagePath } from '@/lib/imagePath'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
            About Greenville Chamber Music Society
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A dynamic music collective founded in 2024, bringing chamber music, jazz, and beyond 
            to Greenville, Texas through innovative performances and tech-savvy community engagement.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Greenville Chamber Music Society is a forward-thinking music collective where 
                artists can freely explore chamber music, jazz, and beyond. We create a space for 
                musical innovation and collaboration in Greenville, Texas.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission extends beyond performance—we're pioneering tech-savvy methodologies 
                to support and boost other arts nonprofits, creating a stronger, more connected 
                cultural community.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <Heart className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Impact</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Founded in 2024 with fresh vision</li>
                <li>• 11 concerts planned for inaugural season</li>
                <li>• Innovative tech-driven approach</li>
                <li>• Supporting other arts nonprofits</li>
                <li>• Building community through music</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <Star className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Music Collective</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We've created a space where musicians can freely explore and perform chamber music, 
                jazz, and beyond. Our 11-concert inaugural season showcases diverse musical voices 
                and innovative programming.
              </p>
              <ul className="text-gray-600 space-y-1">
                <li>• Chamber music ensembles</li>
                <li>• Jazz collaborations</li>
                <li>• Cross-genre explorations</li>
                <li>• Solo and ensemble performances</li>
                <li>• Contemporary and classical works</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community Innovation</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Beyond our performances, we're developing outreach programs and using our 
                tech-savvy methodology to support and boost other arts nonprofits in our 
                community and beyond.
              </p>
              <ul className="text-gray-600 space-y-1">
                <li>• Planned outreach programs</li>
                <li>• Tech support for arts nonprofits</li>
                <li>• Digital innovation in the arts</li>
                <li>• Community partnership building</li>
                <li>• Resource sharing initiatives</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2024 - A New Beginning</h3>
                <p className="text-gray-600">
                  The Greenville Chamber Music Society was founded in 2024 with a fresh vision: 
                  creating a music collective where artists can freely explore chamber music, 
                  jazz, and beyond in Greenville, Texas.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <Music className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Inaugural Season</h3>
                <p className="text-gray-600">
                  Our first season features 11 carefully curated concerts showcasing diverse 
                  musical voices, from intimate chamber works to innovative jazz collaborations 
                  and cross-genre explorations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Focus</h3>
                <p className="text-gray-600">
                  We're developing outreach programs to bring music education and performance 
                  opportunities directly to our community, fostering the next generation of 
                  music lovers and performers.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-600 rounded-full p-2 mt-1">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tech Innovation</h3>
                <p className="text-gray-600">
                  Using our tech-savvy methodology, we're pioneering new ways to support and 
                  boost other arts nonprofits, creating a stronger, more connected cultural 
                  ecosystem in Texas and beyond.
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

    </div>
  )
}
