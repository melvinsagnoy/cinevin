import { WatchHistoryItem } from '@/types/media'

const STORAGE_KEY = 'cineva_watch_history'

export function getWatchHistory(): WatchHistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToWatchHistory(item: Omit<WatchHistoryItem, 'lastWatched'>): WatchHistoryItem[] {
  const history = getWatchHistory()
  
  const filteredHistory = history.filter(i => {
    if (i.mediaType === 'movie') {
      return !(i.tmdbId === item.tmdbId && i.mediaType === 'movie')
    } else {
      return !(
        i.tmdbId === item.tmdbId &&
        i.mediaType === 'tv' &&
        i.season === item.season &&
        i.episode === item.episode
      )
    }
  })
  
  const newItem: WatchHistoryItem = {
    ...item,
    lastWatched: new Date().toISOString(),
  }
  
  const updatedHistory = [newItem, ...filteredHistory].slice(0, 100)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
  return updatedHistory
}