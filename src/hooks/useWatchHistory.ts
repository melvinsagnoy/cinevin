import { useState, useEffect, useCallback } from 'react'
import { WatchHistoryItem } from '@/types/media'
import {
  getWatchHistory,
  addToWatchHistory,
  updateWatchProgress,
  removeFromWatchHistory,
  clearWatchHistory,
} from '@/lib/storage/watchHistory'

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    setHistory(getWatchHistory())
  }, [])

  useEffect(() => {
    refresh()
    setLoading(false)
  }, [refresh])

  const add = useCallback(
    (item: Omit<WatchHistoryItem, 'lastWatched'>) => {
      const updated = addToWatchHistory(item)
      setHistory(updated)
    },
    []
  )

  const updateProgress = useCallback(
    (
      tmdbId: number,
      mediaType: 'movie' | 'tv',
      progress: number,
      season?: number,
      episode?: number
    ) => {
      const updated = updateWatchProgress(
        tmdbId,
        mediaType,
        progress,
        season,
        episode
      )
      setHistory(updated)
    },
    []
  )

  const remove = useCallback(
    (
      tmdbId: number,
      mediaType: 'movie' | 'tv',
      season?: number,
      episode?: number
    ) => {
      const updated = removeFromWatchHistory(
        tmdbId,
        mediaType,
        season,
        episode
      )
      setHistory(updated)
    },
    []
  )

  const clear = useCallback(() => {
    clearWatchHistory()
    setHistory([])
  }, [])

  return {
    history,
    loading,
    add,
    updateProgress,
    remove,
    clear,
    refresh,
  }
}