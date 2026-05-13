import { useState } from 'react'
import { MOVIES } from './data/movies'
import { useWatchlist } from './hooks/useWatchlist'
import { MovieCard } from './components/MovieCard'
import { MovieModal } from './components/MovieModal'
import type { Movie, Shelf } from './types'

type Tab = 'all' | Exclude<Shelf, null>
type Decade = 'all' | '70s-80s' | '90s' | '2000s' | '2010s' | '2020s'

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All Films' },
  { id: 'want', label: 'Want to Watch' },
  { id: 'watching', label: 'Watching' },
  { id: 'watched', label: 'Watched' },
]

const DECADES: { id: Decade; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: '70s-80s', label: "70s–80s" },
  { id: '90s', label: '90s' },
  { id: '2000s', label: '2000s' },
  { id: '2010s', label: '2010s' },
  { id: '2020s', label: '2020s' },
]

function matchesDecade(year: number, decade: Decade): boolean {
  if (decade === 'all') return true
  if (decade === '70s-80s') return year >= 1970 && year <= 1989
  if (decade === '90s') return year >= 1990 && year <= 1999
  if (decade === '2000s') return year >= 2000 && year <= 2009
  if (decade === '2010s') return year >= 2010 && year <= 2019
  if (decade === '2020s') return year >= 2020
  return true
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [search, setSearch] = useState('')
  const [decade, setDecade] = useState<Decade>('all')
  const { setShelf, setRating, setNote, getEntry, shelfCount, totalWatched, totalRated } = useWatchlist()

  const query = search.trim().toLowerCase()

  const visibleMovies = MOVIES.filter(movie => {
    if (activeTab !== 'all' && getEntry(movie.id)?.shelf !== activeTab) return false
    if (!matchesDecade(movie.year, decade)) return false
    if (query && !movie.title.toLowerCase().includes(query) && !movie.director.toLowerCase().includes(query)) return false
    return true
  })

  const hasFilters = query !== '' || decade !== 'all'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#e8e8e8' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 pt-4 pb-3 border-b"
        style={{
          backgroundColor: '#0d0d0ddd',
          borderColor: '#222',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-baseline gap-2">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                color: '#f0f0f0',
                letterSpacing: '-0.01em',
              }}
            >
              Reelkeeper
            </h1>
            <span style={{ color: '#e8a045', fontSize: '18px' }}>✦</span>
          </div>
          <p className="text-xs mb-3 mt-0.5" style={{ color: '#555' }}>
            {totalWatched} of {MOVIES.length} watched
            {totalRated > 0 && (
              <> · <span style={{ color: '#e8a04599' }}>{totalRated} rated</span></>
            )}
          </p>

          {/* Shelf tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1 mb-3">
            {TABS.map(tab => {
              const count = tab.id !== 'all' ? shelfCount(tab.id as Shelf) : null
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all duration-150 whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? '#e8a045' : '#1c1c1c',
                    color: isActive ? '#0d0d0d' : '#888',
                    fontSize: '13px',
                  }}
                >
                  {tab.label}
                  {count !== null && count > 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full font-bold"
                      style={{
                        backgroundColor: isActive ? 'rgba(0,0,0,0.2)' : '#2e2e2e',
                        color: isActive ? '#0d0d0d' : '#e8a045',
                        fontSize: '11px',
                        minWidth: '18px',
                        textAlign: 'center',
                      }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Search bar */}
          <div className="relative mb-2">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
              style={{ color: '#555' }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by title or director…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: '#1c1c1c',
                color: '#e8e8e8',
                border: '1px solid',
                borderColor: search ? '#e8a04566' : '#2e2e2e',
                fontSize: '13px',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: '#555' }}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Decade pills */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
            {DECADES.map(d => {
              const isActive = decade === d.id
              return (
                <button
                  key={d.id}
                  onClick={() => setDecade(d.id)}
                  className="flex-shrink-0 px-3 py-1 rounded-full font-medium transition-all duration-150 whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? '#e8a04522' : 'transparent',
                    color: isActive ? '#e8a045' : '#555',
                    border: `1px solid ${isActive ? '#e8a04566' : '#2a2a2a'}`,
                    fontSize: '12px',
                  }}
                >
                  {d.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Movie grid */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {visibleMovies.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            style={{ color: '#444' }}
          >
            <div className="text-5xl mb-4 opacity-40">🎬</div>
            <p
              className="text-lg font-serif mb-1"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#555' }}
            >
              {hasFilters ? 'No films match' : 'No films here yet'}
            </p>
            <p className="text-sm" style={{ color: '#3a3a3a' }}>
              {hasFilters ? 'Try a different search or filter' : 'Add films from the All Films tab'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {visibleMovies.map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                entry={getEntry(movie.id)}
                onClick={() => setSelectedMovie(movie)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          entry={getEntry(selectedMovie.id)}
          onSetShelf={shelf => setShelf(selectedMovie.id, shelf)}
          onSetRating={rating => setRating(selectedMovie.id, rating)}
          onSetNote={note => setNote(selectedMovie.id, note)}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}
