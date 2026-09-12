'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaItem } from '@/types/media'
import { LandscapeCard } from '../LandscapeCard'
import { cn } from '@/lib/utils/cn'

interface LandscapeRowProps {
  title: string
  items: MediaItem[]
  seeAllLink?: string
  /** Show "Recently Added" badge on all cards */
  showRecentlyAdded?: boolean
  /** Show "TOP 10" small badge on all cards */
  showTopTen?: boolean
  className?: string
}

export function LandscapeRow({
  title,
  items,
  seeAllLink,
  showRecentlyAdded = true,
  showTopTen = false,
  className,
}: LandscapeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth * 0.8
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll)
    checkScroll()
    return () => el.removeEventListener('scroll', checkScroll)
  }, [items])

  if (items.length === 0) return null

  return (
    <section className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="container-cinevin flex items-center justify-between">
        <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
        {seeAllLink && (
          <Link
            href={seeAllLink}
            className="text-sm text-cinevin-text-muted transition hover:text-white"
          >
            See All →
          </Link>
        )}
      </div>

      {/* Row */}
      <div className="group relative">
        <button
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-r-lg bg-black/70 p-2 text-white backdrop-blur-sm transition md:block',
            canScrollLeft
              ? 'opacity-0 group-hover:opacity-100'
              : 'pointer-events-none opacity-0'
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-3 overflow-x-auto px-4 pb-2 md:px-[4%]"
        >
          {items.map((item) => (
            <div
              key={`${item.mediaType}-${item.id}`}
              className="w-[280px] flex-none md:w-[320px]"
            >
              <LandscapeCard
                item={item}
                isRecentlyAdded={showRecentlyAdded}
                isTopTen={showTopTen}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 rounded-l-lg bg-black/70 p-2 text-white backdrop-blur-sm transition md:block',
            canScrollRight
              ? 'opacity-0 group-hover:opacity-100'
              : 'pointer-events-none opacity-0'
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  )
}