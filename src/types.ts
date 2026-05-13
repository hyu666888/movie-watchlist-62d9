export type Shelf = 'want' | 'watching' | 'watched' | null

export interface Movie {
  id: string
  title: string
  year: number
  director: string
  genre: string
  posterBg: string
  posterText: string
}

export interface WatchlistEntry {
  movieId: string
  shelf: Shelf
  rating: number | null
  note?: string
}
