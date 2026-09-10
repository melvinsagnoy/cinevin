'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MediaCard } from '@/components/media/MediaCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { MediaItem } from '@/types/media'
import { genres } from '@/config/navigation'

const GENRE_OPTIONS = [{ id: '', name: 'All Genres' }, ...genres.movie]

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'release_date.desc', label: 'Latest' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
]

export default function MoviesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedGenre = searchParams.get('genre') || ''
  const sortBy = searchParams.get('sort') || 'popularity.desc'

  const [movies, setMovies] = useState<MediaItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset when filters change
  useEffect(() => {
    setMovies([])
    setPage(1)
    setTotalPages(1)
  }, [selectedGenre, sortBy])

  // Fetch page
  useEffect(() => {
    let cancelled = false

    const fetchMovies = async () => {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.append('page', String(page))
        if (selectedGenre) params.append('genre', selectedGenre)
        if (sortBy) params.append('sort', sortBy)

        const response = await fetch(`/api/movies/discover?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()

        const results: MediaItem[] = (data.results || []).map((item: any) => ({
          id: item.id,
          mediaType: 'movie' as const,
          title: item.title || item.name || 'Unknown',
          overview: item.overview || '',
          posterPath: item.poster_path || null,
          backdropPath: item.backdrop_path || null,
          releaseDate: item.release_date || '',
          firstAirDate: '',
          voteAverage: item.vote_average || 0,
          voteCount: item.vote_count || 0,
          popularity: item.popularity || 0,
          genres: item.genres || [],
          runtime: item.runtime || null,
        }))

        if (cancelled) return
        setMovies(prev => (page === 1 ? results : [...prev, ...results]))
        setTotalPages(data.total_pages || 1)
      } catch (err) {
        if (cancelled) return
        console.error('Movies fetch error:', err)
        setError('Failed to load movies. Please try again.')
      } finally {
        if (cancelled) return
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }

    fetchMovies()
    return () => {
      cancelled = true
    }
  }, [page, selectedGenre, sortBy])

  const handleGenreChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('genre', value)
    else params.delete('genre')
    router.push(`/movies?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/movies?${params.toString()}`)
  }

  const handleLoadMore = useCallback(() => {
    setPage(p => p + 1)
  }, [])

  const handleClearFilters = () => {
    router.push('/movies')
  }

  const hasMore = page < totalPages
  const hasActiveFilters = selectedGenre || sortBy !== 'popularity.desc'

  return (
    <div className="min-h-screen bg-cinevin-dark pt-16">
      <div className="container-cinevin py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-white">Movies</h1>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="rounded-md border border-cinevin-border bg-cinevin-surface px-4 py-2 text-sm text-cinevin-text-muted focus:border-cinevin-red focus:outline-none"
              aria-label="Filter by genre"
            >
              {GENRE_OPTIONS.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-md border border-cinevin-border bg-cinevin-surface px-4 py-2 text-sm text-cinevin-text-muted focus:border-cinevin-red focus:outline-none"
              aria-label="Sort by"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="mb-4 text-cinevin-text-dim">{error}</p>
            <Button onClick={() => setPage(1)}>Retry</Button>
          </div>
        )}

        {/* Initial loading skeleton */}
        {isLoading && !error && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && movies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-cinevin-text-dim">
              No movies found matching your filters.
            </p>
            <Button onClick={handleClearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}

        {/* Grid */}
        {!error && movies.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <MediaCard key={`movie-${movie.id}`} item={movie} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <Button
                  onClick={handleLoadMore}
                  loading={isLoadingMore}
                  size="lg"
                  className="min-w-[180px]"
                >
                  {isLoadingMore ? 'Loading…' : 'Load More'}
                </Button>
              </div>
            )}

            {/* End of results */}
            {!hasMore && movies.length > 0 && (
              <p className="mt-10 text-center text-sm text-cinevin-text-dim">
                You've reached the end · {movies.length} movies
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}