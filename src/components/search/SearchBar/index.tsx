'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search as SearchIcon, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/Button'
import { SearchSuggestions } from '../SearchSuggestions'

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

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (saved) setRecentSearches(JSON.parse(saved))
    } catch {}
  }, [])

  const saveRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) return
    const updated = [
      searchTerm.trim(),
      ...recentSearches.filter(
        s => s.toLowerCase() !== searchTerm.trim().toLowerCase()
      ),
    ].slice(0, MAX_RECENT_SEARCHES)
    setRecentSearches(updated)
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch {}
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch {}
  }

  useEffect(() => {
    if (debouncedQuery.length >= 2 && onSearch) onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowRecent(false)
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus on mount
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150)
      return () => clearTimeout(timer)
    }
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length >= 2) {
      saveRecentSearch(trimmed)
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      if (onClose) onClose()
      setShowRecent(false)
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (searchTerm: string) => {
    setQuery(searchTerm)
    setShowSuggestions(false)
    setShowRecent(false)
    if (onClose) onClose()
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
    inputRef.current?.focus()
  }

  const handleClose = () => {
    setShowRecent(false)
    setShowSuggestions(false)
    if (onClose) onClose()
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2 rounded-lg border border-cinevin-border bg-cinevin-surface p-1 transition-colors focus-within:border-cinevin-red">
          {/* Search icon */}
          <div className="pl-3 pr-1 text-cinevin-text-dim">
            <SearchIcon className="h-4 w-4" />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            className="flex-1 bg-transparent py-2.5 text-sm text-white placeholder-cinevin-text-dim focus:outline-none"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="rounded-full p-1 text-cinevin-text-dim transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Cancel */}
          {onClose && (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md px-3 py-2 text-sm font-medium text-cinevin-text-muted transition hover:text-white"
            >
              Cancel
            </button>
          )}

          {/* Search submit */}
          <Button type="submit" size="sm" className="rounded-md">
            Search
          </Button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && query.length >= 2 && (
        <SearchSuggestions
          query={query}
          onSelect={handleSelectSuggestion}
          onClose={() => setShowSuggestions(false)}
        />
      )}

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && query.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-cinevin-border bg-cinevin-surface shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between border-b border-cinevin-border px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cinevin-text-dim">
              Recent
            </span>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-cinevin-text-dim transition hover:text-white"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleSelectRecent(search)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-cinevin-text-muted transition hover:bg-white/5 hover:text-white"
              >
                <SearchIcon className="h-3.5 w-3.5 text-cinevin-text-dim" />
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}