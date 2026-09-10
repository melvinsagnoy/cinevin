import { useMemo } from 'react'
import { useWatchHistory } from './useWatchHistory'
import { WatchHistoryItem } from '@/types/media'

export interface ContinueWatchingItem extends WatchHistoryItem {
  displayTitle: string
  watchHref: string
}

export function useContinueWatching(limit: number = 15) {
  const { history, loading, remove } = useWatchHistory()

  const items = useMemo<ContinueWatchingItem[]>(() => {
    return history
      .filter(item => (item.progress ?? 0) > 0 && (item.progress ?? 0) < 95)
      .slice(0, limit)
      .map(item => {
        let watchHref: string

        if (item.mediaType === 'movie') {
          watchHref = `/watch/movie/${item.tmdbId}`
        } else {
          const season = item.season ?? 1
          const episode = item.episode ?? 1
          watchHref = `/watch/tv/${item.tmdbId}?season=${season}&episode=${episode}`
        }

        const displayTitle =
          item.mediaType === 'tv' && item.season && item.episode
            ? `${item.title} — S${item.season} E${item.episode}`
            : item.title

        return {
          ...item,
          displayTitle,
          watchHref,
        }
      })
  }, [history, limit])

  return {
    items,
    loading,
    remove,
  }
}