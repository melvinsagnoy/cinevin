import { cn } from '@/lib/utils/cn'

interface GenreBadgeProps {
  name: string
  className?: string
  variant?: 'default' | 'solid'
}

export function GenreBadge({
  name,
  className,
  variant = 'default',
}: GenreBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full text-xs font-medium transition',
        variant === 'default' &&
          'border border-cinevin-border bg-white/5 px-3 py-1 text-cinevin-text-muted backdrop-blur-sm',
        variant === 'solid' &&
          'bg-white/10 px-3 py-1 text-cinevin-text',
        className
      )}
    >
      {name}
    </span>
  )
}