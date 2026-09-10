import { tmdbClient } from '@/lib/tmdb/client'
import { Hero } from '@/components/media/Hero'
import { MediaRow } from '@/components/media/MediaRow'
import { ContinueWatchingRow } from '@/components/home/ContinueWatchingRow'
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
      <div className="min-h-screen bg-cinevin-dark page-transition">
        {heroItem && <Hero item={heroItem} mediaType={heroItem.mediaType} />}

        <div className="space-y-10 pb-12 pt-8">
          {/* Continue Watching — auto-hides when empty */}
          <ContinueWatchingRow />

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
      <div className="flex min-h-[70vh] items-center justify-center bg-cinevin-dark">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Unable to Load Content
          </h1>
          <p className="mb-4 text-cinevin-text-dim">
            Please check your connection and try again.
          </p>
          <form action="/" method="GET">
            <button
              type="submit"
              className="rounded bg-cinevin-red px-6 py-2 text-white transition hover:bg-cinevin-red-hover"
            >
              Retry
            </button>
          </form>
        </div>
      </div>
    )
  }
}