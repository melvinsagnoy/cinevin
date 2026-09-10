import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton rounded-md', className)} />
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="space-y-4">
      <div className="container-cinevin">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto px-4 md:px-[4%]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-[160px] flex-none md:w-[200px]">
            <CardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="relative min-h-[70vh] w-full overflow-hidden md:min-h-[80vh]">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 gradient-hero-bottom" />
      <div className="relative z-10 flex h-full min-h-[70vh] items-center px-4 md:min-h-[80vh] md:px-8">
        <div className="container-cinevin w-full">
          <div className="max-w-2xl space-y-4">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-14 w-3/4 rounded-md" />
            <Skeleton className="h-5 w-1/2 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-16 w-full rounded-md" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-36 rounded-md" />
              <Skeleton className="h-12 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DetailsSkeleton() {
  return (
    <div className="page-offset">
      <Skeleton className="h-[50vh] w-full rounded-none" />
      <div className="container-cinevin -mt-32 pb-8">
        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          <Skeleton className="hidden aspect-[2/3] w-full rounded-lg md:block" />
          <div className="space-y-4 pt-16">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-36 rounded-md" />
              <Skeleton className="h-12 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}