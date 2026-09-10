/**
 * Centralized revalidation constants for TMDB data.
 */

export const REVALIDATE = {
  TRENDING: 3600,
  POPULAR: 21600,
  TOP_RATED: 86400,
  UPCOMING: 86400,
  NOW_PLAYING: 3600,
  DETAILS: 86400,
  RELATED: 86400,
  SEASON: 86400,
  GENRES: 604800,
  SEARCH: 0,
} as const

export const CACHE_HEADERS = {
  LIST: 'public, s-maxage=3600, stale-while-revalidate=86400',
  DETAILS: 'public, s-maxage=86400, stale-while-revalidate=604800',
  GENRES: 'public, s-maxage=604800, stale-while-revalidate=2592000',
  NONE: 'no-cache, no-store, must-revalidate',
} as const