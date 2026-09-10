import { WatchHistoryItem } from '@/types/media'

const STORAGE_KEY = 'cinevin_watch_history'
const MAX_ITEMS = 50

function safeGet(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function safeSet(items: WatchHistoryItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (err) {
    console.error('Failed to save watch history:', err)
  }
}

export function getWatchHistory(): WatchHistoryItem[] {
  return safeGet().sort(
    (a, b) =>
      new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime()
  )
}

export function addToWatchHistory(
  item: Omit<WatchHistoryItem, 'lastWatched'>
): WatchHistoryItem[] {
  const existing = safeGet()

  // Dedupe: same title + same episode
  const filtered = existing.filter(i => {
    if (i.mediaType === 'movie') {
      return !(i.tmdbId === item.tmdbId && i.mediaType === 'movie')
    }
    return !(
      i.tmdbId === item.tmdbId &&
      i.mediaType === 'tv' &&
      i.season === item.season &&
      i.episode === item.episode
    )
  })

  const newItem: WatchHistoryItem = {
    ...item,
    progress: item.progress ?? 0,
    lastWatched: new Date().toISOString(),
  }

  const updated = [newItem, ...filtered].slice(0, MAX_ITEMS)
  safeSet(updated)
  return getWatchHistory()
}

export function updateWatchProgress(
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  progress: number,
  season?: number,
  episode?: number
): WatchHistoryItem[] {
  const existing = safeGet()

  const updated = existing.map(i => {
    if (i.tmdbId !== tmdbId || i.mediaType !== mediaType) return i
    if (
      mediaType === 'tv' &&
      (i.season !== season || i.episode !== episode)
    ) {
      return i
    }
    return {
      ...i,
      progress: Math.max(0, Math.min(100, progress)),
      lastWatched: new Date().toISOString(),
    }
  })

  safeSet(updated)
  return getWatchHistory()
}

export function removeFromWatchHistory(
  tmdbId: number,
  mediaType: 'movie' | 'tv',
  season?: number,
  episode?: number
): WatchHistoryItem[] {
  const filtered = safeGet().filter(i => {
    if (i.tmdbId !== tmdbId || i.mediaType !== mediaType) return true
    if (mediaType === 'movie') return false
    return !(i.season === season && i.episode === episode)
  })
  safeSet(filtered)
  return getWatchHistory()
}

export function clearWatchHistory(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
} 