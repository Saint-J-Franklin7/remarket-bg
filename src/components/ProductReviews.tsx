import { getFakeReviews } from '@/lib/fakeReviews'

function formatDaysAgo(days: number) {
  if (days < 7) return `преди ${days} ${days === 1 ? 'ден' : 'дни'}`
  if (days < 30) {
    const weeks = Math.round(days / 7)
    return `преди ${weeks} ${weeks === 1 ? 'седмица' : 'седмици'}`
  }
  const months = Math.round(days / 30)
  return `преди ${months} ${months === 1 ? 'месец' : 'месеца'}`
}

export default function ProductReviews({ productId }: { productId: string }) {
  const reviews = getFakeReviews(productId)

  return (
    <div id="reviews" className="mt-10 pt-8 border-t border-border scroll-mt-24">
      <h2 className="text-lg font-bold text-dark mb-5">Отзиви от клиенти</h2>
      <div className="space-y-5">
        {reviews.map((r, i) => (
          <div key={i} className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-sm text-dark">{r.name}</span>
              <div className="flex items-center shrink-0">
                {[0, 1, 2, 3, 4].map(s => (
                  <svg key={s} viewBox="0 0 20 20" className={`w-3.5 h-3.5 ${s < r.rating ? 'fill-amber-400' : 'fill-gray-200'}`}>
                    <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400">{formatDaysAgo(r.daysAgo)}</span>
            </div>
            {r.text && <p className="text-sm text-gray-500 leading-relaxed break-words mt-1">{r.text}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
