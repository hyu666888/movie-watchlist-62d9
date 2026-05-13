import { useState, useEffect } from 'react'
import type { Shelf, WatchlistEntry } from '../types'

const STORAGE_KEY = 'reelkeeper-watchlist'

function loadFromStorage(): Record<string, WatchlistEntry> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function useWatchlist() {
  const [entries, setEntries] = useState<Record<string, WatchlistEntry>>(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  function setShelf(movieId: string, shelf: Shelf) {
    setEntries(prev => {
      if (shelf === null) {
        const next = { ...prev }
        delete next[movieId]
        return next
      }
      return {
        ...prev,
        [movieId]: {
          movieId,
          shelf,
          rating: shelf === 'watched' ? (prev[movieId]?.rating ?? null) : null,
        },
      }
    })
  }

  function setRating(movieId: string, rating: number) {
    setEntries(prev => ({
      ...prev,
      [movieId]: {
        ...(prev[movieId] ?? { movieId, shelf: 'watched' }),
        rating,
      },
    }))
  }

  function getEntry(movieId: string): WatchlistEntry | null {
    return entries[movieId] ?? null
  }

  function shelfCount(shelf: Shelf): number {
    if (shelf === null) return 0
    return Object.values(entries).filter(e => e.shelf === shelf).length
  }

  return { entries, setShelf, setRating, getEntry, shelfCount }
}
