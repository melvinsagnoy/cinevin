'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface GenreCardProps {
  id: number
  name: string
  mediaType: 'movie' | 'tv'
  className?: string
}

export function GenreCard({ id, name, mediaType, className }: GenreCardProps) {
  const href =
    mediaType === 'movie'
      ? `/genres/${id}?type=movie`
      : `/genres/${id}?type=tv`

  // Generate a subtle gradient based on the genre id
  const hue = (id * 47) % 360
  const gradient = `linear-gradient(135deg, hsl(${hue}, 55%, 22%) 0%, hsl(${
    (hue + 40) % 360
  }, 60%, 12%) 100%)`

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex aspect-[16/9] items-end overflow-hidden rounded-lg p-4',
        'transition-transform duration-300 hover:scale-[1.03]',
        className
      )}
      style={{ background: gradient }}
    >
      <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />

      <div className="relative z-10 flex w-full items-center justify-between">
        <span className="text-lg font-bold text-white drop-shadow-lg">
          {name}
        </span>
        <ArrowRight className="h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-widest text-white/60">
        {mediaType === 'movie' ? 'Movies' : 'TV'}
      </div>
    </Link>
  )
}