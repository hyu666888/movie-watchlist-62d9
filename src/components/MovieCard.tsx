import type { Movie, WatchlistEntry } from '../types'
import { StarRating } from './StarRating'

interface Props {
  movie: Movie
  entry: WatchlistEntry | null
  onClick: () => void
}

const SHELF_BADGE: Record<string, { label: string; color: string }> = {
  want: { label: 'Want to Watch', color: '#e8a045' },
  watching: { label: 'Watching', color: '#72b4e8' },
  watched: { label: 'Watched', color: '#72e8a0' },
}

export function MovieCard({ movie, entry, onClick }: Props) {
  const posterUrl = `https://placehold.co/300x450/${movie.posterBg}/${movie.posterText}?text=${encodeURIComponent(movie.title)}&font=playfair-display`

  const badge = entry?.shelf ? SHELF_BADGE[entry.shelf] : null

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col bg-charcoal-700 rounded-lg overflow-hidden text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/60 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-film"
      style={{ backgroundColor: '#242424' }}
    >
      {/* Poster */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {badge && (
          <div
            className="absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: badge.color + '22',
              color: badge.color,
              border: `1px solid ${badge.color}44`,
              backdropFilter: 'blur(4px)',
            }}
          >
            {badge.label}
          </div>
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          <span className="text-white text-sm font-medium tracking-wide">View Details</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3
          className="font-serif font-semibold text-sm leading-tight"
          style={{ color: '#e8e8e8', fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {movie.title}
        </h3>
        <div className="text-xs" style={{ color: '#888' }}>
          {movie.year} · {movie.director}
        </div>
        <div
          className="text-xs mt-0.5 px-1.5 py-0.5 rounded self-start"
          style={{ backgroundColor: '#1c1c1c', color: '#e8a045', fontSize: '11px' }}
        >
          {movie.genre}
        </div>
        {entry?.shelf === 'watched' && (
          <div className="mt-1.5">
            <StarRating rating={entry.rating} size="sm" />
          </div>
        )}
      </div>
    </button>
  )
}
