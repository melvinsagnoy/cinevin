'use client'

import Link from 'next/link'
import { useMyList } from '@/hooks/useMyList'
import { MediaCard } from '@/components/media/MediaCard'
import { Button } from '@/components/ui/Button'
import { MediaItem } from '@/types/media'

export default function MyListPage() {
  const { items, loading, remove } = useMyList()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] pt-16">
        <div className="container-netflix py-8">
          <h1 className="mb-8 text-3xl font-bold text-white">My List</h1>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-[#1a1a1a]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const mediaItems: MediaItem[] = items.map((item) => ({
    id: item.tmdbId,
    mediaType: item.mediaType,
    title: item.title,
    posterPath: item.posterPath,
    voteAverage: 0,
    voteCount: 0,
    popularity: 0,
    genres: [],
    overview: '',
    backdropPath: null,
  }))

  return (
    <div className="min-h-screen bg-[#141414] pt-16">
      <div className="container-netflix py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My List</h1>
          {items.length > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                if (confirm('Remove all items from your list?')) {
                  items.forEach((item) => {
                    remove(item.tmdbId, item.mediaType)
                  })
                }
              }}
              className="bg-[#1a1a1a] text-[#b3b3b3] hover:bg-[#2a2a2a] hover:text-white"
            >
              Clear All
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="mb-4 h-16 w-16 text-[#808080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-xl font-semibold text-white">Your list is empty</h2>
            <p className="mt-2 text-[#808080]">
              Start adding movies and TV shows you want to watch.
            </p>
            <Link href="/movies">
              <Button className="mt-4">Browse Movies</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mediaItems.map((item) => (
              <MediaCard key={`${item.mediaType}-${item.id}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}