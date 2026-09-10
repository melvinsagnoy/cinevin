'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MediaItem } from '@/types/media'
import { formatYear } from '@/lib/utils/helpers'
import { Rating } from '@/components/ui/Rating'
import { MyListButton } from '@/components/ui/MyListButton'
import { cn } from '@/lib/utils/cn'

interface MediaCardProps {
  item: MediaItem
  size?: 'small' | 'medium' | 'large'
  className?: string
  index?: number
}

export function MediaCard({
  item,
  size = 'medium',
  className,
  index = 0,
}: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const posterUrl = item.posterPath
    ? `https://image.tmdb.org/t/p/${size === 'large' ? 'w500' : 'w342'}${item.posterPath}`
    : null

  const year = item.releaseDate
    ? formatYear(item.releaseDate)
    : item.firstAirDate
    ? formatYear(item.firstAirDate)
    : null

  const title = item.title || 'Unknown Title'

  // ✅ TV → /tv/{id}  |  Movie → /movies/{id}
  const detailsHref =
    item.mediaType === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`

  const sizes = {
    small: { width: 150, height: 225 },
    medium: { width: 200, height: 300 },
    large: { width: 250, height: 375 },
  }
  const currentSize = sizes[size]

  return (
    <div
      className={cn('group relative fade-in', className)}
      style={{ animationDelay: `${index * 40}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={detailsHref} className="block overflow-hidden rounded-md card-zoom">
        <div className="relative" style={{ aspectRatio: '2/3' }}>
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              sizes={`${currentSize.width}px`}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              quality={80}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-cinevin-surface">
              <svg
                className="h-12 w-12 text-cinevin-text-dim"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
          )}

          <div
            className={cn(
              'absolute inset-0 gradient-card transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          />

          <div
            className={cn(
              'absolute right-2 top-2 transition-all duration-300',
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            )}
          >
            <MyListButton
              tmdbId={item.id}
              mediaType={item.mediaType}
              title={title}
              posterPath={item.posterPath}
              releaseYear={year ? parseInt(year) : undefined}
              size="sm"
              variant="icon"
            />
          </div>

          <div className="absolute bottom-2 left-2">
            <span className="rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {item.mediaType === 'movie' ? 'Movie' : 'TV'}
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-2 space-y-1">
        <Link
          href={detailsHref}
          className="block truncate text-sm font-medium text-white transition-colors hover:text-cinevin-red"
        >
          {title}
        </Link>
        <div className="flex items-center justify-between text-xs text-cinevin-text-dim">
          <span>{year || 'N/A'}</span>
          <Rating rating={item.voteAverage || 0} size="sm" showValue={false} />
        </div>
      </div>
    </div>
  )
}