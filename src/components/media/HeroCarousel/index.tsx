'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Volume2, Play, Info } from 'lucide-react'
import { MediaItem } from '@/types/media'
import {
  getBackdropUrl,
  getPosterUrl,
  formatRuntime,
  formatYear,
  truncateText,
} from '@/lib/utils/helpers'
import { Rating } from '@/components/ui/Rating'
import { cn } from '@/lib/utils/cn'

interface HeroCarouselProps {
  items: MediaItem[]
  /** Auto-rotate interval in ms. Set to 0 to disable auto-rotation */
  autoRotateInterval?: number
}

export function HeroCarousel({
  items,
  autoRotateInterval = 8000,
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const slides = items.slice(0, 5) // max 5 featured
  const activeItem = slides[activeIndex]

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(index)
    },
    []
  )

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-rotate
  useEffect(() => {
    if (autoRotateInterval <= 0 || isPaused || slides.length <= 1) return

    timerRef.current = setInterval(goNext, autoRotateInterval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoRotateInterval, isPaused, goNext, slides.length, activeIndex])

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev])

  if (!activeItem) return null

  const mediaType = activeItem.mediaType
  const backdropUrl = activeItem.backdropPath
    ? getBackdropUrl(activeItem.backdropPath)
    : null

  const year = activeItem.releaseDate
    ? formatYear(activeItem.releaseDate)
    : activeItem.firstAirDate
    ? formatYear(activeItem.firstAirDate)
    : null

  const watchHref =
    mediaType === 'movie'
      ? `/watch/movie/${activeItem.id}`
      : `/watch/tv/${activeItem.id}?season=1&episode=1`

  const detailsHref =
    mediaType === 'movie'
      ? `/movies/${activeItem.id}`
      : `/tv/${activeItem.id}`

  return (
    <div className="relative w-full px-4 pt-4 md:px-8 md:pt-6">
      {/* Outer rounded card */}
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured movies and TV shows"
      >
        {/* Slides — stacked, only active is visible */}
        {slides.map((item, idx) => {
          const isActive = idx === activeIndex
          const bgUrl = item.backdropPath
            ? getBackdropUrl(item.backdropPath)
            : null

          return (
            <div
              key={`${item.mediaType}-${item.id}`}
              className={cn(
                'transition-opacity duration-700',
                isActive
                  ? 'opacity-100 z-10'
                  : 'pointer-events-none opacity-0 absolute inset-0 z-0'
              )}
              aria-hidden={!isActive}
            >
              <div className="relative aspect-[16/9] w-full md:aspect-[21/9] lg:aspect-[2.4/1]">
                {bgUrl ? (
                  <Image
                    src={bgUrl}
                    alt={item.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={idx === 0}
                    quality={90}
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-cinevin-surface to-cinevin-dark" />
                )}

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
              </div>
            </div>
          )
        })}

        {/* Audio toggle — top right */}
        <button
          onClick={(e) => {
            e.preventDefault()
            setMuted(!muted)
          }}
          className="absolute right-6 top-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/60"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          <Volume2
            className={cn('h-5 w-5', muted ? 'opacity-40' : 'opacity-100')}
          />
        </button>

        {/* Content — pointer-events-none wrapper so it doesn't block slide stacking */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-12 lg:p-16">
          <div className="max-w-3xl space-y-4 md:space-y-5">
            {/* Title (animated per slide) */}
            <h1
              key={`title-${activeItem.id}`}
              className="text-shadow-xl animate-fade-in text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              {activeItem.title}
            </h1>

            {activeItem.tagline && (
              <p className="text-shadow animate-fade-in text-sm text-zinc-300 md:text-base lg:text-lg">
                {activeItem.tagline}
              </p>
            )}

            {/* Metadata */}
            <div className="text-shadow flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white md:text-base">
              <span className="font-semibold">
                {mediaType === 'movie' ? 'Movie' : 'TV Show'}
              </span>

              {activeItem.genres?.slice(0, 2).map((genre) => (
                <span key={genre.id}>
                  <span className="mr-3 text-zinc-400">·</span>
                  {genre.name}
                </span>
              ))}

              {year && (
                <span>
                  <span className="mr-3 text-zinc-400">·</span>
                  {year}
                </span>
              )}

              {mediaType === 'movie' && activeItem.runtime && (
                <span>
                  <span className="mr-3 text-zinc-400">·</span>
                  {formatRuntime(activeItem.runtime)}
                </span>
              )}

              <span>
                <span className="mr-3 text-zinc-400">·</span>
                <Rating
                  rating={activeItem.voteAverage}
                  size="sm"
                  showValue={false}
                />
              </span>
            </div>

            {/* Description */}
            <p className="hidden max-w-2xl text-shadow text-sm text-zinc-200 md:block md:text-base lg:text-lg">
              {truncateText(activeItem.overview, 220)}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={watchHref}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-bold text-black transition-all duration-200 hover:bg-white/90 hover:scale-[1.03] active:scale-95"
              >
                <Play className="h-6 w-6 fill-black" strokeWidth={0} />
                Play
              </Link>

              <Link
                href={detailsHref}
                className="inline-flex items-center gap-2 rounded-full bg-white/25 px-7 py-3 text-base font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/35 hover:scale-[1.03] active:scale-95"
              >
                <Info className="h-6 w-6" />
                More Info
              </Link>
            </div>
          </div>
        </div>

        {/* Slide indicators — bottom center */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  idx === activeIndex
                    ? 'w-8 bg-white'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                )}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === activeIndex}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}