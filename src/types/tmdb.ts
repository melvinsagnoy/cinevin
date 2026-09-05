export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genres: { id: number; name: string }[]
  runtime: number | null
  tagline: string | null
  status: string
  budget: number
  revenue: number
  production_companies: { id: number; name: string }[]
}

export interface TMDBTVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genres: { id: number; name: string }[]
  number_of_seasons: number
  number_of_episodes: number
  status: string
  tagline: string | null
  created_by: { id: number; name: string }[]
}

export interface TMDBSeason {
  id: number
  name: string
  overview: string
  poster_path: string | null
  season_number: number
  episode_count: number
  air_date: string | null
  episodes: TMDBEpisode[]
}

export interface TMDBEpisode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  still_path: string | null
  air_date: string | null
  runtime: number | null
  vote_average: number
}

export interface TMDBPerson {
  id: number
  name: string
  profile_path: string | null
  character?: string
  job?: string
  department?: string
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBListResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}