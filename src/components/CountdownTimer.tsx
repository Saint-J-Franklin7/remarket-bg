'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'remarket-countdown-deadline'
const DURATION = 24 * 60 * 60 * 1000

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function CountdownTimer() {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    function tick() {
      const now = Date.now()
      let deadline = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10)
      if (!deadline || deadline <= now) {
        deadline = now + DURATION
        localStorage.setItem(STORAGE_KEY, String(deadline))
      }
      setRemaining(deadline - now)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  if (remaining === null) return null

  const h = Math.floor(remaining / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  const s = Math.floor((remaining % 60000) / 1000)

  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3.5 py-2.5 mb-5 w-fit">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-sm font-semibold">
        Офертата изтича след: <span className="font-black tabular-nums">{pad(h)}:{pad(m)}:{pad(s)}</span>
      </span>
    </div>
  )
}
