'use client'

import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft, User } from 'lucide-react'
import { getImagePath } from '@/lib/imagePath'

interface SoloistInfo {
  slug: string
  name: string
  instrument: string
  image: string
  bio: string
}

interface ConcertPageBioProps {
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  aboutTitle: string
  aboutDescription: string[]
  features: string[]
  seasonTitle: string
  ticketUrl: string
  soloists?: SoloistInfo[]
}

export default function ConcertPageBio({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  aboutTitle,
  aboutDescription,
  features,
  seasonTitle,
  ticketUrl,
  soloists
}: ConcertPageBioProps) {
  const handlePurchaseTicket = () => {
    window.location.href = ticketUrl
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
                {title} <span className="font-bold">{subtitle}</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {description}
              </p>
              <button
                onClick={handlePurchaseTicket}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-md transition-colors inline-flex items-center space-x-2 text-lg"
              >
                <CreditCard className="h-5 w-5" />
                <span>Purchase Tickets</span>
              </button>
            </div>
            <div className="relative">
              <img
                src={image}
                alt={imageAlt}
                className="w-full object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Description */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-8">{aboutTitle}</h2>
          
          <div className="prose prose-lg text-gray-600 space-y-6">
            {aboutDescription.map((paragraph, index) => (
              <p key={index} className="text-lg leading-relaxed">
                {paragraph}
              </p>
            ))}

            <ul className="list-disc list-inside space-y-3 text-lg text-gray-600 mt-12">
              {features.map((feature, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: feature }}></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured Soloists Section - Now at the bottom */}
      {soloists && soloists.length > 0 && (
        <section className="py-20 px-4 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-3 mb-12">

              <h2 className="text-4xl font-light text-gray-900"></h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {soloists.map((soloist) => (
                <Link
                  key={soloist.slug}
                  href={`/soloists/${soloist.slug}`}
                  className="group block bg-gray-50 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={soloist.image}
                      alt={soloist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-light text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {soloist.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600 mb-3">
                      <Music className="h-4 w-4" />
                      <span className="text-sm font-medium">{soloist.instrument}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-3">
                      {soloist.bio}
                    </p>
                    <div className="mt-4 text-blue-600 font-medium inline-flex items-center group-hover:gap-2 transition-all">
                      Read Full Bio
                      <ArrowLeft className="h-4 w-4 rotate-180 ml-1 group-hover:ml-0 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
