'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils/helpers'

interface Episode {
  id: number
  episode_number: number
  name: string
  overview: string
  still_path: string | null
  air_date: string | null
  runtime: number | null
}

interface Season {
  id: number
  season_number: number
  episodes: Episode[]
}

interface EpisodesSectionProps {
  showId: number
  seasons: Season[]
}

export function EpisodesSection({ showId, seasons }: EpisodesSectionProps) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0)
  
  const currentSeason = seasons[selectedSeasonIndex]

  if (!currentSeason) return null

  return (
    <div className="container-premium py-8">
      <h2 className="text-2xl font-bold text-white mb-6">Episodes</h2>
      
      {/* Season Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {seasons.map((season, index) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeasonIndex(index)}
            className={`px-6 py-2 text-sm font-medium rounded-full transition whitespace-nowrap ${
              selectedSeasonIndex === index
                ? 'bg-[#E50914] text-white'
                : 'bg-[#1a1a1a] text-[#b3b3b3] hover:bg-[#2a2a2a] hover:text-white'
            }`}
          >
            Season {season.season_number}
          </button>
        ))}
      </div>

      {/* Episodes Grid */}
      <div className="space-y-6">
        {currentSeason.episodes.map((episode) => (
          <div
            key={episode.id}
            className="flex flex-col sm:flex-row gap-4 rounded-lg p-4 transition-all duration-300 hover:bg-[#1a1a1a]"
          >
            {/* Episode Thumbnail */}
            <div className="relative w-full sm:w-64 h-36 flex-shrink-0 overflow-hidden rounded-lg bg-[#0a0a0a]">
              {episode.still_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                  alt={episode.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#808080]">
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs font-medium text-white">
                EP {episode.episode_number}
              </div>
              {episode.runtime && (
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-xs text-white">
                  {episode.runtime}m
                </div>
              )}
            </div>

            {/* Episode Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white hover:text-[#E50914] transition">
                    {episode.name}
                  </h3>
                  {episode.air_date && (
                    <p className="text-sm text-[#808080]">{formatDate(episode.air_date)}</p>
                  )}
                </div>
                {/* Watch button - DIRECT to watch page */}
                <Link href={`/tv/${showId}?season=${currentSeason.season_number}&episode=${episode.episode_number}`}>
                  <Button size="sm" className="bg-white text-black hover:bg-white/90">
                    <svg className="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch
                  </Button>
                </Link>
              </div>
              {episode.overview && (
                <p className="mt-2 text-sm text-[#b3b3b3] line-clamp-3">
                  {episode.overview}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}