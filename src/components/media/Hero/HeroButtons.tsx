'use client'

import Link from 'next/link'
import { Play, Info } from 'lucide-react'

interface HeroButtonsProps {
  watchHref: string
  detailsHref: string
}

export function HeroButtons({ watchHref, detailsHref }: HeroButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      {/* Play button — solid white pill */}
      <Link
        href={watchHref}
        className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-base font-bold text-black transition-all duration-200 hover:bg-white/90 hover:scale-[1.03] active:scale-95"
        aria-label="Play"
      >
        <Play className="h-6 w-6 fill-black" strokeWidth={0} />
        Play
      </Link>

      {/* More Info button — gray translucent pill */}
      <Link
        href={detailsHref}
        className="group inline-flex items-center gap-2 rounded-full bg-white/25 px-7 py-3 text-base font-bold text-white backdrop-blur-md transition-all duration-200 hover:bg-white/35 hover:scale-[1.03] active:scale-95"
        aria-label="More Info"
      >
        <Info className="h-6 w-6" />
        More Info
      </Link>
    </div>
  )
}