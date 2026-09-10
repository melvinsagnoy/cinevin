'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MediaCard } from '@/components/media/MediaCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { MediaItem } from '@/types/media'
import { genres } from '@/config/navigation'

const GENRE_OPTIONS = [{ id: '', name: 'All Genres' }, ...genres.tv]

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'first_air_date.desc', label: 'Latest' },
]

export default function TVPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedGenre = searchParams.get('genre') || ''
  const sortBy = searchParams.get('sort') || 'popularity.desc'

  const [shows, setShows] = useState<MediaItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setShows([])
    setPage(1)
    setTotalPages(1)
  }, [selectedGenre, sortBy])

  useEffect(() => {
    let cancelled = false

    const fetchShows = async () => {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        params.append('page', String(page))
        if (selectedGenre) params.append('genre', selectedGenre)
        if (sortBy) params.append('sort', sortBy)

        const response = await fetch(`/api/tv/discover?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data = await response.json()

        const results: MediaItem[] = (data.results || []).map((item: any) => ({
          id: item.id,
          mediaType: 'tv' as const,
          title: item.name || item.title || 'Unknown',
          overview: item.overview || '',
          posterPath: item.poster_path || null,
          backdropPath: item.backdrop_path || null,
          releaseDate: '',
          firstAirDate: item.first_air_date || '',
          voteAverage: item.vote_average || 0,
          voteCount: item.vote_count || 0,
          popularity: item.popularity || 0,
          genres: item.genres || [],
          runtime: null,
        }))

        if (cancelled) return
        setShows(prev => (page === 1 ? results : [...prev, ...results]))
        setTotalPages(data.total_pages || 1)
      } catch (err) {
        if (cancelled) return
        console.error('TV fetch error:', err)
        setError('Failed to load TV shows. Please try again.')
      } finally {
        if (cancelled) return
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    }

    fetchShows()
    return () => {
      cancelled = true
    }
  }, [page, selectedGenre, sortBy])

  const handleGenreChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('genre', value)
    else params.delete('genre')
    router.push(`/tv?${params.toString()}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/tv?${params.toString()}`)
  }

  const handleLoadMore = useCallback(() => setPage(p => p + 1), [])

  const handleClearFilters = () => router.push('/tv')

  const hasMore = page < totalPages
  const hasActiveFilters = selectedGenre || sortBy !== 'popularity.desc'

  return (
    <div className="min-h-screen bg-cinevin-dark pt-16">
      <div className="container-cinevin py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-white">TV Shows</h1>

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
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="mb-4 text-cinevin-text-dim">{error}</p>
            <Button onClick={() => setPage(1)}>Retry</Button>
          </div>
        )}

        {isLoading && !error && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 18 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !error && shows.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-cinevin-text-dim">
              No TV shows found matching your filters.
            </p>
            <Button onClick={handleClearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}

        {!error && shows.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {shows.map((show) => (
                <MediaCard key={`tv-${show.id}`} item={show} />
              ))}
            </div>

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

            {!hasMore && (
              <p className="mt-10 text-center text-sm text-cinevin-text-dim">
                You've reached the end · {shows.length} TV shows
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}