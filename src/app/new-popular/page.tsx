import { Suspense } from 'react'
import { tmdbClient } from '@/lib/tmdb/client'
import { MediaCard } from '@/components/media/MediaCard'
import { convertToMediaItem } from '@/lib/utils/converters'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { MediaItem } from '@/types/media'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

function LoadingSection() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 animate-pulse rounded bg-[#1a1a1a]" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default async function NewPopularPage() {
  try {
    const [
      trendingData,
      popularMoviesData,
      popularTVData,
      topRatedMoviesData,
      topRatedTVData,
    ] = await Promise.all([
      tmdbClient.getTrending('all', 'day'),
      tmdbClient.getPopularMovies(),
      tmdbClient.getPopularTV(),
      tmdbClient.getTopRatedMovies(),
      tmdbClient.getTopRatedTV(),
    ])

    const trendingItems = trendingData.results.map(convertToMediaItem)
    const popularMovies = popularMoviesData.results.map(convertToMediaItem)
    const popularTV = popularTVData.results.map(convertToMediaItem)
    const topRatedMovies = topRatedMoviesData.results.map(convertToMediaItem)
    const topRatedTV = topRatedTVData.results.map(convertToMediaItem)

    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <h1 className="text-3xl font-bold text-white mb-8">New & Popular</h1>
          
          <div className="space-y-12">
            <Suspense fallback={<LoadingSection />}>
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Trending Now</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {trendingItems.slice(0, 12).map((item: MediaItem) => (
                    <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
                  ))}
                </div>
              </div>
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Popular Movies</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {popularMovies.slice(0, 12).map((movie: MediaItem) => (
                    <MediaCard key={`movie-${movie.id}`} item={movie} />
                  ))}
                </div>
              </div>
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Popular TV Shows</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {popularTV.slice(0, 12).map((show: MediaItem) => (
                    <MediaCard key={`tv-${show.id}`} item={show} />
                  ))}
                </div>
              </div>
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Top Rated Movies</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {topRatedMovies.slice(0, 12).map((movie: MediaItem) => (
                    <MediaCard key={`movie-${movie.id}`} item={movie} />
                  ))}
                </div>
              </div>
            </Suspense>

            <Suspense fallback={<LoadingSection />}>
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Top Rated TV Shows</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {topRatedTV.slice(0, 12).map((show: MediaItem) => (
                    <MediaCard key={`tv-${show.id}`} item={show} />
                  ))}
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('New & Popular page error:', error)
    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <h1 className="text-3xl font-bold text-white mb-8">New & Popular</h1>
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080] mb-4">Failed to load content. Please try again.</p>
            <form action="/new-popular" method="GET">
              <button
                type="submit"
                className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#F6121D] transition"
              >
                Retry
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}