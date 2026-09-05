// src/app/search/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { MediaCard } from '@/components/media/MediaCard'
import { SearchBar } from '@/components/search/SearchBar'
import { tmdbClient } from '@/lib/tmdb/client'
import { convertToMediaItem } from '@/lib/utils/converters'
import { MediaItem } from '@/types/media'
import { TMDBMovie, TMDBTVShow } from '@/types/tmdb'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => tmdbClient.searchMulti(searchQuery),
    enabled: searchQuery.length >= 2,
  })

  const movies: MediaItem[] = []
  const tvShows: MediaItem[] = []

  if (data) {
    data.results.forEach((item: TMDBMovie | TMDBTVShow) => {
      const mediaItem = convertToMediaItem(item)
      if (mediaItem.mediaType === 'movie') {
        movies.push(mediaItem)
      } else if (mediaItem.mediaType === 'tv') {
        tvShows.push(mediaItem)
      }
    })
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Search</h1>
        <div className="mt-4 max-w-2xl">
          <SearchBar
            initialValue={query}
            onSearch={handleSearch}
            placeholder="Search movies, TV shows..."
            autoFocus
          />
        </div>
      </div>

      {searchQuery.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-400">Search for your favorite movies and TV shows.</p>
        </div>
      )}

      {searchQuery.length > 0 && searchQuery.length < 2 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-400">Please enter at least 2 characters.</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-zinc-800" />
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-400">Failed to search. Please try again.</p>
        </div>
      )}

      {data && data.results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-zinc-400">No results found for "{searchQuery}"</p>
        </div>
      )}

      {data && data.results.length > 0 && (
        <div className="space-y-8">
          {movies.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">Movies</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {movies.map((movie) => (
                  <MediaCard key={`movie-${movie.id}`} item={movie} />
                ))}
              </div>
            </div>
          )}

          {tvShows.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-bold text-white">TV Shows</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {tvShows.map((show) => (
                  <MediaCard key={`tv-${show.id}`} item={show} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}