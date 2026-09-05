import { MyListItem } from '@/types/media'

const STORAGE_KEY = 'cineva_mylist'

export function getMyList(): MyListItem[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToMyList(item: Omit<MyListItem, 'addedAt'>): MyListItem[] {
  const list = getMyList()
  const exists = list.some(i => i.tmdbId === item.tmdbId && i.mediaType === item.mediaType)
  if (exists) return list
  
  const newItem: MyListItem = {
    ...item,
    addedAt: new Date().toISOString(),
  }
  
  const updatedList = [...list, newItem]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  return updatedList
}

export function removeFromMyList(tmdbId: number, mediaType: 'movie' | 'tv'): MyListItem[] {
  const list = getMyList()
  const updatedList = list.filter(i => !(i.tmdbId === tmdbId && i.mediaType === mediaType))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
  return updatedList
}

export function isInMyList(tmdbId: number, mediaType: 'movie' | 'tv'): boolean {
  const list = getMyList()
  return list.some(i => i.tmdbId === tmdbId && i.mediaType === mediaType)
}