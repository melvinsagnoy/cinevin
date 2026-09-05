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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  let movies: MediaItem[] = []
  let tvShows: MediaItem[] = []

  if (query.length >= 2) {
    try {
      const data = await tmdbClient.searchMulti(query)
      const results = data.results || []
      
      results.forEach((item: any) => {
        const mediaItem = convertToMediaItem(item)
        if (mediaItem.mediaType === 'movie') {
          movies.push(mediaItem)
        } else if (mediaItem.mediaType === 'tv') {
          tvShows.push(mediaItem)
        }
      })
    } catch (error) {
      console.error('Search error:', error)
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
              placeholder="Search movies, TV shows..."
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

        {query.length >= 2 && movies.length === 0 && tvShows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080]">No results found for "{query}"</p>
          </div>
        )}

        {movies.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-white">Movies ({movies.length})</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie: MediaItem) => (
                <MediaCard key={`movie-${movie.id}`} item={movie} />
              ))}
            </div>
          </div>
        )}

        {tvShows.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-white">TV Shows ({tvShows.length})</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {tvShows.map((show: MediaItem) => (
                <MediaCard key={`tv-${show.id}`} item={show} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}