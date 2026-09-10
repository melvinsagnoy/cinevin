import { Suspense } from 'react'
import Link from 'next/link'
import { tmdbClient } from '@/lib/tmdb/client'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { TrendingSearches } from '@/components/search/TrendingSearches'
import { convertToMediaItem } from '@/lib/utils/converters'
import { MediaItem } from '@/types/media'
import { CardSkeleton } from '@/components/ui/Skeleton'

interface SearchPageProps {
  searchParams: {
    q?: string
    page?: string
  }
}

function SearchLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

function buildSearchUrl(query: string, page: number) {
  const params = new URLSearchParams()
  params.set('q', query)
  if (page > 1) params.set('page', String(page))
  return `/search?${params.toString()}`
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q || '').trim()
  const page = parseInt(searchParams.page || '1')

  let movies: MediaItem[] = []
  let tvShows: MediaItem[] = []
  let people: any[] = []
  let totalPages = 1
  let totalResults = 0
  let error: string | null = null

  if (query.length >= 2) {
    try {
      const data = await tmdbClient.searchMulti(query, page)
      const results = data.results || []
      totalPages = Math.min(data.total_pages || 1, 500)
      totalResults = data.total_results || results.length

      results.forEach((item: any) => {
        if (item.media_type === 'person') {
          people.push(item)
        } else if (item.media_type === 'movie') {
          movies.push(convertToMediaItem(item))
        } else if (item.media_type === 'tv') {
          tvShows.push(convertToMediaItem(item))
        }
      })
    } catch (err) {
      console.error('Search error:', err)
      error = 'Failed to perform search. Please try again.'
    }
  }

  const hasResults =
    movies.length > 0 || tvShows.length > 0 || people.length > 0

  return (
    <div className="min-h-screen bg-cinevin-dark pt-16">
      <div className="container-cinevin py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {query ? 'Search Results' : 'Search'}
          </h1>
          {query && totalResults > 0 && (
            <p className="mt-2 text-sm text-cinevin-text-muted">
              {totalResults.toLocaleString()} result
              {totalResults !== 1 ? 's' : ''} for "
              <span className="text-white">{query}</span>"
            </p>
          )}
          <div className="mt-4 max-w-2xl">
            <SearchBar
              initialValue={query}
              placeholder="Search movies, TV shows, people..."
              autoFocus
            />
          </div>
        </div>

        {/* Empty query — trending */}
        {!query && (
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-lg bg-cinevin-surface"
                  />
                ))}
              </div>
            }
          >
            <TrendingSearches />
          </Suspense>
        )}

        {/* Too short */}
        {query.length > 0 && query.length < 2 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-cinevin-text-dim">
              Please enter at least 2 characters.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="mb-4 text-red-400">{error}</p>
            <Link
              href={buildSearchUrl(query, 1)}
              className="rounded bg-cinevin-red px-4 py-2 text-white transition hover:bg-cinevin-red-hover"
            >
              Retry
            </Link>
          </div>
        )}

        {/* No results */}
        {query.length >= 2 && !error && !hasResults && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              className="mb-4 h-16 w-16 text-cinevin-text-dim"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-white">
              No results found
            </h2>
            <p className="mt-2 text-cinevin-text-dim">
              We couldn't find anything matching "
              <span className="text-white">{query}</span>"
            </p>
            <p className="mt-1 text-sm text-cinevin-text-dim">
              Try different keywords or check the spelling
            </p>
          </div>
        )}

        {/* Results */}
        {query.length >= 2 && !error && hasResults && (
          <Suspense fallback={<SearchLoading />}>
            <SearchResults
              movies={movies}
              tvShows={tvShows}
              people={people}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={buildSearchUrl(query, page - 1)}
                    className="rounded-md border border-cinevin-border bg-cinevin-surface px-4 py-2 text-sm text-cinevin-text-muted transition hover:bg-cinevin-surface-hover hover:text-white"
                  >
                    ← Previous
                  </Link>
                )}

                <span className="px-4 text-sm text-cinevin-text-dim">
                  Page{' '}
                  <span className="font-medium text-white">{page}</span> of{' '}
                  <span className="font-medium text-white">
                    {totalPages.toLocaleString()}
                  </span>
                </span>

                {page < totalPages && (
                  <Link
                    href={buildSearchUrl(query, page + 1)}
                    className="rounded-md border border-cinevin-border bg-cinevin-surface px-4 py-2 text-sm text-cinevin-text-muted transition hover:bg-cinevin-surface-hover hover:text-white"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </Suspense>
        )}
      </div>
    </div>
  )
}