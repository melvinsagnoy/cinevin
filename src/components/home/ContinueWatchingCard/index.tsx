'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { ContinueWatchingItem } from '@/hooks/useContinueWatching'
import { getBackdropUrl } from '@/lib/utils/helpers'
import { cn } from '@/lib/utils/cn'

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem
  className?: string
}

export function ContinueWatchingCard({
  item,
  className,
}: ContinueWatchingCardProps) {
  // Continue watching prefers backdrop (landscape) like Netflix
  const imageUrl = item.backdropPath
    ? getBackdropUrl(item.backdropPath, 'medium')
    : item.posterPath
    ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
    : null

  const progress = Math.max(0, Math.min(100, item.progress ?? 0))

  return (
    <div className={cn('group relative', className)}>
      <Link
        href={item.watchHref}
        className="block overflow-hidden rounded-md transition-all duration-300 hover:scale-[1.03]"
      >
        <div className="relative aspect-video w-full bg-cinevin-surface">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.title}
              fill
              sizes="320px"
              className="object-cover"
              loading="lazy"
              quality={80}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-cinevin-surface">
              <span className="text-cinevin-text-dim text-xs">No image</span>
            </div>
          )}

          {/* Hover play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
              <Play className="h-7 w-7 fill-white text-white" />
            </div>
          </div>

          {/* Episode badge — top-right */}
          {item.mediaType === 'tv' && item.season && item.episode && (
            <div className="absolute right-2 top-2">
              <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                S{item.season} E{item.episode}
              </span>
            </div>
          )}

          {/* Progress bar — bottom of card */}
          {progress > 0 && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/25">
              <div
                className="h-full bg-cinevin-red transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </Link>

      {/* Meta */}
      <div className="mt-2 space-y-0.5">
        <p className="truncate text-sm font-medium text-white">{item.title}</p>
        <p className="truncate text-xs text-cinevin-text-dim">
          {item.mediaType === 'movie'
            ? 'Movie'
            : `S${item.season ?? 1} E${item.episode ?? 1}`}
          {progress > 0 && ` · ${Math.round(progress)}%`}
        </p>
      </div>
    </div>
  )
}