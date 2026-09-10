'use client'

import { useState, useEffect } from 'react'
import { useWatchHistory } from '@/hooks/useWatchHistory'
import { SeasonSelector } from '../SeasonSelector'
import { EpisodeList } from '../EpisodeList'
import { CardSkeleton } from '@/components/ui/Skeleton'

interface Season {
  id: number
  season_number: number
  name?: string
  episode_count?: number
}

interface EpisodesSectionProps {
  showId: number
  seasons: Season[]
}

interface SeasonData {
  episodes: any[]
}

export function EpisodesSection({ showId, seasons }: EpisodesSectionProps) {
  // Start from Season 1 (or the first available season)
  const initialSeason = seasons[0]?.season_number ?? 1
  const [selectedSeason, setSelectedSeason] = useState<number>(initialSeason)
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { history } = useWatchHistory()

  // Compute watched episodes for current season
  const watchedEpisodeNumbers = new Set<number>()
  history
    .filter(
      (item) =>
        item.mediaType === 'tv' &&
        item.tmdbId === showId &&
        item.season === selectedSeason
    )
    .forEach((item) => {
      if (item.episode !== undefined) {
        watchedEpisodeNumbers.add(item.episode)
      }
    })

  // Fetch season data when selected season changes
  useEffect(() => {
    let cancelled = false

    const fetchSeason = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/tv/${showId}/season/${selectedSeason}`
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (cancelled) return
        setSeasonData({ episodes: data.episodes || [] })
      } catch (err) {
        if (cancelled) return
        console.error('Failed to fetch season:', err)
        setError('Failed to load episodes. Please try again.')
      } finally {
        if (cancelled) return
        setIsLoading(false)
      }
    }

    fetchSeason()
    return () => {
      cancelled = true
    }
  }, [showId, selectedSeason])

  if (!seasons || seasons.length === 0) return null

  return (
    <div className="container-cinevin py-8">
      <h2 className="mb-6 text-2xl font-bold text-white">Episodes</h2>

      {/* Season selector */}
      <SeasonSelector
        seasons={seasons}
        selectedSeason={selectedSeason}
        onSelect={setSelectedSeason}
        className="mb-6"
      />

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-lg border border-cinevin-border bg-cinevin-surface/50 p-4 sm:flex-row"
            >
              <div className="aspect-video w-full flex-shrink-0 animate-pulse rounded-md bg-cinevin-surface sm:w-56" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-cinevin-surface" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-cinevin-surface" />
                <div className="h-3 w-full animate-pulse rounded bg-cinevin-surface" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="mb-4 text-cinevin-text-dim">{error}</p>
          <button
            onClick={() => setSelectedSeason(selectedSeason)}
            className="rounded bg-cinevin-red px-4 py-2 text-white transition hover:bg-cinevin-red-hover"
          >
            Retry
          </button>
        </div>
      )}

      {/* Episode list */}
      {!isLoading && !error && seasonData && (
        <EpisodeList
          showId={showId}
          seasonNumber={selectedSeason}
          episodes={seasonData.episodes}
          watchedEpisodeNumbers={watchedEpisodeNumbers}
        />
      )}
    </div>
  )
}