import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[#1a1a1a]',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="aspect-[2/3] w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[80vh]">
      <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent" />
      <div className="relative z-10 flex h-full min-h-[70vh] items-center px-4 md:min-h-[80vh] md:px-8">
        <div className="container-netflix">
          <div className="max-w-2xl space-y-4">
            <div className="h-8 w-24 bg-[#1a1a1a] rounded animate-pulse" />
            <div className="h-12 w-3/4 bg-[#1a1a1a] rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-[#1a1a1a] rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-[#1a1a1a] rounded animate-pulse" />
              <div className="h-6 w-16 bg-[#1a1a1a] rounded animate-pulse" />
            </div>
            <div className="h-20 w-full bg-[#1a1a1a] rounded animate-pulse" />
            <div className="flex gap-3">
              <div className="h-12 w-32 bg-[#1a1a1a] rounded animate-pulse" />
              <div className="h-12 w-32 bg-[#1a1a1a] rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}