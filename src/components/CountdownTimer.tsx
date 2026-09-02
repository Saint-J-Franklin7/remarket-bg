'use client'

import { useEffect, useState } from 'react'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function msUntilMidnight() {
  const now = new Date()
  const sofiaNow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Sofia' }))
  const sofiaMidnight = new Date(sofiaNow)
  sofiaMidnight.setHours(24, 0, 0, 0)
  return sofiaMidnight.getTime() - sofiaNow.getTime()
}

export default function CountdownTimer() {
  const [remaining, setRemaining] = useState<number | null>(null)

  useEffect(() => {
    function tick() {
      setRemaining(msUntilMidnight())
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
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-red-50 border border-red-200 text-red-600 rounded-xl px-3.5 py-2.5 mb-5 max-w-full">
      <span className="flex items-center gap-1.5 shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-sm font-semibold">Офертата изтича в полунощ:</span>
      </span>
      <span className="text-sm font-black tabular-nums">{pad(h)}:{pad(m)}:{pad(s)}</span>
    </div>
  )
}
