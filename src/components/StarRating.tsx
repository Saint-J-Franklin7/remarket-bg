import { getFakeRating } from '@/lib/fakeMarketing'

export default function StarRating({ productId, className = '' }: { productId: string; className?: string }) {
  const { rating, count } = getFakeRating(productId)

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center">
        {[0, 1, 2, 3, 4].map(i => {
          const fill = Math.max(0, Math.min(1, rating - i)) * 100
          return (
            <div key={i} className="relative w-4 h-4">
              <svg viewBox="0 0 20 20" className="absolute inset-0 w-4 h-4 fill-gray-200">
                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
              </svg>
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <svg viewBox="0 0 20 20" className="w-4 h-4 fill-amber-400">
                  <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
      <span className="text-xs text-gray-400">{rating.toFixed(1)} · {count} отзива</span>
    </div>
  )
}
