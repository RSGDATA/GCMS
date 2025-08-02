import Link from 'next/link'
import { getImagePath } from '@/lib/imagePath'

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src={getImagePath("/GCMS_Logo.png")}
                alt="GCMS Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-xl font-bold text-white">Greenville Chamber Music Society</span>
            </div>
            <p className="text-gray-400 mb-4">
              Bringing world-class chamber music to East Texas.
            </p>
            <div className="text-gray-400">
              <p>Greenville Municipal Auditorium</p>
              <p>2821 Washington St, Greenville, TX 75401</p>
              <p className="mt-2">(903) 457-3179</p>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/concerts" className="text-gray-400 hover:text-white transition-colors">Concerts</Link></li>
              <li><Link href="/calendar" className="text-gray-400 hover:text-white transition-colors">Calendar</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              {/* <li><Link href="/musicians/login" className="text-gray-400 hover:text-white transition-colors">Musicians</Link></li> */}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wide">Programs</h3>
            <ul className="space-y-2">
              {/* Programs section left blank - no programs available yet */}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Greenville Chamber Music Society. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
