'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MediaItem } from '@/types/media'
import { getPosterUrl } from '@/lib/utils/helpers'
import { cn } from '@/lib/utils/cn'

interface Top10PortraitCardProps {
  item: MediaItem
  rank: number
  isRecentlyAdded?: boolean
  hasNewEpisode?: boolean
  className?: string
}

export function Top10PortraitCard({
  item,
  rank,
  isRecentlyAdded = false,
  hasNewEpisode = false,
  className,
}: Top10PortraitCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const posterUrl = getPosterUrl(item.posterPath, 'large')

  const detailsHref =
    item.mediaType === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`

  return (
    <Link
      href={detailsHref}
      className={cn(
        'group relative flex flex-none items-end',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Rank ${rank}: ${item.title}`}
    >
      {/*
        Fixed-size container.
        - Width  = number width (110px) + gap + poster width (170px) 
        - Poster overlaps the right ~55% of the number
      */}
      <div className="relative h-[255px] w-[240px] md:h-[315px] md:w-[290px]">
        {/* Giant outlined rank number — anchored to bottom-left */}
        <span
          className={cn(
            'pointer-events-none absolute bottom-[-6px] left-0 select-none font-black',
            'text-[280px] md:text-[340px]',
            'leading-none',
            'text-transparent',
            '[-webkit-text-stroke:3px_rgba(120,120,120,0.5)]',
            'md:[-webkit-text-stroke:4px_rgba(120,120,120,0.5)]',
            'transition-opacity duration-300',
            isHovered && 'opacity-25'
          )}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          aria-hidden="true"
        >
          {rank}
        </span>

        {/* Poster — anchored to bottom-right of container */}
        <div
          className={cn(
            'absolute bottom-0 right-0 z-10',
            'aspect-[2/3] w-[150px] md:w-[180px]',
            'overflow-hidden rounded-md bg-cinevin-surface',
            'transition-all duration-300',
            isHovered && 'scale-[1.03] shadow-2xl shadow-black/80'
          )}
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={item.title}
              fill
              sizes="180px"
              className="object-cover"
              loading="lazy"
              quality={80}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-cinevin-surface">
              <span className="text-cinevin-text-dim text-xs">No image</span>
            </div>
          )}

          {hasNewEpisode && (
            <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1">
              <span className="whitespace-nowrap rounded-sm bg-cinevin-red px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
                New Episode
              </span>
              <span className="whitespace-nowrap rounded-sm bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-black shadow-lg">
                Watch Now
              </span>
            </div>
          )}

          {isRecentlyAdded && !hasNewEpisode && (
            <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-t-sm bg-cinevin-red px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white shadow-lg">
              Recently Added
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}