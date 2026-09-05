'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/Button'
import { SearchSuggestions } from '../SearchSuggestions'

// Local storage key for recent searches
const RECENT_SEARCHES_KEY = 'cinevin_recent_searches'
const MAX_RECENT_SEARCHES = 10

interface SearchBarProps {
  initialValue?: string
  onSearch?: (query: string) => void
  placeholder?: string
  autoFocus?: boolean
  onClose?: () => void
}

export function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = 'Search for movies, TV shows, people...',
  autoFocus = false,
  onClose,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialValue)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showRecent, setShowRecent] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e)
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) return
    
    const updated = [
      searchTerm.trim(),
      ...recentSearches.filter(s => s.toLowerCase() !== searchTerm.trim().toLowerCase())
    ].slice(0, MAX_RECENT_SEARCHES)
    
    setRecentSearches(updated)
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error('Failed to save recent searches:', e)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch (e) {
      console.error('Failed to clear recent searches:', e)
    }
  }

  useEffect(() => {
    if (debouncedQuery.length >= 2 && onSearch) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowRecent(false)
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery.length >= 2) {
      saveRecentSearch(trimmedQuery)
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      if (onClose) onClose()
      setShowRecent(false)
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (searchTerm: string) => {
    setQuery(searchTerm)
    saveRecentSearch(searchTerm)
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    if (onClose) onClose()
    setShowSuggestions(false)
    setShowRecent(false)
  }

  const handleSelectRecent = (search: string) => {
    setQuery(search)
    saveRecentSearch(search)
    router.push(`/search?q=${encodeURIComponent(search)}`)
    if (onClose) onClose()
    setShowRecent(false)
    setShowSuggestions(false)
  }

  const handleFocus = () => {
    if (recentSearches.length > 0 && query.length === 0) {
      setShowRecent(true)
      setShowSuggestions(false)
    }
    if (query.length >= 2) {
      setShowSuggestions(true)
      setShowRecent(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.length >= 2) {
      setShowSuggestions(true)
      setShowRecent(false)
    } else {
      setShowSuggestions(false)
      if (value.length === 0 && recentSearches.length > 0) {
        setShowRecent(true)
      }
    }
  }

  const handleClear = () => {
    setQuery('')
    setShowSuggestions(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleClose = () => {
    setShowRecent(false)
    setShowSuggestions(false)
    if (onClose) onClose()
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ zIndex: 9999 }}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <svg
            className="absolute left-3 h-5 w-5 text-[#808080]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="w-full rounded-md border border-white/10 bg-black/50 py-3 pl-10 pr-24 text-white placeholder-[#808080] focus:border-[#E50914] focus:outline-none focus:ring-1 focus:ring-[#E50914]/20 transition"
          />
          <div className="absolute right-2 flex items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="rounded-full p-1 text-[#808080] hover:text-white transition"
                aria-label="Clear search"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={handleClose}
                className="rounded px-3 py-1 text-sm text-[#808080] hover:text-white transition"
              >
                Cancel
              </button>
            )}
            <Button type="submit" size="sm" className="hidden sm:inline-flex">
              Search
            </Button>
          </div>
        </div>
      </form>

      {/* Search Suggestions - Always render but control visibility */}
      {showSuggestions && query.length >= 2 && (
        <SearchSuggestions
          query={query}
          onSelect={handleSelectSuggestion}
          onClose={() => setShowSuggestions(false)}
        />
      )}

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && query.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-md bg-[#1a1a1a] border border-white/10 shadow-xl z-[100] overflow-hidden">
          <div className="p-2">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-medium text-[#808080]">Recent Searches</span>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-[#808080] hover:text-white transition"
              >
                Clear All
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectRecent(search)}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-[#b3b3b3] hover:bg-[#2a2a2a] hover:text-white rounded transition"
                >
                  <svg className="h-4 w-4 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}