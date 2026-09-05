const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_TOKEN = process.env.TMDB_API_TOKEN

// Log token status on server only
if (typeof window === 'undefined') {
  if (!TMDB_API_TOKEN) {
    console.error('❌ TMDB_API_TOKEN is not defined in environment variables')
    console.error('Please create a .env.local file with TMDB_API_TOKEN=your_token')
  } else {
    console.log('✅ TMDB_API_TOKEN loaded (length:', TMDB_API_TOKEN.length, 'characters)')
    console.log('🔑 Token preview:', TMDB_API_TOKEN.substring(0, 20) + '...')
  }
}

const headers = {
  Authorization: `Bearer ${TMDB_API_TOKEN}`,
  'Content-Type': 'application/json',
}

async function fetchFromTMDB<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  console.log('🔍 Fetching:', url.toString())

  try {
    const response = await fetch(url.toString(), { headers })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ TMDB API Error:', response.status, response.statusText)
      console.error('Error details:', errorText)
      throw new Error(`TMDB API error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error('❌ Fetch error:', error)
    throw error
  }
}

export const tmdbClient = {
  getTrending: async (mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day') => {
    return fetchFromTMDB<any>(`/trending/${mediaType}/${timeWindow}`)
  },

  getPopularMovies: async (page: number = 1) => {
    return fetchFromTMDB<any>('/movie/popular', { page })
  },

  getTopRatedMovies: async (page: number = 1) => {
    return fetchFromTMDB<any>('/movie/top_rated', { page })
  },

  getUpcomingMovies: async (page: number = 1) => {
    return fetchFromTMDB<any>('/movie/upcoming', { page })
  },

  getNowPlayingMovies: async (page: number = 1) => {
    return fetchFromTMDB<any>('/movie/now_playing', { page })
  },

  getMovieDetails: async (id: number) => {
    return fetchFromTMDB<any>(`/movie/${id}`)
  },

  getMovieCredits: async (id: number) => {
    return fetchFromTMDB<any>(`/movie/${id}/credits`)
  },

  getMovieSimilar: async (id: number, page: number = 1) => {
    return fetchFromTMDB<any>(`/movie/${id}/similar`, { page })
  },

  getMovieImages: async (id: number) => {
    return fetchFromTMDB<any>(`/movie/${id}/images`)
  },

  getPopularTV: async (page: number = 1) => {
    return fetchFromTMDB<any>('/tv/popular', { page })
  },

  getTopRatedTV: async (page: number = 1) => {
    return fetchFromTMDB<any>('/tv/top_rated', { page })
  },

  getTVDetails: async (id: number) => {
    return fetchFromTMDB<any>(`/tv/${id}`)
  },

  getTVCredits: async (id: number) => {
    return fetchFromTMDB<any>(`/tv/${id}/credits`)
  },

  getTVSimilar: async (id: number, page: number = 1) => {
    return fetchFromTMDB<any>(`/tv/${id}/similar`, { page })
  },

  getTVImages: async (id: number) => {
    return fetchFromTMDB<any>(`/tv/${id}/images`)
  },

  getTVSeason: async (id: number, seasonNumber: number) => {
    return fetchFromTMDB<any>(`/tv/${id}/season/${seasonNumber}`)
  },

  searchMulti: async (query: string, page: number = 1) => {
    return fetchFromTMDB<any>('/search/multi', { query, page })
  },

  getMovieGenres: async () => {
    return fetchFromTMDB<any>('/genre/movie/list')
  },

  getTVGenres: async () => {
    return fetchFromTMDB<any>('/genre/tv/list')
  },

  // Single discoverMovies method
  discoverMovies: async (params: Record<string, any>) => {
    return fetchFromTMDB<any>('/discover/movie', params)
  },

  // Single discoverTV method
  discoverTV: async (params: Record<string, any>) => {
    return fetchFromTMDB<any>('/discover/tv', params)
  },
}