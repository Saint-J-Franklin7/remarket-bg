import Link from 'next/link'
import { getFakeRating } from '@/lib/fakeMarketing'

export default function StarRating({ productId, className = '', compact = false, href }: { productId: string; className?: string; compact?: boolean; href?: string }) {
  const { rating, count } = getFakeRating(productId)

  const content = (
    <>
      <div className="flex items-center shrink-0">
        {[0, 1, 2, 3, 4].map(i => {
          const fill = Math.max(0, Math.min(1, rating - i)) * 100
          return (
            <div key={i} className="relative w-3.5 h-3.5 sm:w-4 sm:h-4">
              <svg viewBox="0 0 20 20" className="absolute inset-0 w-3.5 h-3.5 sm:w-4 sm:h-4 fill-gray-200">
                <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
              </svg>
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill}%` }}>
                <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400">
                  <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
      <span className="text-xs text-gray-400 truncate">
        {compact ? `${rating.toFixed(1)} (${count})` : `${rating.toFixed(1)} · ${count} отзива`}
      </span>
    </>
  )

  const classes = `flex flex-wrap items-center gap-1 gap-y-0.5 min-w-0 ${className}`

  if (href) {
    return (
      <Link href={href} className={`${classes} hover:opacity-70 transition-opacity cursor-pointer`}>
        {content}
      </Link>
    )
  }

  return <div className={classes}>{content}</div>
}
