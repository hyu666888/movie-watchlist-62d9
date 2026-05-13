interface Props {
  rating: number | null
  onChange?: (rating: number) => void
  size?: 'sm' | 'md'
}

export function StarRating({ rating, onChange, size = 'md' }: Props) {
  const starSize = size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={`${starSize} transition-all duration-150 ${
            onChange ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'
          } ${star <= (rating ?? 0) ? 'text-amber-film' : 'text-charcoal-500'}`}
          style={{ color: star <= (rating ?? 0) ? '#e8a045' : '#3a3a3a' }}
          aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
