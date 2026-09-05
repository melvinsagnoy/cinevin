'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MediaCard } from '@/components/media/MediaCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { MediaItem } from '@/types/media'
import { genres } from '@/config/navigation'

export default function MoviesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [movies, setMovies] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get('genre') || '')
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'popularity.desc')

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedGenre) params.append('genre', selectedGenre)
        if (sortBy) params.append('sort', sortBy)
        
        const response = await fetch(`/api/movies/discover?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        // Map the data to MediaItem format
        const results = (data.results || []).map((item: any) => ({
          id: item.id,
          mediaType: 'movie' as const,
          title: item.title || item.name || 'Unknown Title',
          overview: item.overview || '',
          posterPath: item.poster_path || null,
          backdropPath: item.backdrop_path || null,
          releaseDate: item.release_date || '',
          firstAirDate: item.first_air_date || '',
          voteAverage: item.vote_average || 0,
          voteCount: item.vote_count || 0,
          popularity: item.popularity || 0,
          genres: item.genres || [],
          runtime: item.runtime || null,
        }))
        
        console.log('📽️ Movies loaded:', results.length)
        setMovies(results)
      } catch (error) {
        console.error('Error fetching movies:', error)
        setError('Failed to load movies. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [selectedGenre, sortBy])

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedGenre(value)
    router.push(`/movies?genre=${value}&sort=${sortBy}`)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSortBy(value)
    router.push(`/movies?genre=${selectedGenre}&sort=${value}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-white">Movies</h1>
            <div className="animate-pulse h-10 w-48 bg-[#1a1a1a] rounded" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <h1 className="mb-8 text-3xl font-bold text-white">Movies</h1>
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080] mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#F6121D] transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      <div className="container-premium py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-white">Movies</h1>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="rounded bg-[#1a1a1a] px-4 py-2 text-sm text-[#b3b3b3] border border-white/10 focus:border-[#E50914] focus:outline-none"
            >
              <option value="">All Genres</option>
              {genres.movie.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={handleSortChange}
              className="rounded bg-[#1a1a1a] px-4 py-2 text-sm text-[#b3b3b3] border border-white/10 focus:border-[#E50914] focus:outline-none"
            >
              <option value="popularity.desc">Popular</option>
              <option value="vote_average.desc">Top Rated</option>
              <option value="release_date.desc">Latest</option>
              <option value="revenue.desc">Highest Revenue</option>
            </select>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080]">No movies found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedGenre('')
                setSortBy('popularity.desc')
                router.push('/movies')
              }}
              className="mt-4 bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#F6121D] transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie: MediaItem) => (
              <MediaCard key={`movie-${movie.id}`} item={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}