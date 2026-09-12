'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Volume2 } from 'lucide-react'
import { MediaItem } from '@/types/media'
import {
  getBackdropUrl,
  getPosterUrl,
  formatDate,
  formatRuntime,
  formatYear,
  truncateText,
} from '@/lib/utils/helpers'
import { Rating } from '@/components/ui/Rating'
import { HeroButtons } from './HeroButtons'
import { HeroBadges } from './HeroBadges'

interface HeroProps {
  item: MediaItem & {
    tagline?: string | null
    runtime?: number | null
    releaseDate?: string
    firstAirDate?: string
    genres?: { id: number; name: string }[]
  }
  mediaType: 'movie' | 'tv'
  /** Rank within trending for "Top 10" badge (1-10 or null) */
  rank?: number | null
  /** Show "Recently Added" badge */
  isRecentlyAdded?: boolean
}

export function Hero({
  item,
  mediaType,
  rank = null,
  isRecentlyAdded = true,
}: HeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [muted, setMuted] = useState(true)

  const backdropUrl = item.backdropPath
    ? getBackdropUrl(item.backdropPath)
    : null
  const posterUrl = item.posterPath
    ? getPosterUrl(item.posterPath, 'large')
    : null

  const year =
    mediaType === 'movie'
      ? item.releaseDate
        ? formatYear(item.releaseDate)
        : null
      : item.firstAirDate
      ? formatYear(item.firstAirDate)
      : null

  const date =
    mediaType === 'movie'
      ? item.releaseDate
        ? formatDate(item.releaseDate)
        : null
      : item.firstAirDate
      ? formatDate(item.firstAirDate)
      : null

  const genreList = item.genres || []

  const watchHref =
    mediaType === 'movie'
      ? `/watch/movie/${item.id}`
      : `/watch/tv/${item.id}?season=1&episode=1`

  const detailsHref =
    mediaType === 'movie' ? `/movies/${item.id}` : `/tv/${item.id}`

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative w-full px-4 pt-4 md:px-8 md:pt-6">
      {/* Outer rounded card — Netflix style */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
        }`}
      >
        {/* Backdrop image */}
        <div className="relative aspect-[16/9] w-full md:aspect-[21/9] lg:aspect-[2.4/1]">
          {backdropUrl ? (
            <Image
              src={backdropUrl}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              quality={90}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-cinevin-surface to-cinevin-dark" />
          )}

          {/* Gradient overlays — Netflix style */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Audio/subtitle toggle — top right */}
        <button
          onClick={() => setMuted(!muted)}
          className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/60 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/60"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          <Volume2
            className={`h-5 w-5 ${muted ? 'opacity-40' : 'opacity-100'}`}
          />
        </button>

        {/* Content — bottom-left aligned */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-12 lg:p-16">
          <div className="max-w-3xl space-y-4 md:space-y-5">
            {/* Title — large, bold, with shadow */}
            <h1 className="text-shadow-xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              {item.title}
            </h1>

            {item.tagline && (
              <p className="text-shadow text-sm text-zinc-300 md:text-base lg:text-lg">
                {item.tagline}
              </p>
            )}

            {/* Metadata row */}
            <div className="text-shadow flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white md:text-base">
              <span className="font-semibold">
                {mediaType === 'movie' ? 'Movie' : 'TV Show'}
              </span>

              {genreList.slice(0, 2).map((genre) => (
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

              {mediaType === 'movie' && item.runtime && (
                <span>
                  <span className="mr-3 text-zinc-400">·</span>
                  {formatRuntime(item.runtime)}
                </span>
              )}

              {mediaType === 'tv' && (
                <span>
                  <span className="mr-3 text-zinc-400">·</span>
                  TV Series
                </span>
              )}

              <span>
                <span className="mr-3 text-zinc-400">·</span>
                <Rating rating={item.voteAverage} size="sm" showValue={false} />
              </span>
            </div>

            {/* Description — hidden on small screens to keep hero compact */}
            <p className="hidden max-w-2xl text-shadow text-sm text-zinc-200 md:block md:text-base lg:text-lg">
              {truncateText(item.overview, 220)}
            </p>

            {/* Play + More Info */}
            <HeroButtons watchHref={watchHref} detailsHref={detailsHref} />
          </div>
        </div>

        {/* Bottom-right badges */}
        <HeroBadges
          posterPath={item.posterPath}
          rank={rank}
        />
      </div>
    </div>
  )
}