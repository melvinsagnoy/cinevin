'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useContinueWatching } from '@/hooks/useContinueWatching'
import { ContinueWatchingCard } from '../ContinueWatchingCard'

export function ContinueWatchingRow() {
  const { items, loading } = useContinueWatching(15)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  // Hide entirely when there's nothing to show
  if (loading || items.length === 0) return null

  return (
    <section className="space-y-4">
      <div className="container-cinevin flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Continue Watching</h2>
        <Link
          href="/my-list"
          className="text-sm text-cinevin-text-muted transition hover:text-white"
        >
          See All →
        </Link>
      </div>

      <div className="group relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-r-lg bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100 md:block"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-4 md:px-[4%]"
        >
          {items.map(item => (
            <div
              key={`${item.mediaType}-${item.tmdbId}-${item.season ?? 0}-${item.episode ?? 0}`}
              className="w-[280px] flex-none md:w-[320px]"
            >
              <ContinueWatchingCard item={item} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-l-lg bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100 md:block"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  )
}