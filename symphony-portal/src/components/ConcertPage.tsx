'use client'

import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, CreditCard, ArrowLeft } from 'lucide-react'
import { getImagePath } from '@/lib/imagePath'

interface ConcertEvent {
  title: string
  description: string
  date: string
  venue: string
  seats: string
  price: string
}

interface ConcertPageProps {
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  aboutTitle: string
  aboutDescription: string[]
  features: string[]
  seasonTitle: string
  events: ConcertEvent[]
  ticketUrl: string
}

export default function ConcertPage({
  title,
  subtitle,
  description,
  image,
  imageAlt,
  aboutTitle,
  aboutDescription,
  features,
  seasonTitle,
  events,
  ticketUrl
}: ConcertPageProps) {
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

            <h3 className="text-2xl font-light text-gray-900 mt-12 mb-6">What to Expect</h3>
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-600">
              {features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* This Season's Concerts */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light text-gray-900 mb-12 text-center">{seasonTitle}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((event, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-light text-gray-900 mb-4">{event.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {event.description}
                </p>
                <div className="space-y-3 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                    <span>{event.venue}</span>
                  </div>
                </div>
                <button
                  onClick={handlePurchaseTicket}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Buy Tickets</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
