import { useState } from 'react'
import { MOVIES } from './data/movies'
import { useWatchlist } from './hooks/useWatchlist'
import { MovieCard } from './components/MovieCard'
import { MovieModal } from './components/MovieModal'
import type { Movie, Shelf } from './types'

type Tab = 'all' | Exclude<Shelf, null>

const TABS: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All Films' },
  { id: 'want', label: 'Want to Watch' },
  { id: 'watching', label: 'Watching' },
  { id: 'watched', label: 'Watched' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const { setShelf, setRating, getEntry, shelfCount } = useWatchlist()

  const visibleMovies = MOVIES.filter(movie => {
    if (activeTab === 'all') return true
    const entry = getEntry(movie.id)
    return entry?.shelf === activeTab
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0d0d0d', color: '#e8e8e8' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-4 border-b"
        style={{
          backgroundColor: '#0d0d0ddd',
          borderColor: '#222',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-baseline gap-2 mb-4">
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

          {/* Shelf tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1">
            {TABS.map(tab => {
              const count = tab.id !== 'all' ? shelfCount(tab.id as Shelf) : null
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 whitespace-nowrap"
                  style={{
                    backgroundColor: isActive ? '#e8a045' : '#1c1c1c',
                    color: isActive ? '#0d0d0d' : '#888',
                    fontSize: '13px',
                  }}
                >
                  {tab.label}
                  {count !== null && count > 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full text-xs font-bold"
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
              No films here yet
            </p>
            <p className="text-sm" style={{ color: '#3a3a3a' }}>
              Add films from the All Films tab
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
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  )
}
