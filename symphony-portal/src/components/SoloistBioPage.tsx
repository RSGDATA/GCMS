'use client'

import Link from 'next/link'
import { ArrowLeft, Music, Award } from 'lucide-react'

interface SoloistBioPageProps {
  name: string
  instrument: string
  image: string
  bio: string[]
  achievements?: string[]
}

export default function SoloistBioPage({
  name,
  instrument,
  image,
  bio,
  achievements
}: SoloistBioPageProps) {
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
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Name and Text */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 text-blue-600 mb-4">
                <Music className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wide">{instrument}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-8">
                {name}
              </h1>
              
              {/* All bio paragraphs aligned under the name */}
              <div className="prose prose-lg text-gray-600 space-y-6">
                {bio.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Right Column - Image */}
            <div className="lg:col-span-1">
              <img
                src={image}
                alt={`${name} - ${instrument}`}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}

    </div>
  )
}
