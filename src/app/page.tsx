import { tmdbClient } from '@/lib/tmdb/client'
import { HeroCarousel } from '@/components/media/HeroCarousel'
import { LandscapeRow } from '@/components/media/LandscapeRow'
import { Top10PortraitRow } from '@/components/media/Top10PortraitRow'
import { ContinueWatchingRow } from '@/components/home/ContinueWatchingRow'
import { convertToMediaItem } from '@/lib/utils/converters'
import { MediaItem } from '@/types/media'

export const revalidate = 3600

export default async function HomePage() {
  try {
    // ============ Fetch all data in parallel ============
    const [
      trendingData,
      popularMoviesData,
      popularTVData,
      topRatedMoviesData,
      topRatedTVData,
      upcomingMoviesData,
      nowPlayingMoviesData,
      // Genre: Movies
      actionMoviesData,
      comedyMoviesData,
      horrorMoviesData,
      romanceMoviesData,
      scifiMoviesData,
      animationMoviesData,
      documentaryMoviesData,
      familyMoviesData,
      thrillerMoviesData,
      // Genre: TV
      actionTVData,
      comedyTVData,
      dramaTVData,
      scifiTVData,
      animationTVData,
      realityTVData,
      // Original language
      koreanTVData,
      japaneseTVData,
      spanishMoviesData,
      // Specific audiences
      kidsMoviesData,
      // Netflix-like collections
      classicsMoviesData,
      hiddenGemsMoviesData,
    ] = await Promise.all([
      tmdbClient.getTrending('all', 'day'),
      tmdbClient.getPopularMovies(),
      tmdbClient.getPopularTV(),
      tmdbClient.getTopRatedMovies(),
      tmdbClient.getTopRatedTV(),
      tmdbClient.getUpcomingMovies(),
      tmdbClient.getNowPlayingMovies(),
      // Movies by genre
      tmdbClient.discoverMovies({ with_genres: 28, sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_genres: 35, sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_genres: 27, sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_genres: 10749, sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_genres: 878, sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_genres: 16, sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_genres: 99, sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_genres: 10751, sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_genres: 53, sort_by: 'popularity.desc' }),
      // TV by genre
      tmdbClient.discoverTV({ with_genres: 10759, sort_by: 'popularity.desc' }),
      tmdbClient.discoverTV({ with_genres: 35, sort_by: 'popularity.desc' }),
      tmdbClient.discoverTV({ with_genres: 18, sort_by: 'popularity.desc' }),
      tmdbClient.discoverTV({ with_genres: 10765, sort_by: 'popularity.desc' }),
      tmdbClient.discoverTV({ with_genres: 16, sort_by: 'popularity.desc' }),
      tmdbClient.discoverTV({ with_genres: 10764, sort_by: 'popularity.desc' }),
      // By language
      tmdbClient.discoverTV({ with_original_language: 'ko', sort_by: 'popularity.desc' }),
      tmdbClient.discoverTV({ with_original_language: 'ja', sort_by: 'popularity.desc' }),
      tmdbClient.discoverMovies({ with_original_language: 'es', sort_by: 'popularity.desc' }),
      // Audiences
      tmdbClient.discoverMovies({ with_genres: 10751, sort_by: 'popularity.desc', 'vote_average.gte': 6.5 }),
      // Collections
      tmdbClient.discoverMovies({ sort_by: 'popularity.desc', 'primary_release_date.lte': '1999-12-31', 'vote_average.gte': 7 }),
      tmdbClient.discoverMovies({ sort_by: 'vote_average.desc', 'vote_count.gte': 500, 'vote_average.gte': 7.5 }),
    ])

    // ============ Transform to MediaItem ============
    const toItems = (d: any): MediaItem[] => d.results.map(convertToMediaItem)

    const trendingItems = toItems(trendingData)
    const popularMovies = toItems(popularMoviesData)
    const popularTV = toItems(popularTVData)
    const topRatedMovies = toItems(topRatedMoviesData)
    const topRatedTV = toItems(topRatedTVData)
    const upcomingMovies = toItems(upcomingMoviesData)
    const nowPlayingMovies = toItems(nowPlayingMoviesData)
    const actionMovies = toItems(actionMoviesData)
    const comedyMovies = toItems(comedyMoviesData)
    const horrorMovies = toItems(horrorMoviesData)
    const romanceMovies = toItems(romanceMoviesData)
    const scifiMovies = toItems(scifiMoviesData)
    const animationMovies = toItems(animationMoviesData)
    const documentaryMovies = toItems(documentaryMoviesData)
    const familyMovies = toItems(familyMoviesData)
    const thrillerMovies = toItems(thrillerMoviesData)
    const actionTV = toItems(actionTVData)
    const comedyTV = toItems(comedyTVData)
    const dramaTV = toItems(dramaTVData)
    const scifiTV = toItems(scifiTVData)
    const animationTV = toItems(animationTVData)
    const realityTV = toItems(realityTVData)
    const koreanTV = toItems(koreanTVData)
    const japaneseTV = toItems(japaneseTVData)
    const spanishMovies = toItems(spanishMoviesData)
    const kidsMovies = toItems(kidsMoviesData)
    const classicsMovies = toItems(classicsMoviesData)
    const hiddenGemsMovies = toItems(hiddenGemsMoviesData)

    const heroItems = trendingItems.slice(0, 5)
    const top10Movies = popularMovies.slice(0, 10)
    const top10TV = popularTV.slice(0, 10)

    // ============ Render ============
    return (
      <div className="min-h-screen bg-cinevin-dark page-transition">
        {heroItems.length > 0 && <HeroCarousel items={heroItems} />}

        <div className="space-y-10 pb-12 pt-8">
          {/* ================================================
              TOP SECTION
          ================================================ */}
          <ContinueWatchingRow />

          <LandscapeRow
            title="Today's Top Picks for You"
            items={popularMovies.slice(0, 12)}
            seeAllLink="/movies"
            showRecentlyAdded
          />

          <Top10PortraitRow
            title="Top 10 Movies Today"
            items={top10Movies}
            seeAllLink="/movies"
            showRecentlyAdded
          />

          <LandscapeRow
            title="Trending Now"
            items={trendingItems.slice(1, 13)}
            seeAllLink="/trending"
          />

          <Top10PortraitRow
            title="Top 10 TV Shows Today"
            items={top10TV}
            seeAllLink="/tv"
            showRecentlyAdded
          />

          <LandscapeRow
            title="New Releases"
            items={nowPlayingMovies.slice(0, 12)}
            seeAllLink="/movies?sort=now-playing"
          />

          <LandscapeRow
            title="Coming Soon"
            items={upcomingMovies.slice(0, 12)}
            seeAllLink="/movies?sort=upcoming"
          />

          {/* ================================================
              POPULAR
          ================================================ */}
          <LandscapeRow
            title="Popular Movies"
            items={popularMovies.slice(0, 12)}
            seeAllLink="/movies"
          />

          <LandscapeRow
            title="Popular TV Shows"
            items={popularTV.slice(0, 12)}
            seeAllLink="/tv"
          />

          {/* ================================================
              TOP RATED
          ================================================ */}
          <LandscapeRow
            title="Critically Acclaimed Movies"
            items={topRatedMovies.slice(0, 12)}
            seeAllLink="/movies?sort=top-rated"
          />

          <LandscapeRow
            title="Critically Acclaimed TV Shows"
            items={topRatedTV.slice(0, 12)}
            seeAllLink="/tv?sort=top-rated"
          />

          {/* ================================================
              BY GENRE — MOVIES
          ================================================ */}
          <LandscapeRow
            title="Action & Adventure Movies"
            items={actionMovies.slice(0, 12)}
            seeAllLink="/genres/28?type=movie"
          />

          <LandscapeRow
            title="Comedy Movies"
            items={comedyMovies.slice(0, 12)}
            seeAllLink="/genres/35?type=movie"
          />

          <LandscapeRow
            title="Horror Movies"
            items={horrorMovies.slice(0, 12)}
            seeAllLink="/genres/27?type=movie"
          />

          <LandscapeRow
            title="Romantic Movies"
            items={romanceMovies.slice(0, 12)}
            seeAllLink="/genres/10749?type=movie"
          />

          <LandscapeRow
            title="Science Fiction Movies"
            items={scifiMovies.slice(0, 12)}
            seeAllLink="/genres/878?type=movie"
          />

          <LandscapeRow
            title="Thriller Movies"
            items={thrillerMovies.slice(0, 12)}
            seeAllLink="/genres/53?type=movie"
          />

          <LandscapeRow
            title="Animated Movies"
            items={animationMovies.slice(0, 12)}
            seeAllLink="/genres/16?type=movie"
          />

          <LandscapeRow
            title="Family Movies"
            items={familyMovies.slice(0, 12)}
            seeAllLink="/genres/10751?type=movie"
          />

          <LandscapeRow
            title="Documentary Movies"
            items={documentaryMovies.slice(0, 12)}
            seeAllLink="/genres/99?type=movie"
          />

          {/* ================================================
              BY GENRE — TV
          ================================================ */}
          <LandscapeRow
            title="Action & Adventure TV Shows"
            items={actionTV.slice(0, 12)}
            seeAllLink="/genres/10759?type=tv"
          />

          <LandscapeRow
            title="Comedy TV Shows"
            items={comedyTV.slice(0, 12)}
            seeAllLink="/genres/35?type=tv"
          />

          <LandscapeRow
            title="Drama TV Shows"
            items={dramaTV.slice(0, 12)}
            seeAllLink="/genres/18?type=tv"
          />

          <LandscapeRow
            title="Sci-Fi & Fantasy TV Shows"
            items={scifiTV.slice(0, 12)}
            seeAllLink="/genres/10765?type=tv"
          />

          <LandscapeRow
            title="Animated TV Shows"
            items={animationTV.slice(0, 12)}
            seeAllLink="/genres/16?type=tv"
          />

          <LandscapeRow
            title="Reality TV Shows"
            items={realityTV.slice(0, 12)}
            seeAllLink="/genres/10764?type=tv"
          />

          {/* ================================================
              BY LANGUAGE
          ================================================ */}
          <LandscapeRow
            title="Korean TV Dramas"
            items={koreanTV.slice(0, 12)}
            seeAllLink="/browse-languages?lang=ko&tab=tv"
          />

          <LandscapeRow
            title="Japanese Anime & TV"
            items={japaneseTV.slice(0, 12)}
            seeAllLink="/browse-languages?lang=ja&tab=tv"
          />

          <LandscapeRow
            title="Spanish-Language Movies"
            items={spanishMovies.slice(0, 12)}
            seeAllLink="/browse-languages?lang=es&tab=movies"
          />

          {/* ================================================
              CURATED COLLECTIONS
          ================================================ */}
          <LandscapeRow
            title="Kids & Family Movies"
            items={kidsMovies.slice(0, 12)}
            seeAllLink="/genres/10751?type=movie"
          />

          <LandscapeRow
            title="Classic Movies (Pre-2000)"
            items={classicsMovies.slice(0, 12)}
            seeAllLink="/movies?year=1999"
          />

          <LandscapeRow
            title="Hidden Gems — Highly Rated"
            items={hiddenGemsMovies.slice(0, 12)}
            seeAllLink="/movies?sort=top-rated"
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