import { Suspense } from 'react'
import { tmdbClient } from '@/lib/tmdb/client'
import { MediaCard } from '@/components/media/MediaCard'
import { SearchBar } from '@/components/search/SearchBar'
import { convertToMediaItem } from '@/lib/utils/converters'
import { MediaItem } from '@/types/media'

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

function SearchLoading() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-[#1a1a1a]" />
      ))}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  let movies: MediaItem[] = []
  let tvShows: MediaItem[] = []
  let error: string | null = null
  let results: any[] = []

  if (query.length >= 2) {
    try {
      const data = await tmdbClient.searchMulti(query)
      results = data.results || []
      
      results.forEach((item: any) => {
        const mediaItem = convertToMediaItem(item)
        if (mediaItem.mediaType === 'movie') {
          movies.push(mediaItem)
        } else if (mediaItem.mediaType === 'tv') {
          tvShows.push(mediaItem)
        }
      })
    } catch (err) {
      console.error('Search error:', err)
      error = 'Failed to perform search. Please try again.'
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      <div className="container-premium py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Search</h1>
          <div className="mt-4 max-w-2xl">
            <SearchBar
              initialValue={query}
              placeholder="Search for movies, TV shows, people..."
              autoFocus
            />
          </div>
        </div>

        {query.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080]">Search for your favorite movies and TV shows.</p>
          </div>
        )}

        {query.length > 0 && query.length < 2 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080]">Please enter at least 2 characters.</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-red-400">{error}</p>
            <form action="/search" method="GET">
              <input type="hidden" name="q" value={query} />
              <button
                type="submit"
                className="mt-4 rounded bg-[#E50914] px-4 py-2 text-white transition hover:bg-[#F6121D]"
              >
                Retry
              </button>
            </form>
          </div>
        )}

        {query.length >= 2 && !error && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080]">No results found for "{query}"</p>
          </div>
        )}

        {query.length >= 2 && !error && results.length > 0 && (
          <Suspense fallback={<SearchLoading />}>
            <div className="space-y-8">
              {movies.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white">Movies ({movies.length})</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {movies.map((movie) => (
                      <MediaCard key={`movie-${movie.id}`} item={movie} />
                    ))}
                  </div>
                </div>
              )}

              {tvShows.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white">TV Shows ({tvShows.length})</h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {tvShows.map((show) => (
                      <MediaCard key={`tv-${show.id}`} item={show} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Suspense>
        )}
      </div>
    </div>
  )
}