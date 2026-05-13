import { useEffect } from 'react'
import type { Movie, Shelf, WatchlistEntry } from '../types'
import { StarRating } from './StarRating'

interface Props {
  movie: Movie
  entry: WatchlistEntry | null
  onSetShelf: (shelf: Shelf) => void
  onSetRating: (rating: number) => void
  onClose: () => void
}

const SHELVES: { shelf: Exclude<Shelf, null>; label: string; icon: string }[] = [
  { shelf: 'want', label: 'Want to Watch', icon: '🔖' },
  { shelf: 'watching', label: 'Watching', icon: '▶️' },
  { shelf: 'watched', label: 'Watched', icon: '✓' },
]

const SHELF_COLORS: Record<string, string> = {
  want: '#e8a045',
  watching: '#72b4e8',
  watched: '#72e8a0',
}

export function MovieModal({ movie, entry, onSetShelf, onSetRating, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const posterUrl = `https://placehold.co/300x450/${movie.posterBg}/${movie.posterText}?text=${encodeURIComponent(movie.title)}&font=playfair-display`

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{ backgroundColor: '#1c1c1c', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#444' }} />
        </div>

        {/* Header with poster */}
        <div className="flex gap-4 p-4 pb-3">
          <img
            src={posterUrl}
            alt={`${movie.title} poster`}
            className="w-20 h-30 rounded-lg object-cover flex-shrink-0"
            style={{ width: '80px', height: '120px' }}
          />
          <div className="flex flex-col justify-center gap-1.5 min-w-0">
            <h2
              className="font-serif font-bold leading-tight"
              style={{
                color: '#f0f0f0',
                fontSize: '1.2rem',
                fontFamily: '"Playfair Display", Georgia, serif',
              }}
            >
              {movie.title}
            </h2>
            <div style={{ color: '#aaa', fontSize: '13px' }}>{movie.year}</div>
            <div style={{ color: '#888', fontSize: '12px' }}>
              Directed by {movie.director}
            </div>
            <div
              className="text-xs px-2 py-0.5 rounded self-start mt-1"
              style={{ backgroundColor: '#2e2e2e', color: '#e8a045', fontSize: '11px' }}
            >
              {movie.genre}
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto self-start p-1 rounded-full flex-shrink-0"
            style={{ color: '#666' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-4 pb-2">
          <div className="h-px" style={{ backgroundColor: '#2e2e2e' }} />
        </div>

        {/* Shelf selector */}
        <div className="px-4 pb-4">
          <div className="text-xs font-medium mb-3 tracking-widest uppercase" style={{ color: '#666' }}>
            Add to Shelf
          </div>
          <div className="flex flex-col gap-2">
            {SHELVES.map(({ shelf, label, icon }) => {
              const isActive = entry?.shelf === shelf
              const color = SHELF_COLORS[shelf]
              return (
                <button
                  key={shelf}
                  onClick={() => onSetShelf(isActive ? null : shelf)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 active:scale-[0.98]"
                  style={{
                    backgroundColor: isActive ? color + '1a' : '#2e2e2e',
                    color: isActive ? color : '#ccc',
                    border: `1px solid ${isActive ? color + '44' : 'transparent'}`,
                  }}
                >
                  <span className="text-base w-5 text-center">{icon}</span>
                  <span>{label}</span>
                  {isActive && (
                    <span className="ml-auto text-xs opacity-70">✓ Active</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Star rating (Watched only) */}
        {entry?.shelf === 'watched' && (
          <>
            <div className="px-4 pb-2">
              <div className="h-px" style={{ backgroundColor: '#2e2e2e' }} />
            </div>
            <div className="px-4 pb-6">
              <div className="text-xs font-medium mb-3 tracking-widest uppercase" style={{ color: '#666' }}>
                Your Rating
              </div>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={entry.rating}
                  onChange={onSetRating}
                  size="md"
                />
                {entry.rating && (
                  <span className="text-sm" style={{ color: '#e8a045' }}>
                    {entry.rating} / 5
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
