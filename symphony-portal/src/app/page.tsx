

"use client";
import Link from 'next/link'
import { Music, Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { JSX, useState } from 'react'
import React from 'react'
import { getImagePath } from '@/lib/imagePath'

interface Concert {
  id: string;
  image: string;
  link: string;
  title?: string;
  description?: string;
}

interface RenderConcertImageProps {
  concert: Concert;
}

const renderConcertImage = (concert: Concert): JSX.Element => {
  return (
    <div className="w-full bg-gray-900 overflow-hidden">
      <img
        src={concert.image}
        alt={concert.title || 'Concert image'}
        className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          aspectRatio: 'auto'
        }}
        onLoad={(e) => {
          // Ensure image fits properly after loading
          const img = e.target as HTMLImageElement;
          img.style.opacity = '1';
        }}
        onError={(e) => {
          // Fallback for broken images
          const img = e.target as HTMLImageElement;
          img.style.backgroundColor = '#f3f4f6';
        }}
      />
    </div>
  );
};

const ConcertCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const concerts = [
    {
      id: 'NightAtTheMovies',
      image: getImagePath('/NIghtAtTheMoviesBanner.png'),
      link: '/concerts/NightAtTheMovies',
    },
    {
      id: 'ashley',
      image: getImagePath('/TheMelodiesOfNatureBanner.png'),
      link: '/concerts/ashley',
    },
    {
      id: 'eldred',
      title: '',
      image: getImagePath('/EldredMarshalInConcertBanner.png'),
      description: '',
      link: '/concerts/eldred',
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % concerts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + concerts.length) % concerts.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-0">
      {/* Main Carousel */}
      <div className="relative overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {concerts.map((concert) => (
            <div key={concert.id} className="w-full flex-shrink-0">
              <Link href={concert.link} className="block relative cursor-pointer">
                {renderConcertImage(concert)}
                <div className="absolute inset-0 bg-black/40 flex items-end hover:bg-black/50 transition-colors">
                  <div className="p-4 sm:p-6 md:p-8 text-white w-full">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">{concert.title}</h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-200 line-clamp-2 sm:line-clamp-none">{concert.description}</p>
                  </div>
                </div>
              </Link>
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
            className={`w-2 h-2 sm:w-4 sm:h-4 rounded-full transition-colors touch-manipulation ${
              index === currentSlide ? 'bg-blue-600' : 'bg-white/30 hover:bg-white/50 active:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Image Section */}
      <section className="relative">
        <div className="w-full h-[70vh] relative flex items-center justify-center overflow-hidden">
          <img
            src={getImagePath("/HomePagePicture.png")}
            alt="Orchestra performing on stage"
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable="false"
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-light mb-6 leading-tight">
              Experience the Beauty of <br />
              <span className="font-bold">Chamber Music</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light opacity-90">
              Intimate performances. World-class artists. Unforgettable moments.
            </p>
            <Link 
              href="/concerts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-md transition-colors text-lg"
            >
              View Upcoming Concerts
            </Link>
          </div>
        </div>
      </section>

      {/* Concert Series Carousel Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Upcoming Concerts & Events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our diverse season of chamber music performances featuring renowned artists and emerging talents.
            </p>
          </div>
          <ConcertCarousel />
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">
                About Our Society
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Greenville Chamber Music Society is a dynamic music collective founded in 2024, bringing chamber music, 
                jazz, and beyond to Greenville, Texas. We create a space where artists can freely explore musical innovation 
                and collaboration through our diverse programming.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our inaugural season features 11 carefully curated concerts showcasing diverse musical voices, from intimate 
                chamber works to innovative jazz collaborations and cross-genre explorations.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Beyond performance, we're pioneering tech-savvy methodologies to support and boost other arts nonprofits, 
                creating a stronger, more connected cultural community in Texas and beyond.
              </p>
              <Link 
                href="/about"
                className="text-blue-600 hover:text-blue-700 font-medium text-lg border-b-2 border-blue-600 hover:border-blue-700 transition-colors"
              >
                Learn More About Us →
              </Link>
            </div>
            <div className="relative">
              <img
                src={getImagePath("/chamber.png")}
                alt="Chamber music performance"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-light mb-6">
            Join Our Musical Community
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for the latest concert announcements, artist spotlights, and exclusive content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
