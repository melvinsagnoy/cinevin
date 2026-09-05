'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '@/config/navigation'
import { NavbarMyListButton } from '@/components/ui/NavbarMyListButton'
import dynamic from 'next/dynamic'

const SearchBar = dynamic(
  () => import('@/components/search/SearchBar').then(mod => mod.SearchBar),
  { ssr: false }
)

export function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur' : 'bg-gradient-to-b from-black/90 to-transparent'
      }`}
    >
      <div className="container-premium flex h-14 items-center justify-between px-4 md:h-16">
        <div className="flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold transition-all duration-300 hover:scale-105 hover:opacity-80 md:text-3xl lg:text-4xl flex-shrink-0"
          >
            <span className="text-[#E50914]">CINE</span>
            <span className="text-white">VIN</span>
          </Link>
          
          {/* Navigation - Hidden on mobile when search is open */}
          <div className={`hidden lg:flex items-center gap-3 lg:gap-5 ${isSearchOpen ? 'hidden' : ''}`}>
            {navigation.main.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  pathname === item.href
                    ? 'text-white'
                    : 'text-[#b3b3b3] hover:text-white hover:scale-105'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="rounded p-2 text-[#b3b3b3] transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-110"
            aria-label="Search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <NavbarMyListButton />
        </div>
      </div>

      {/* Search dropdown */}
      <div 
        className={`overflow-visible transition-all duration-300 ${
          isSearchOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-white/10 bg-black/95 p-4 backdrop-blur">
          <div className="container-premium max-w-4xl mx-auto">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        </div>
      </div>
    </nav>
  )
}