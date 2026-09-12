// src/types/media.ts
import { TMDBMovie, TMDBTVShow, TMDBPerson, TMDBGenre } from './tmdb'

export type MediaType = 'movie' | 'tv'

export interface MediaItem {
  id: number
  mediaType: MediaType
  title: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  releaseDate?: string
  firstAirDate?: string
  voteAverage: number
  voteCount: number
  popularity: number
  genres: { id: number; name: string }[]
  runtime?: number | null
  tagline?: string | null   
}

export interface Movie extends MediaItem {
  mediaType: 'movie'
  title: string
  releaseDate: string
  runtime: number | null
  tagline: string | null
  status: string
  budget: number
  revenue: number
  productionCompanies: { id: number; name: string }[]
  
}

export interface TVShow extends MediaItem {
  mediaType: 'tv'
  title: string
  firstAirDate: string
  numberOfSeasons: number
  numberOfEpisodes: number
  status: string
  tagline: string | null
  createdBy: { id: number; name: string }[]
}

export interface Episode {
  id: number
  name: string
  overview: string
  episodeNumber: number
  seasonNumber: number
  stillPath: string | null
  airDate: string | null
  runtime: number | null
  voteAverage: number
}

export interface Season {
  id: number
  name: string
  overview: string
  posterPath: string | null
  seasonNumber: number
  episodeCount: number
  airDate: string | null
  episodes: Episode[]
}

export interface Person {
  id: number
  name: string
  profilePath: string | null
  character?: string
  job?: string
  department?: string
}

export interface WatchHistoryItem {
  mediaType: MediaType
  tmdbId: number
  title: string
  posterPath: string | null
  backdropPath?: string | null   // ← add this
  season?: number
  episode?: number
  lastWatched: string // ISO date string
  progress?: number // 0-100
}

export interface MyListItem {
  mediaType: MediaType
  tmdbId: number
  title: string
  posterPath: string | null
  releaseYear?: number
  addedAt: string // ISO date string
}