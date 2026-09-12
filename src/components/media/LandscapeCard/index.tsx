'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Play,
  Plus,
  Check,
  ThumbsUp,
  ChevronDown,
  Volume2,
} from 'lucide-react'
import { MediaItem } from '@/types/media'
import { getBackdropUrl, getPosterUrl } from '@/lib/utils/helpers'
import { useMyList } from '@/hooks/useMyList'
import { cn } from '@/lib/utils/cn'

interface LandscapeCardProps {
  item: MediaItem
  isRecentlyAdded?: boolean
  isTopTen?: boolean
  hasNewEpisode?: boolean
  className?: string
}

type PanelAlign = 'left' | 'center' | 'right'

export function LandscapeCard({
  item,
  isRecentlyAdded = false,
  isTopTen = false,
  hasNewEpisode = false,
  className,
}: LandscapeCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [panelAlign, setPanelAlign] = useState<PanelAlign>('center')
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const { isInList, toggle } = useMyList()

  const imageUrl = item.backdropPath
    ? getBackdropUrl(item.backdropPath, 'medium')
    : getPosterUrl(item.posterPath, 'large')

  const detailsHref =
    item.mediaType === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`

  const watchHref =
    item.mediaType === 'movie'
      ? `/watch/movie/${item.id}`
      : `/watch/tv/${item.id}?season=1&episode=1`

  const inList = isInList(item.id, item.mediaType)

  // Detect whether the panel would overflow the viewport
  const detectAlignment = useCallback(() => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const panelWidth = 380
    const panelHalf = panelWidth / 2
    const cardCenterX = rect.left + rect.width / 2

    if (cardCenterX - panelHalf < 16) {
      setPanelAlign('left')
    } else if (cardCenterX + panelHalf > viewportWidth - 16) {
      setPanelAlign('right')
    } else {
      setPanelAlign('center')
    }
  }, [])

  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    hoverTimerRef.current = setTimeout(() => {
      detectAlignment()
      setIsHovered(true)
    }, 400)
  }

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    leaveTimerRef.current = setTimeout(() => setIsHovered(false), 200)
  }

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
    }
  }, [])

  const handleMyList = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle({
      tmdbId: item.id,
      mediaType: item.mediaType,
      title: item.title,
      posterPath: item.posterPath,
    })
  }

  const panelPositionClass =
    panelAlign === 'left'
      ? 'left-0'
      : panelAlign === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2'

  return (
    <div
      ref={cardRef}
      className={cn(
        'hover-card-wrapper relative',
        isHovered && 'is-hovered',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Default landscape card */}
      <Link
        href={detailsHref}
        className="relative block overflow-hidden rounded-md"
        aria-hidden={isHovered}
      >
        <div className="relative aspect-video w-full bg-cinevin-surface">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              sizes="320px"
              className="object-cover"
              loading="lazy"
              quality={80}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-cinevin-surface">
              <span className="text-cinevin-text-dim text-xs">No image</span>
            </div>
          )}

          {isTopTen && (
            <div className="absolute left-2 top-2 z-10 flex flex-col items-center gap-0.5 rounded-sm bg-cinevin-red px-1.5 py-1 text-[9px] font-black leading-none text-white">
              <span>TOP</span>
              <span>10</span>
            </div>
          )}

          {hasNewEpisode && (
                <div className="absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 gap-1">
                    <span className="rounded-t-sm bg-cinevin-red px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                    New Episode
                    </span>
                    <span className="rounded-t-sm bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-black shadow-lg">
                    Watch Now
                    </span>
                </div>
                )}

                {isRecentlyAdded && !hasNewEpisode && (
                <div className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2 rounded-t-sm bg-cinevin-red px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                    Recently Added
                </div>
                )}
        </div>
      </Link>

      {/* Hover panel — centered above the card, floats outward */}
      {isHovered && (
        <div
          className={cn(
            'hover-card-panel absolute top-0',
            panelPositionClass
          )}
          style={{ width: '380px' }}
        >
          {/* Landscape image */}
          <Link href={detailsHref} className="block">
            <div className="relative aspect-video w-full bg-cinevin-surface">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={item.title}
                  fill
                  sizes="380px"
                  className="object-cover"
                  quality={85}
                />
              ) : null}

              {/* C logo top-left */}
              <div className="absolute left-3 top-3 text-2xl font-black text-cinevin-red drop-shadow-lg">
                C
              </div>

              {/* Volume icon top-right */}
              <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-sm">
                <Volume2 className="h-4 w-4" />
              </div>

              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
            </div>
          </Link>

          {/* Info & Buttons */}
          <div className="space-y-3 bg-[#141414] p-4">
            <div className="flex items-center gap-2">
              <Link
                href={watchHref}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:bg-white/90"
                aria-label="Play"
              >
                <Play className="h-4 w-4 fill-black" strokeWidth={0} />
              </Link>

              <button
                onClick={handleMyList}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition',
                  inList
                    ? 'border-white bg-white text-black'
                    : 'border-white/60 bg-black/40 text-white hover:border-white'
                )}
                aria-label={inList ? 'Remove from My List' : 'Add to My List'}
              >
                {inList ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  <Plus className="h-4 w-4" strokeWidth={2.5} />
                )}
              </button>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-black/40 text-white transition hover:border-white"
                aria-label="Like"
              >
                <ThumbsUp className="h-4 w-4" />
              </button>

              <Link
                href={detailsHref}
                className="ml-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-black/40 text-white transition hover:border-white"
                aria-label="More Info"
              >
                <ChevronDown className="h-4 w-4" />
              </Link>
            </div>

            {/* Title */}
            <p className="text-sm font-semibold text-white">{item.title}</p>

            {/* Genres */}
            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
                {item.genres.slice(0, 3).map((genre, idx) => (
                  <span
                    key={genre.id}
                    className="flex items-center gap-2 text-white/80"
                  >
                    {idx > 0 && <span className="text-white/40">•</span>}
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}