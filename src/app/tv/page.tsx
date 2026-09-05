'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MediaCard } from '@/components/media/MediaCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import { MediaItem } from '@/types/media'
import { genres } from '@/config/navigation'

export default function TVPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [shows, setShows] = useState<MediaItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<string>(searchParams.get('genre') || '')
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'popularity.desc')

  useEffect(() => {
    const fetchTVShows = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        if (selectedGenre) params.append('genre', selectedGenre)
        if (sortBy) params.append('sort', sortBy)
        
        const response = await fetch(`/api/tv/discover?${params.toString()}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        
        // Map the data to MediaItem format - SAME AS MOVIES
        const results = (data.results || []).map((item: any) => ({
          id: item.id,
          mediaType: 'tv' as const,
          title: item.name || item.title || 'Unknown Title',
          overview: item.overview || '',
          posterPath: item.poster_path || null,
          backdropPath: item.backdrop_path || null,
          releaseDate: item.first_air_date || '',
          firstAirDate: item.first_air_date || '',
          voteAverage: item.vote_average || 0,
          voteCount: item.vote_count || 0,
          popularity: item.popularity || 0,
          genres: item.genres || [],
          runtime: null,
        }))
        
        console.log('📺 TV Shows loaded:', results.length)
        // Log first show to verify data
        if (results.length > 0) {
          console.log('📺 Sample TV show:', {
            id: results[0].id,
            title: results[0].title,
            posterPath: results[0].posterPath,
            voteAverage: results[0].voteAverage,
          })
        }
        setShows(results)
      } catch (error) {
        console.error('Error fetching TV shows:', error)
        setError('Failed to load TV shows. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTVShows()
  }, [selectedGenre, sortBy])

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSelectedGenre(value)
    router.push(`/tv?genre=${value}&sort=${sortBy}`)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSortBy(value)
    router.push(`/tv?genre=${selectedGenre}&sort=${value}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-premium py-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-white">TV Shows</h1>
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
          <h1 className="mb-8 text-3xl font-bold text-white">TV Shows</h1>
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
          <h1 className="text-3xl font-bold text-white">TV Shows</h1>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedGenre}
              onChange={handleGenreChange}
              className="rounded bg-[#1a1a1a] px-4 py-2 text-sm text-[#b3b3b3] border border-white/10 focus:border-[#E50914] focus:outline-none"
            >
              <option value="">All Genres</option>
              {genres.tv.map((genre) => (
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
              <option value="first_air_date.desc">Latest</option>
            </select>
          </div>
        </div>

        {shows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-[#808080]">No TV shows found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedGenre('')
                setSortBy('popularity.desc')
                router.push('/tv')
              }}
              className="mt-4 bg-[#E50914] text-white px-4 py-2 rounded hover:bg-[#F6121D] transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {shows.map((show: MediaItem) => (
              <MediaCard key={`tv-${show.id}`} item={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}