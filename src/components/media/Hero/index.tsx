'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MediaItem } from '@/types/media'
import { getBackdropUrl, getPosterUrl, formatDate, formatRuntime, formatYear, truncateText } from '@/lib/utils/helpers'
import { Button } from '@/components/ui/Button'
import { Rating } from '@/components/ui/Rating'
import { GenreBadge } from '@/components/ui/GenreBadge'
import { MyListButton } from '@/components/ui/MyListButton'

interface HeroProps {
  item: MediaItem & {
    tagline?: string | null
    runtime?: number | null
    releaseDate?: string
    firstAirDate?: string
    genres?: { id: number; name: string }[]
  }
  mediaType: 'movie' | 'tv'
}

export function Hero({ item, mediaType }: HeroProps) {
  const [isVisible, setIsVisible] = useState(false)
  const backdropUrl = item.backdropPath ? getBackdropUrl(item.backdropPath) : null
  const posterUrl = item.posterPath ? getPosterUrl(item.posterPath, 'large') : null
  
  const year = mediaType === 'movie'
    ? item.releaseDate ? formatYear(item.releaseDate) : null
    : item.firstAirDate ? formatYear(item.firstAirDate) : null
  const date = mediaType === 'movie'
    ? item.releaseDate ? formatDate(item.releaseDate) : null
    : item.firstAirDate ? formatDate(item.firstAirDate) : null
  const genreList = item.genres || []

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[80vh]">
      {/* Hero backdrop with zoom animation */}
      <div className={`absolute inset-0 z-0 transition-transform duration-1000 ${isVisible ? 'scale-100' : 'scale-105'}`}>
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={item.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-b from-zinc-800 to-zinc-900" />
        )}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent" />
      </div>

      {/* Hero content with fade-in animation */}
      <div className={`relative z-10 flex h-full min-h-[70vh] items-center px-4 md:min-h-[80vh] md:px-8 transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container-premium">
          <div className="max-w-2xl space-y-4 text-white">
            {/* Badge with slide-up */}
            <div className="slide-up">
              <span className="badge-red">
                {mediaType === 'movie' ? 'Movie' : 'TV Series'}
              </span>
              {year && (
                <span className="ml-2 text-sm text-[#b3b3b3]">{year}</span>
              )}
            </div>

            {/* Title with fade-in */}
            <h1 className="text-3xl font-bold text-shadow-xl md:text-5xl lg:text-7xl fade-in">
              {item.title}
            </h1>
            
            {/* Tagline */}
            {item.tagline && (
              <p className="text-sm text-[#b3b3b3] text-shadow md:text-base lg:text-lg fade-in-delay-1">
                {item.tagline}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#b3b3b3] fade-in-delay-2">
              {date && <span>{date}</span>}
              {mediaType === 'movie' && item.runtime && (
                <span>• {formatRuntime(item.runtime)}</span>
              )}
              <Rating rating={item.voteAverage} size="md" />
            </div>

            {/* Genres */}
            {genreList.length > 0 && (
              <div className="flex flex-wrap gap-2 fade-in-delay-3">
                {genreList.slice(0, 3).map((genre) => (
                  <GenreBadge key={genre.id} name={genre.name} />
                ))}
              </div>
            )}

            {/* Description */}
            <p className="max-w-xl text-sm text-[#b3b3b3] text-shadow md:text-base lg:text-lg fade-in-delay-4">
              {truncateText(item.overview, 200)}
            </p>

            {/* Buttons with scale animation */}
            <div className="flex flex-wrap gap-3 pt-2 fade-in-delay-5">
              <Link href={mediaType === 'movie' ? `/watch/movie/${item.id}` : `/tv/${item.id}?season=1&episode=1`}>
                <Button 
                  size="lg" 
                  className="min-w-[140px] bg-white text-black transition-all duration-300 hover:scale-105 hover:bg-white/90"
                >
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </Button>
              </Link>
              
              <MyListButton
                tmdbId={item.id}
                mediaType={mediaType}
                title={item.title}
                posterPath={item.posterPath}
                releaseYear={year ? parseInt(year) : undefined}
                size="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}