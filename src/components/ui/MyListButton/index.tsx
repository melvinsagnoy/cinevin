'use client'

import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useMyList } from '@/hooks/useMyList'
import { useToast } from '@/components/ui/Toast'
import { Button } from '../Button'
import { cn } from '@/lib/utils/cn'

interface MyListButtonProps {
  tmdbId: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  releaseYear?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'icon'
  className?: string
}

export function MyListButton({
  tmdbId,
  mediaType,
  title,
  posterPath,
  releaseYear,
  size = 'md',
  variant = 'default',
  className,
}: MyListButtonProps) {
  const { isInList, toggle } = useMyList()
  const { toast } = useToast()
  const [isAnimating, setIsAnimating] = useState(false)
  const inList = isInList(tmdbId, mediaType)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    toggle({ tmdbId, mediaType, title, posterPath, releaseYear })

    toast(
      inList ? `Removed from My List` : `Added to My List`,
      inList ? 'info' : 'success'
    )
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        aria-label={inList ? 'Remove from My List' : 'Add to My List'}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full',
          'border border-white/40 bg-black/60 text-white backdrop-blur-md',
          'transition-all duration-200',
          'hover:border-white hover:bg-black/80 hover:scale-110',
          isAnimating && 'scale-90',
          className
        )}
      >
        {inList ? (
          <Check className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      variant={inList ? 'secondary' : 'outline'}
      size={size}
      className={cn('min-w-[110px]', isAnimating && 'scale-95', className)}
      aria-pressed={inList}
    >
      {inList ? (
        <Check className="h-4 w-4" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      {inList ? 'In List' : 'My List'}
    </Button>
  )
}