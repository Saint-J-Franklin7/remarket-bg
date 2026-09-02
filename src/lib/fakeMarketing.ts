// Deterministic per-product "social proof" numbers — same product always shows the same
// values (no re-randomizing on reload), but each product looks different from the others.
function seededRandom(seed: string): number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0
  }
  return (h % 10000) / 10000
}

export function getCompareAtPrice(productId: string, price: number): number {
  const pct = 0.2 + seededRandom(productId + ':discount') * 0.15 // 20–35% higher
  return Math.round(price * (1 + pct)) - 0.01
}

export function getFakeRating(productId: string): { rating: number; count: number } {
  const rating = Math.round((4 + seededRandom(productId + ':rating') * 0.5) * 10) / 10
  const count = 50 + Math.floor(seededRandom(productId + ':count') * 151)
  return { rating, count }
}
