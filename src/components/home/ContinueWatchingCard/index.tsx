'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { ContinueWatchingItem } from '@/hooks/useContinueWatching'
import { cn } from '@/lib/utils/cn'

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem
  className?: string
}

export function ContinueWatchingCard({
  item,
  className,
}: ContinueWatchingCardProps) {
  const posterUrl = item.posterPath
    ? `https://image.tmdb.org/t/p/w342${item.posterPath}`
    : null

  const progress = Math.max(0, Math.min(100, item.progress ?? 0))

  return (
    <div className={cn('group relative', className)}>
      <Link
        href={item.watchHref}
        className="block overflow-hidden rounded-md card-zoom"
      >
        <div className="relative aspect-[2/3]">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={item.title}
              fill
              sizes="200px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              quality={80}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cinevin-surface to-cinevin-dark">
              <span className="text-4xl font-bold text-cinevin-text-dim">
                {item.title?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          )}

          {/* Hover play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Play className="h-7 w-7 fill-white text-white" />
            </div>
          </div>

          {/* Episode badge */}
          {item.mediaType === 'tv' && item.season && item.episode && (
            <div className="absolute right-2 top-2">
              <span className="rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                S{item.season} E{item.episode}
              </span>
            </div>
          )}

          {/* Progress bar */}
          {progress > 0 && (
            <div className="absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-cinevin-red transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </Link>

      <div className="mt-2">
        <p className="truncate text-sm font-medium text-white">{item.title}</p>
        <p className="mt-0.5 truncate text-xs text-cinevin-text-dim">
          {item.mediaType === 'movie'
            ? 'Movie'
            : `S${item.season ?? 1} E${item.episode ?? 1}`}
          {progress > 0 && ` • ${Math.round(progress)}%`}
        </p>
      </div>
    </div>
  )
}