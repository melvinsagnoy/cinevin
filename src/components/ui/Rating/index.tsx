import { cn } from '@/lib/utils/cn'
import { Star } from 'lucide-react'

interface RatingProps {
  rating: number | undefined | null
  maxRating?: number
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'circle' | 'pill' | 'star'
  className?: string
}

export function Rating({
  rating,
  maxRating = 10,
  showValue = true,
  size = 'md',
  variant = 'star',
  className,
}: RatingProps) {
  const value =
    typeof rating === 'number' && !isNaN(rating) ? rating : 0

  if (variant === 'pill') {
    const sizes = {
      sm: 'text-[10px] px-1.5 py-0.5 gap-0.5',
      md: 'text-xs px-2 py-1 gap-1',
      lg: 'text-sm px-2.5 py-1 gap-1.5',
    }
    const color =
      value >= 7 ? 'text-emerald-400' : value >= 5 ? 'text-amber-400' : 'text-red-400'

    return (
      <div
        className={cn(
          'inline-flex items-center rounded-md bg-black/60 font-semibold backdrop-blur-sm border border-white/10',
          sizes[size],
          className
        )}
      >
        <Star className={cn('fill-current', color, size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} />
        <span className="text-white">{value.toFixed(1)}</span>
      </div>
    )
  }

  if (variant === 'star') {
    const starSizes = { sm: 'h-3 w-3', md: 'h-3.5 w-3.5', lg: 'h-4 w-4' }
    const textSizes = { sm: 'text-[10px]', md: 'text-xs', lg: 'text-sm' }
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        <Star className={cn('fill-amber-400 text-amber-400', starSizes[size])} />
        <span className={cn('font-semibold text-white tabular-nums', textSizes[size])}>
          {value.toFixed(1)}
        </span>
        {showValue && (
          <span className={cn('text-cinevin-text-dim', textSizes[size])}>/ {maxRating}</span>
        )}
      </div>
    )
  }

  // circle variant (legacy, kept for compatibility)
  const percentage = (value / maxRating) * 100
  const circleSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }
  const getColor = (r: number) =>
    r >= 7 ? '#22c55e' : r >= 5 ? '#eab308' : '#ef4444'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <svg className={circleSizes[size]} viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={getColor(value)}
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
          />
          <circle cx="18" cy="18" r="12" fill="#141414" />
          <text
            x="18"
            y="20.5"
            textAnchor="middle"
            className="text-[10px] font-bold"
            fill="white"
          >
            {value.toFixed(1)}
          </text>
        </svg>
      </div>
    </div>
  )
}