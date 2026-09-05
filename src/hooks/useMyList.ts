import { useState, useEffect, useCallback } from 'react'
import { MyListItem } from '@/types/media'
import { getMyList, addToMyList, removeFromMyList, isInMyList } from '@/lib/storage/myList'

export function useMyList() {
  const [items, setItems] = useState<MyListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setItems(getMyList())
    setLoading(false)
  }, [])

  const add = useCallback((item: Omit<MyListItem, 'addedAt'>) => {
    const updatedList = addToMyList(item)
    setItems(updatedList)
  }, [])

  const remove = useCallback((tmdbId: number, mediaType: 'movie' | 'tv') => {
    const updatedList = removeFromMyList(tmdbId, mediaType)
    setItems(updatedList)
  }, [])

  const isInList = useCallback((tmdbId: number, mediaType: 'movie' | 'tv') => {
    return isInMyList(tmdbId, mediaType)
  }, [])

  const toggle = useCallback((item: Omit<MyListItem, 'addedAt'>) => {
    if (isInMyList(item.tmdbId, item.mediaType)) {
      remove(item.tmdbId, item.mediaType)
    } else {
      add(item)
    }
  }, [add, remove])

  return {
    items,
    loading,
    add,
    remove,
    toggle,
    isInList,
  }
}