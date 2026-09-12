'use client'

import Image from 'next/image'

interface HeroBadgesProps {
  posterPath: string | null
  rank: number | null
}

export function HeroBadges({ posterPath, rank }: HeroBadgesProps) {
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w92${posterPath}`
    : null

  return (
    <div className="absolute bottom-8 right-4 z-20 flex flex-col items-end gap-2 md:right-8">
      {/* Top 10 badge — only if ranked */}
      {rank !== null && rank > 0 && rank <= 10 && (
        <div className="flex items-center gap-3 rounded-sm bg-black/60 py-2 pl-3 pr-4 backdrop-blur-md">
          {/* "Top 10" stacked squares icon */}
          <div className="flex items-center gap-0.5">
            <div className="flex flex-col gap-0.5">
              <div className="h-2 w-2 bg-cinevin-red" />
              <div className="h-2 w-2 bg-cinevin-red" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="h-2 w-2 bg-cinevin-red" />
              <div className="h-2 w-2 bg-cinevin-red" />
            </div>
            <div className="ml-1 text-[10px] font-bold text-white">
              TOP
              <br />
              10
            </div>
          </div>
          <div className="text-sm font-bold text-white">
            #{rank} in Movies Today
          </div>
        </div>
      )}

      {/* Recently Added badge */}
      <div className="flex items-center gap-2 rounded-sm bg-black/60 py-2 pl-2 pr-4 backdrop-blur-md">
        {posterUrl ? (
          <div className="relative h-8 w-6 flex-shrink-0 overflow-hidden rounded-sm">
            <Image
              src={posterUrl}
              alt="Poster"
              fill
              sizes="24px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-8 w-6 items-center justify-center rounded-sm bg-cinevin-red text-[10px] font-bold text-white">
            C
          </div>
        )}
        <span className="text-sm font-semibold text-white">
          Recently Added
        </span>
      </div>
    </div>
  )
}