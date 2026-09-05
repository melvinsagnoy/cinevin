'use client'

import { useState } from 'react'
import { useMyList } from '@/hooks/useMyList'
import { Button } from '../Button'
import { cn } from '@/lib/utils/cn'

interface MyListButtonProps {
  tmdbId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  releaseYear?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MyListButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
  releaseYear,
  size = 'md',
  className,
}: MyListButtonProps) {
  const { isInList, toggle } = useMyList()
  const [isAnimating, setIsAnimating] = useState(false)
  const inList = isInList(tmdbId, mediaType)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
    toggle({
      tmdbId,
      mediaType,
      title,
      posterPath,
      releaseYear,
    })
  }

  return (
    <Button
      onClick={handleClick}
      variant={inList ? 'secondary' : 'outline'}
      size={size}
      className={cn('min-w-[100px] transition-all duration-300', isAnimating && 'scale-90', className)}
    >
      <svg
        className={cn(
          'mr-2 h-4 w-4 transition-all duration-300',
          inList ? 'fill-current' : 'fill-none',
          isAnimating && 'scale-125'
        )}
        fill={inList ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {inList ? 'Remove' : 'Add to List'}
    </Button>
  )
}