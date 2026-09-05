'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { MediaItem } from '@/types/media'
import { MediaCard } from '../MediaCard'
import { cn } from '@/lib/utils/cn'

interface MediaRowProps {
  title: string
  items: MediaItem[]
  seeAllLink?: string
  className?: string
  loading?: boolean
}

export function MediaRow({ title, items, seeAllLink, className, loading }: MediaRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const checkScroll = () => {
    if (!scrollContainerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    const container = scrollContainerRef.current
    const scrollAmount = container.clientWidth * 0.8
    const targetScroll = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount
    container.scrollTo({ left: targetScroll, behavior: 'smooth' })
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => container.removeEventListener('scroll', checkScroll)
    }
  }, [items])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-[#1a1a1a]" />
          ))}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className={`flex items-center justify-between px-4 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {seeAllLink && (
          <Link 
            href={seeAllLink} 
            className="text-sm text-[#b3b3b3] transition-all duration-300 hover:text-white hover:scale-105"
          >
            See All →
          </Link>
        )}
      </div>
      
      <div className="relative group">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-r-lg bg-black/50 p-2 text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 ${
            showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll left"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div
          ref={scrollContainerRef}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-4 pb-4 scroll-smooth"
        >
          {items.map((item, index) => (
            <div key={`${item.mediaType}-${item.id}`} className="flex-none w-[160px] md:w-[200px]">
              <MediaCard item={item} size="medium" index={index} />
            </div>
          ))}
        </div>
        
        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-l-lg bg-black/50 p-2 text-white transition-all duration-300 hover:bg-black/70 hover:scale-110 ${
            showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll right"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}