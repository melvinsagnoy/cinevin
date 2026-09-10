'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils/helpers'
import { cn } from '@/lib/utils/cn'

interface Episode {
  id: number
  episode_number: number
  name: string
  overview: string
  still_path: string | null
  air_date: string | null
  runtime: number | null
}

interface EpisodeListProps {
  showId: number
  seasonNumber: number
  episodes: Episode[]
  /** Set of episode numbers that are marked as watched */
  watchedEpisodeNumbers?: Set<number>
  className?: string
}

export function EpisodeList({
  showId,
  seasonNumber,
  episodes,
  watchedEpisodeNumbers = new Set(),
  className,
}: EpisodeListProps) {
  if (!episodes || episodes.length === 0) {
    return (
      <div className={cn('py-12 text-center', className)}>
        <p className="text-cinevin-text-dim">
          No episodes available for this season.
        </p>
      </div>
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {episodes.map((episode) => {
        const isWatched = watchedEpisodeNumbers.has(episode.episode_number)

        return (
          <div
            key={episode.id}
            className="flex flex-col gap-4 rounded-lg border border-cinevin-border bg-cinevin-surface/50 p-4 transition hover:bg-cinevin-surface sm:flex-row"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full flex-shrink-0 overflow-hidden rounded-md bg-cinevin-dark sm:w-56">
              {episode.still_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                  alt={episode.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 224px"
                  className="object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-cinevin-text-dim">
                  <svg
                    className="h-10 w-10"
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

              {/* Episode number badge */}
              <div className="absolute left-2 top-2 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                EP {episode.episode_number}
              </div>

              {/* Watched check */}
              {isWatched && (
                <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-cinevin-red">
                  <Check className="h-3.5 w-3.5 text-white" />
                </div>
              )}

              {/* Runtime */}
              {episode.runtime && (
                <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                  {episode.runtime}m
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="truncate text-base font-semibold text-white">
                    {episode.name}
                  </h4>
                  {episode.air_date && (
                    <p className="text-xs text-cinevin-text-dim">
                      {formatDate(episode.air_date)}
                    </p>
                  )}
                </div>
                <Link
                  href={`/watch/tv/${showId}?season=${seasonNumber}&episode=${episode.episode_number}`}
                  className="shrink-0"
                >
                  <Button size="sm" variant="light">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Watch
                  </Button>
                </Link>
              </div>

              {episode.overview && (
                <p className="line-clamp-3 text-sm text-cinevin-text-muted">
                  {episode.overview}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}