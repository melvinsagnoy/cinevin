import { Suspense } from 'react'
import { tmdbClient } from '@/lib/tmdb/client'
import { MediaCard } from '@/components/media/MediaCard'
import { convertToMediaItem } from '@/lib/utils/converters'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { MediaItem } from '@/types/media'

export const revalidate = 3600

function TVLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function TVPage() {
  try {
    const data = await tmdbClient.getPopularTV(1)
    const shows: MediaItem[] = data.results.map(convertToMediaItem)

    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">TV Shows</h1>
            <div className="flex gap-2">
              <span className="text-sm text-[#808080]">Popular</span>
            </div>
          </div>

          <Suspense fallback={<TVLoading />}>
            {shows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-[#808080]">No TV shows found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {shows.map((show: MediaItem) => (
                  <MediaCard key={`tv-${show.id}`} item={show} />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('TV page error:', error)
    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <h1 className="mb-8 text-3xl font-bold text-white">TV Shows</h1>
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080]">Failed to load TV shows. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded bg-[#E50914] px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:bg-[#F6121D]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }
}