'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPosterUrl } from '@/lib/utils/helpers'

interface Suggestion {
  id: number
  title: string
  mediaType: 'movie' | 'tv'
  posterPath: string | null
  year: string
}

interface SearchSuggestionsProps {
  query: string
  onSelect?: (query: string) => void
  onClose?: () => void
}

export function SearchSuggestions({ query, onSelect, onClose }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setSuggestions(data.results || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!suggestions.length) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % suggestions.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            const selected = suggestions[selectedIndex]
            // Navigate directly to details page
            navigateToDetails(selected)
          }
          break
        case 'Escape':
          if (onClose) onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [suggestions, selectedIndex, onClose])

  // Navigate to details page
  const navigateToDetails = (item: Suggestion) => {
    if (onClose) onClose()
    if (item.mediaType === 'movie') {
      router.push(`/movies/${item.id}`)
    } else {
      router.push(`/watch/tv/${item.id}`)
    }
  }

  // Handle click on suggestion
  const handleSelect = (item: Suggestion) => {
    if (onSelect) onSelect(item.title)
    navigateToDetails(item)
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (onClose) onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  if (query.length < 2 || suggestions.length === 0) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 rounded-md bg-[#1a1a1a] border border-white/10 shadow-2xl overflow-hidden max-h-96 overflow-y-auto"
      style={{ 
        minWidth: '300px',
        zIndex: 9999,
        position: 'absolute',
      }}
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E50914] border-t-transparent" />
        </div>
      ) : (
        <div>
          <div className="px-3 py-2 border-b border-white/5">
            <span className="text-xs font-medium text-[#808080]">Suggestions</span>
          </div>
          {suggestions.map((item, index) => (
            <button
              key={`${item.mediaType}-${item.id}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${
                selectedIndex === index ? 'bg-[#2a2a2a]' : 'hover:bg-[#2a2a2a]'
              }`}
            >
              {/* Poster thumbnail */}
              <div className="relative h-12 w-8 flex-shrink-0 overflow-hidden rounded">
                {item.posterPath ? (
                  <Image
                    src={getPosterUrl(item.posterPath, 'small') || ''}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a]">
                    <svg className="h-4 w-4 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title and type */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#808080]">{item.mediaType === 'movie' ? 'Movie' : 'TV'}</span>
                  {item.year && (
                    <>
                      <span className="text-xs text-[#808080]">•</span>
                      <span className="text-xs text-[#808080]">{item.year}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Arrow icon to indicate navigation */}
              <svg className="h-4 w-4 text-[#808080] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}