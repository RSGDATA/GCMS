'use client'

import Link from 'next/link'
import { Music, Award, Users, Star, Heart, Calendar, ArrowLeft } from 'lucide-react'
import { getImagePath } from '@/lib/imagePath'

export default function PopsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Hero Section - Matching homepage dimensions */}
      <section className="relative">
        <div className="w-full h-[70vh] relative flex items-center justify-center overflow-hidden">
          <img
            src={getImagePath("/GreenvillPops.jpg")}
            alt="Greenville Pops Orchestra"
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable="false"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light mb-6 leading-tight">
              Greenville <br />
              <span className="font-bold">Pops Orchestra</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
              Bringing the joy of popular music to life through orchestral excellence
            </p>
            <Link 
              href="/concerts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-md transition-colors text-lg"
            >
              View Our Concerts
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Greenville Pops Orchestra is dedicated to bringing the excitement and accessibility 
                of popular music to our community through high-quality orchestral performances. We bridge 
                the gap between classical tradition and contemporary entertainment, creating memorable 
                musical experiences for audiences of all ages.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                From beloved film scores and Broadway hits to jazz standards and contemporary pop 
                arrangements, we celebrate the diversity of American popular music while maintaining 
                the highest standards of orchestral excellence.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our performances are designed to be engaging, entertaining, and inclusive—welcoming 
                both seasoned concert-goers and those experiencing orchestral music for the first time.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <Music className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Perform</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Classic film scores and soundtracks</li>
                <li>• Broadway and musical theater favorites</li>
                <li>• Jazz and big band arrangements</li>
                <li>• Contemporary pop and rock orchestrations</li>
                <li>• Holiday and seasonal celebrations</li>
                <li>• Patriotic and Americana classics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Conductor Section */}
      <section className="py-20 px-4 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 text-center mb-12">
            Meet Our Conductor
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              href="/soloists/jason-lim-pops-conductor"
              className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={getImagePath("/PopsConductor.jpg")}
                  alt="Jason Lim"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-light text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Jason Lim
                </h3>
                <div className="flex items-center space-x-2 text-gray-600 mb-3">
                  <Music className="h-4 w-4" />
                  <span className="text-sm font-medium">Artistic Director & Conductor</span>
                </div>
                <p className="text-gray-600 line-clamp-3">
                  Jason Lim serves as Artistic Director and Conductor of the Greenville Pops Orchestra, 
                  leading the ensemble in its inaugural season. His passion for accessible, engaging 
                  programming and commitment to musical excellence make him the perfect visionary to 
                  launch this exciting new chapter in Greenville's cultural landscape.
                </p>
                <div className="mt-4 text-blue-600 font-medium inline-flex items-center group-hover:gap-2 transition-all">
                  Read Full Bio
                  <ArrowLeft className="h-4 w-4 rotate-180 ml-1 group-hover:ml-0 transition-all" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Accomplishments Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 text-center mb-12">
            Our Accomplishments
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <Star className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                Recognized for outstanding musical performances that bring joy and entertainment 
                to the Greenville community
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Building bridges between diverse audiences through accessible, engaging 
                orchestral performances
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                Pioneering creative programming that celebrates both traditional and 
                contemporary popular music
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Key Milestones
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 rounded-full p-2 mt-1 flex-shrink-0">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Inaugural Season Launch
                  </h4>
                  <p className="text-gray-600">
                    Successfully launched our first season as part of the Greenville Chamber Music 
                    Society, bringing pops orchestral music to the community with innovative programming 
                    and exceptional performances.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 rounded-full p-2 mt-1 flex-shrink-0">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Community Engagement
                  </h4>
                  <p className="text-gray-600">
                    Developed strong partnerships with local organizations and venues, creating 
                    accessible concert experiences that welcome audiences of all backgrounds and 
                    musical preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 rounded-full p-2 mt-1 flex-shrink-0">
                  <Music className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Diverse Programming
                  </h4>
                  <p className="text-gray-600">
                    Curated a diverse repertoire spanning film music, Broadway, jazz, and contemporary 
                    arrangements, demonstrating the versatility and appeal of orchestral pops music.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 rounded-full p-2 mt-1 flex-shrink-0">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Musical Excellence
                  </h4>
                  <p className="text-gray-600">
                    Assembled a talented ensemble of musicians committed to delivering high-quality 
                    performances that honor both the classical orchestral tradition and the spirit 
                    of popular music.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-light mb-6">
            Experience the Magic of Pops Orchestra
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join us for an unforgettable evening of music that celebrates the best of popular 
            orchestral repertoire. From timeless classics to contemporary favorites, there's 
            something for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/concerts"
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors"
            >
              View Upcoming Concerts
            </Link>
            <Link 
              href="/calendar"
              className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-8 rounded-md transition-colors border-2 border-white"
            >
              Check Our Calendar
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
