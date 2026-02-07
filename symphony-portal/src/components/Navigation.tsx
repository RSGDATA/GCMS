'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { getImagePath } from '@/lib/imagePath'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname.startsWith(path)) return true
    return false
  }

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/concerts', label: 'Concerts' },
    { href: '/pops', label: 'Pops' },
    { href: '/calendar', label: 'Calendar' },
    { href: '/about', label: 'About' },
    // { href: '/musicians/login', label: 'Musicians' }, // Commented out - not ready yet
  ]

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src={getImagePath("/GCMS_Logo.png")}
              alt="GCMS Logo" 
              className="h-12 w-auto object-contain"
            />
            <span className="text-xl font-bold text-gray-900">
              <span className="hidden sm:inline">Greenville Chamber Music Society</span>
              <span className="sm:hidden">GCMS</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors font-medium uppercase text-sm tracking-wide ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* <Link 
              href="/students/signup" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
            >
              Student Program
            </Link> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors p-2"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md transition-colors font-medium ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {/* <Link
                href="/students/signup"
                className="block px-3 py-2 bg-blue-600 text-white rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Program
              </Link> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
