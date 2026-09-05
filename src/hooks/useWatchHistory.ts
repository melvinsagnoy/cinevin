import { useState, useEffect, useCallback } from 'react'
import { WatchHistoryItem } from '@/types/media'
import { getWatchHistory, addToWatchHistory } from '@/lib/storage/watchHistory'

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setHistory(getWatchHistory())
    setLoading(false)
  }, [])

  const add = useCallback((item: Omit<WatchHistoryItem, 'lastWatched'>) => {
    const updatedHistory = addToWatchHistory(item)
    setHistory(updatedHistory)
  }, [])

  return {
    history,
    loading,
    add,
  }
}