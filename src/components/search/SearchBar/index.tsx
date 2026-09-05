'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/ui/Button'

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
  placeholder = 'Search...',
  autoFocus = false,
  onClose,
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialValue)
  const debouncedQuery = useDebounce(query, 500) // Increased delay
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (debouncedQuery.length >= 2 && onSearch) {
      onSearch(debouncedQuery)
    }
  }, [debouncedQuery, onSearch])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (trimmedQuery.length >= 2) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`)
      if (onClose) onClose()
    }
  }

  const handleClear = () => {
    setQuery('')
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
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
          onChange={(e) => setQuery(e.target.value)}
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
              onClick={onClose}
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
  )
}