'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MediaItem } from '@/types/media'
import { getBackdropUrl, getPosterUrl } from '@/lib/utils/helpers'
import { cn } from '@/lib/utils/cn'

interface Top10CardProps {
  item: MediaItem
  rank: number
  isRecentlyAdded?: boolean
  className?: string
}

export function Top10Card({
  item,
  rank,
  isRecentlyAdded = false,
  className,
}: Top10CardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const imageUrl = item.backdropPath
    ? getBackdropUrl(item.backdropPath, 'medium')
    : getPosterUrl(item.posterPath, 'large')

  const detailsHref =
    item.mediaType === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`

  return (
    <Link
      href={detailsHref}
      className={cn('group relative flex flex-none items-end', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Rank ${rank}: ${item.title}`}
    >
      <div className="relative flex items-end">
        {/*
          Giant rank number — height matches card height exactly.
          The card (~200px tall) means the number should be ~200px tall.
          Use line-height:1 and font-size ~200px so the glyph fits inside.
        */}
        <div
          className={cn(
            'pointer-events-none relative z-0 select-none font-black',
            'text-[200px] md:text-[240px]', // ← bigger, but line-height:1 keeps box tight
            'leading-none',
            'text-transparent',
            '[-webkit-text-stroke:4px_rgba(150,150,150,0.5)]',
            'md:[-webkit-text-stroke:5px_rgba(150,150,150,0.5)]',
            'transition-all duration-300',
            '-mr-[40%]',
            isHovered && 'opacity-40'
          )}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
          aria-hidden="true"
        >
          {rank}
        </div>

        {/* Card — landscape 16:9 */}
        <div
          className={cn(
            'relative z-10 aspect-video w-[180px] flex-shrink-0 overflow-hidden rounded-md bg-cinevin-surface md:w-[220px]',
            'transition-all duration-300',
            isHovered && 'scale-[1.05] shadow-2xl shadow-black/80'
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              sizes="220px"
              className="object-cover"
              loading="lazy"
              quality={80}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-cinevin-surface">
              <span className="text-cinevin-text-dim text-xs">No image</span>
            </div>
          )}

          {isRecentlyAdded && (
            <div className="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-t-sm bg-cinevin-red px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
              Recently Added
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}