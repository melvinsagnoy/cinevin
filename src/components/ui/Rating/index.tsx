// src/components/ui/Rating/index.tsx
interface RatingProps {
  rating: number
  maxRating?: number
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Rating({ rating, maxRating = 10, showValue = true, size = 'md' }: RatingProps) {
  const percentage = (rating / maxRating) * 100
  
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg className={sizes[size]} viewBox="0 0 36 36">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#333"
            strokeWidth="3"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={getRatingColor(rating)}
            strokeWidth="3"
            strokeDasharray={`${percentage}, 100`}
            strokeLinecap="round"
          />
          <circle cx="18" cy="18" r="12" fill="#1a1a1a" />
          <text
            x="18"
            y="20.5"
            textAnchor="middle"
            className={`font-bold ${sizes[size]}`}
            fill="white"
          >
            {rating.toFixed(1)}
          </text>
        </svg>
      </div>
      {showValue && (
        <span className="text-sm text-zinc-400">/ {maxRating}</span>
      )}
    </div>
  )
}

function getRatingColor(rating: number): string {
  if (rating >= 7) return '#22c55e' // green
  if (rating >= 5) return '#eab308' // yellow
  return '#ef4444' // red
}