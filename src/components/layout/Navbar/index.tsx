'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Menu, Search, X } from 'lucide-react'
import { navigation } from '@/config/navigation'
import { Logo } from '@/components/ui/Logo'
import { NavbarMyListButton } from '@/components/ui/NavbarMyListButton'
import { cn } from '@/lib/utils/cn'

const SearchBar = dynamic(
  () => import('@/components/search/SearchBar').then(mod => mod.SearchBar),
  { ssr: false }
)

export function Navbar() {
  const pathname = usePathname()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsSearchOpen(false)
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const solid = isScrolled || isSearchOpen || isMenuOpen

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-nav transition-colors duration-300',
          solid
            ? 'bg-cinevin-dark border-b border-cinevin-border'
            : 'gradient-nav'
        )}
      >
        <div className="container-cinevin flex h-14 items-center justify-between md:h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <Logo size="md" />

            <div className="hidden items-center gap-1 lg:flex">
              {navigation.main.map(item => {
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-white'
                        : 'text-cinevin-text-muted hover:text-white'
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => setIsSearchOpen(v => !v)}
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
              className="flex h-10 w-10 items-center justify-center rounded-md text-cinevin-text-muted transition hover:bg-white/10 hover:text-white"
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            <div className="hidden md:block">
              <NavbarMyListButton />
            </div>

            <button
              onClick={() => setIsMenuOpen(v => !v)}
              aria-label="Menu"
              className="flex h-10 w-10 items-center justify-center rounded-md text-cinevin-text-muted transition hover:bg-white/10 hover:text-white lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search dropdown — no overflow-hidden so suggestions escape */}
        {isSearchOpen && (
          <div className="relative border-t border-cinevin-border bg-cinevin-dark p-4 shadow-2xl shadow-black/60">
            <div className="container-cinevin mx-auto max-w-4xl">
              <SearchBar onClose={() => setIsSearchOpen(false)} autoFocus />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        <div
          className={cn(
            'overflow-hidden border-t border-cinevin-border bg-cinevin-dark transition-all duration-300 lg:hidden',
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="container-cinevin flex flex-col py-2">
            {navigation.main.map(item => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-cinevin-text-muted hover:bg-white/5 hover:text-white'
                  )}
                >
                  {item.name}
                </Link>
              )
            })}
            <div className="border-t border-cinevin-border pt-2 md:hidden">
              <NavbarMyListButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {(isSearchOpen || isMenuOpen) && (
        <div
          className="fixed inset-x-0 bottom-0 top-14 z-[35] bg-black/60 backdrop-blur-sm md:top-16"
          onClick={() => {
            setIsSearchOpen(false)
            setIsMenuOpen(false)
          }}
          aria-hidden="true"
        />
      )}
    </>
  )
}