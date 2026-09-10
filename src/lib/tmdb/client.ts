import type { TMDBListResponse, TMDBMovie, TMDBTVShow } from '@/types/tmdb'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN

if (typeof window === 'undefined' && !TMDB_API_TOKEN) {
  console.error('❌ TMDB_API_TOKEN is not defined in environment variables')
}

const headers = {
  Authorization: `Bearer ${TMDB_API_TOKEN}`,
  'Content-Type': 'application/json',
}

type QueryValue = string | number | boolean

async function fetchFromTMDB<T>(
  endpoint: string,
  params?: Record<string, QueryValue>
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  const response = await fetch(url.toString(), { headers })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('❌ TMDB API Error:', response.status, response.statusText)
    console.error('Error details:', errorText)
    throw new Error(
      `TMDB API error: ${response.status} - ${response.statusText}`
    )
  }

  return response.json()
}

export const tmdbClient = {
  // ===== Trending =====
  getTrending: async (
    mediaType: 'all' | 'movie' | 'tv' = 'all',
    timeWindow: 'day' | 'week' = 'day'
  ) =>
    fetchFromTMDB<TMDBListResponse<TMDBMovie | TMDBTVShow>>(
      `/trending/${mediaType}/${timeWindow}`
    ),

  // ===== Movies =====
  getPopularMovies: async (page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBMovie>>('/movie/popular', { page }),

  getTopRatedMovies: async (page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBMovie>>('/movie/top_rated', { page }),

  getUpcomingMovies: async (page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBMovie>>('/movie/upcoming', { page }),

  getNowPlayingMovies: async (page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBMovie>>('/movie/now_playing', { page }),

  getMovieDetails: async (id: number) =>
    fetchFromTMDB<TMDBMovie>(`/movie/${id}`),

  getMovieCredits: async (id: number) =>
    fetchFromTMDB<{ cast: any[]; crew: any[] }>(`/movie/${id}/credits`),

  getMovieSimilar: async (id: number, page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBMovie>>(`/movie/${id}/similar`, { page }),

  getMovieImages: async (id: number) =>
    fetchFromTMDB<{ backdrops: any[]; posters: any[] }>(`/movie/${id}/images`),

  // ===== TV =====
  getPopularTV: async (page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBTVShow>>('/tv/popular', { page }),

  getTopRatedTV: async (page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBTVShow>>('/tv/top_rated', { page }),

  getTVDetails: async (id: number) => fetchFromTMDB<TMDBTVShow>(`/tv/${id}`),

  getTVCredits: async (id: number) =>
    fetchFromTMDB<{ cast: any[]; crew: any[] }>(`/tv/${id}/credits`),

  getTVSimilar: async (id: number, page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBTVShow>>(`/tv/${id}/similar`, { page }),

  getTVImages: async (id: number) =>
    fetchFromTMDB<{ backdrops: any[]; posters: any[] }>(`/tv/${id}/images`),

  getTVSeason: async (id: number, seasonNumber: number) =>
    fetchFromTMDB<any>(`/tv/${id}/season/${seasonNumber}`),

  // ===== Search =====
  searchMulti: async (query: string, page: number = 1) =>
    fetchFromTMDB<TMDBListResponse<TMDBMovie | TMDBTVShow>>('/search/multi', {
      query,
      page,
    }),

  // ===== Genres =====
  getMovieGenres: async () =>
    fetchFromTMDB<{ genres: { id: number; name: string }[] }>(
      '/genre/movie/list'
    ),

  getTVGenres: async () =>
    fetchFromTMDB<{ genres: { id: number; name: string }[] }>('/genre/tv/list'),

  // ===== Discover =====
  discoverMovies: async (params: Record<string, QueryValue>) =>
    fetchFromTMDB<TMDBListResponse<TMDBMovie>>('/discover/movie', params),

  discoverTV: async (params: Record<string, QueryValue>) =>
    fetchFromTMDB<TMDBListResponse<TMDBTVShow>>('/discover/tv', params),

  // ===== People =====
  getPersonDetails: async (id: number) =>
    fetchFromTMDB<any>(`/person/${id}`),

  getPersonCredits: async (id: number) =>
    fetchFromTMDB<{ cast: any[]; crew: any[] }>(
      `/person/${id}/combined_credits`
    ),

  getTrendingPeople: async (timeWindow: 'day' | 'week' = 'week') =>
    fetchFromTMDB<TMDBListResponse<any>>(`/trending/person/${timeWindow}`),
}