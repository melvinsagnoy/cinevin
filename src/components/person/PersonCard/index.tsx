'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface PersonCardProps {
  id: number
  name: string
  profilePath: string | null
  role?: string
  className?: string
}

export function PersonCard({
  id,
  name,
  profilePath,
  role,
  className,
}: PersonCardProps) {
  const imageUrl = profilePath
    ? `https://image.tmdb.org/t/p/w185${profilePath}`
    : null

  return (
    <Link
      href={`/person/${id}`}
      className={cn('group block text-center', className)}
    >
      <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full bg-cinevin-surface ring-1 ring-cinevin-border transition-all duration-300 group-hover:ring-2 group-hover:ring-cinevin-red">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="120px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-cinevin-text-dim">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <p className="mt-3 truncate text-sm font-semibold text-white transition-colors group-hover:text-cinevin-red">
        {name}
      </p>
      {role && (
        <p className="mt-0.5 truncate text-xs text-cinevin-text-dim">{role}</p>
      )}
    </Link>
  )
}