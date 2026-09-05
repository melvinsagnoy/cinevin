import { POSTER_SIZES, BACKDROP_SIZES, PROFILE_SIZES, TMDB_IMAGE_BASE_URL } from './constants'

export function getImageUrl(
  path: string | null,
  size: string = POSTER_SIZES.medium,
  baseUrl: string = TMDB_IMAGE_BASE_URL
): string | null {
  if (!path) return null
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  const cleanSize = size.startsWith('/') ? size.substring(1) : size
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBaseUrl}${cleanSize}${cleanPath}`
}

export function getBackdropUrl(path: string | null, size: keyof typeof BACKDROP_SIZES = 'large'): string | null {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${BACKDROP_SIZES[size]}${path}`
}

export function getPosterUrl(path: string | null, size: keyof typeof POSTER_SIZES = 'medium'): string | null {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${POSTER_SIZES[size]}${path}`
}

export function getProfileUrl(path: string | null, size: keyof typeof PROFILE_SIZES = 'medium'): string | null {
  if (!path) return null
  return `https://image.tmdb.org/t/p/${PROFILE_SIZES[size]}${path}`
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatYear(dateString: string): string {
  return new Date(dateString).getFullYear().toString()
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}