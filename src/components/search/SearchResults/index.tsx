'use client'

import { useState } from 'react'
import { MediaCard } from '@/components/media/MediaCard'
import { PersonCard } from '@/components/person/PersonCard'
import { MediaItem } from '@/types/media'
import { cn } from '@/lib/utils/cn'

interface Person {
  id: number
  name: string
  profile_path: string | null
  known_for_department?: string
}

interface SearchResultsProps {
  movies: MediaItem[]
  tvShows: MediaItem[]
  people: Person[]
}

type Tab = 'all' | 'movies' | 'tv' | 'people'

export function SearchResults({ movies, tvShows, people }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const tabs: { id: Tab; label: string; count: number }[] = [
    {
      id: 'all',
      label: 'All',
      count: movies.length + tvShows.length + people.length,
    },
    { id: 'movies', label: 'Movies', count: movies.length },
    { id: 'tv', label: 'TV Shows', count: tvShows.length },
    { id: 'people', label: 'People', count: people.length },
  ]

  const showMovies = activeTab === 'all' || activeTab === 'movies'
  const showTV = activeTab === 'all' || activeTab === 'tv'
  const showPeople = activeTab === 'all' || activeTab === 'people'

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="scrollbar-hide flex gap-1 overflow-x-auto border-b border-cinevin-border pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            disabled={tab.count === 0}
            className={cn(
              'shrink-0 rounded-md px-4 py-2 text-sm font-medium transition',
              activeTab === tab.id
                ? 'bg-cinevin-red text-white'
                : 'text-cinevin-text-muted hover:bg-white/5 hover:text-white',
              tab.count === 0 &&
                'cursor-not-allowed opacity-40 hover:bg-transparent'
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 text-xs opacity-70">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Movies */}
      {showMovies && movies.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">
            Movies {activeTab === 'movies' && `(${movies.length})`}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => (
              <MediaCard key={`movie-${movie.id}`} item={movie} />
            ))}
          </div>
        </section>
      )}

      {/* TV */}
      {showTV && tvShows.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">
            TV Shows {activeTab === 'tv' && `(${tvShows.length})`}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {tvShows.map((show) => (
              <MediaCard key={`tv-${show.id}`} item={show} />
            ))}
          </div>
        </section>
      )}

      {/* People */}
      {showPeople && people.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">
            People {activeTab === 'people' && `(${people.length})`}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {people.map((person) => (
              <PersonCard
                key={`person-${person.id}`}
                id={person.id}
                name={person.name}
                profilePath={person.profile_path}
                role={person.known_for_department}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}