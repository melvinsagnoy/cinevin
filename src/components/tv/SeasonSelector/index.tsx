'use client'

import { cn } from '@/lib/utils/cn'

interface Season {
  id: number
  season_number: number
  name?: string
  episode_count?: number
}

interface SeasonSelectorProps {
  seasons: Season[]
  selectedSeason: number
  onSelect: (seasonNumber: number) => void
  className?: string
}

export function SeasonSelector({
  seasons,
  selectedSeason,
  onSelect,
  className,
}: SeasonSelectorProps) {
  if (!seasons || seasons.length === 0) return null

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-cinevin-text-muted">
        Seasons
      </h3>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
        {seasons.map((season) => {
          const isActive = selectedSeason === season.season_number
          return (
            <button
              key={season.id}
              onClick={() => onSelect(season.season_number)}
              className={cn(
                'shrink-0 rounded-md px-4 py-2 text-sm font-semibold transition',
                isActive
                  ? 'bg-cinevin-red text-white shadow-lg shadow-cinevin-red/20'
                  : 'bg-cinevin-surface text-cinevin-text-muted hover:bg-cinevin-surface-hover hover:text-white'
              )}
              aria-pressed={isActive}
            >
              {season.name || `Season ${season.season_number}`}
            </button>
          )
        })}
      </div>
    </div>
  )
}