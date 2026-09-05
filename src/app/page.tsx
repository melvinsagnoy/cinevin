import { tmdbClient } from '@/lib/tmdb/client'
import { Hero } from '@/components/media/Hero'
import { MediaRow } from '@/components/media/MediaRow'
import { convertToMediaItem } from '@/lib/utils/converters'
import { MediaItem } from '@/types/media'

export const revalidate = 3600

export default async function HomePage() {
  try {
    const [
      trendingData,
      popularMoviesData,
      popularTVData,
      topRatedMoviesData,
      upcomingMoviesData,
    ] = await Promise.all([
      tmdbClient.getTrending('all', 'day'),
      tmdbClient.getPopularMovies(),
      tmdbClient.getPopularTV(),
      tmdbClient.getTopRatedMovies(),
      tmdbClient.getUpcomingMovies(),
    ])

    const trendingItems: MediaItem[] = trendingData.results.map(convertToMediaItem)
    const popularMovies: MediaItem[] = popularMoviesData.results.map(convertToMediaItem)
    const popularTV: MediaItem[] = popularTVData.results.map(convertToMediaItem)
    const topRatedMovies: MediaItem[] = topRatedMoviesData.results.map(convertToMediaItem)
    const upcomingMovies: MediaItem[] = upcomingMoviesData.results.map(convertToMediaItem)

    const heroItem = trendingItems[0]

    return (
      <div className="min-h-screen bg-[#141414] page-transition">
        {heroItem && (
          <Hero
            item={heroItem}
            mediaType={heroItem.mediaType}
          />
        )}

        <div className="container-premium space-y-8 pb-8">
          <MediaRow
            title="Trending Now"
            items={trendingItems.slice(1)}
            seeAllLink="/trending"
          />
          <MediaRow
            title="Popular Movies"
            items={popularMovies}
            seeAllLink="/movies"
          />
          <MediaRow
            title="Popular TV Shows"
            items={popularTV}
            seeAllLink="/tv"
          />
          <MediaRow
            title="Top Rated Movies"
            items={topRatedMovies}
            seeAllLink="/movies?sort=top-rated"
          />
          <MediaRow
            title="Upcoming Movies"
            items={upcomingMovies}
            seeAllLink="/movies?sort=upcoming"
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('HomePage error:', error)
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Unable to Load Content</h1>
          <p className="text-[#808080] mb-4">Please check your connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#E50914] text-white px-6 py-2 rounded transition-all duration-300 hover:scale-105 hover:bg-[#F6121D]"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
}