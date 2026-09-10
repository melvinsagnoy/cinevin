import { Suspense } from 'react'
import { tmdbClient } from '@/lib/tmdb/client'
import { MediaCard } from '@/components/media/MediaCard'
import { convertToMediaItem } from '@/lib/utils/converters'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { MediaItem } from '@/types/media'
import { languages } from '@/config/navigation'
import { LanguageSelect } from '@/components/browse/LanguageSelect'
import Link from 'next/link'

export const revalidate = 3600
export const dynamic = 'force-dynamic'

interface BrowseLanguagesPageProps {
  searchParams: {
    lang?: string
    tab?: string
  }
}

function LanguagesLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function BrowseLanguagesPage({
  searchParams,
}: BrowseLanguagesPageProps) {
  const selectedLanguage = searchParams.lang || 'en'
  const activeTab = (searchParams.tab as 'movies' | 'tv') || 'movies'

  try {
    const [movieData, tvData] = await Promise.all([
      tmdbClient.discoverMovies({
        with_original_language: selectedLanguage,
        sort_by: 'popularity.desc',
        page: 1,
      }),
      tmdbClient.discoverTV({
        with_original_language: selectedLanguage,
        sort_by: 'popularity.desc',
        page: 1,
      }),
    ])

    const movies: MediaItem[] = movieData.results.map(convertToMediaItem)
    const tvShows: MediaItem[] = tvData.results.map(convertToMediaItem)
    const languageName =
      languages.find((l) => l.code === selectedLanguage)?.name || 'Unknown'

    const displayItems = activeTab === 'movies' ? movies : tvShows

    return (
      <div className="min-h-screen bg-cinevin-dark pt-16">
        <div className="container-cinevin py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-white">
              Browse by Languages
            </h1>

            <LanguageSelect defaultValue={selectedLanguage} />
          </div>

          <p className="mb-6 text-sm text-cinevin-text-dim">
            Showing {activeTab === 'movies' ? 'movies' : 'TV shows'} in{' '}
            <span className="font-medium text-white">{languageName}</span>
          </p>

          {/* Tabs — use Links, no forms, no client handlers */}
          <div className="mb-6 flex gap-4 border-b border-white/10">
            <Link
              href={`/browse-languages?lang=${selectedLanguage}&tab=movies`}
              className={`pb-3 px-2 text-sm font-medium transition ${
                activeTab === 'movies'
                  ? 'border-b-2 border-cinevin-red text-white'
                  : 'text-cinevin-text-dim hover:text-white'
              }`}
            >
              Movies ({movies.length})
            </Link>
            <Link
              href={`/browse-languages?lang=${selectedLanguage}&tab=tv`}
              className={`pb-3 px-2 text-sm font-medium transition ${
                activeTab === 'tv'
                  ? 'border-b-2 border-cinevin-red text-white'
                  : 'text-cinevin-text-dim hover:text-white'
              }`}
            >
              TV Shows ({tvShows.length})
            </Link>
          </div>

          <Suspense fallback={<LanguagesLoading />}>
            {displayItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p className="text-cinevin-text-dim">
                  No content found in {languageName}.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {displayItems.map((item) => (
                  <MediaCard
                    key={`${item.mediaType}-${item.id}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Browse languages error:', error)
    return (
      <div className="min-h-screen bg-cinevin-dark pt-16">
        <div className="container-cinevin py-8">
          <h1 className="mb-8 text-3xl font-bold text-white">
            Browse by Languages
          </h1>
          <div className="flex flex-col items-center justify-center py-16">
            <p className="mb-4 text-cinevin-text-dim">
              Failed to load content. Please try again.
            </p>
            <Link
              href="/browse-languages"
              className="rounded bg-cinevin-red px-4 py-2 text-white transition hover:bg-cinevin-red-hover"
            >
              Retry
            </Link>
          </div>
        </div>
      </div>
    )
  }
}