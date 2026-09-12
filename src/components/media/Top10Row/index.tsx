'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MediaItem } from '@/types/media'
import { Top10Card } from '../Top10Card'
import { cn } from '@/lib/utils/cn'

interface Top10RowProps {
  title: string
  items: MediaItem[]
  seeAllLink?: string
  showRecentlyAdded?: boolean
  className?: string
}

export function Top10Row({
  title,
  items,
  seeAllLink,
  showRecentlyAdded = true,
  className,
}: Top10RowProps) {
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

  const top10 = items.slice(0, 10)
  if (top10.length === 0) return null

  return (
    <section className={cn('space-y-4', className)}>
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

      <div className="group/row relative">
        <button
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-0 top-1/2 z-30 hidden -translate-y-1/2 rounded-r-lg bg-black/70 p-2 text-white backdrop-blur-sm transition md:block',
            canScrollLeft
              ? 'opacity-0 group-hover/row:opacity-100'
              : 'pointer-events-none opacity-0'
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/*
          Overflow-x-auto for horizontal scroll.
          Left padding gives the rank numbers room.
          Right padding creates gap.
        */}
        <div
          ref={scrollRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-4 py-6 md:px-[4%]"
        >
          {top10.map((item, index) => (
            <Top10Card
              key={`${item.mediaType}-${item.id}`}
              item={item}
              rank={index + 1}
              isRecentlyAdded={showRecentlyAdded}
            />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-1/2 z-30 hidden -translate-y-1/2 rounded-l-lg bg-black/70 p-2 text-white backdrop-blur-sm transition md:block',
            canScrollRight
              ? 'opacity-0 group-hover/row:opacity-100'
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