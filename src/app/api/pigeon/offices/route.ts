import { NextRequest, NextResponse } from 'next/server'
import { transliterateToCyrillic } from '@/lib/transliterate'

interface PigeonLocation {
  id: number
  name: string
  city: string
  address: string
  type: 'office' | 'locker'
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || ''
  if (q.length < 2) return NextResponse.json({ offices: [] })

  try {
    const res = await fetch('https://pigeonexpress.com/api/locations', {
      headers: { Accept: 'application/json' },
    })

    if (!res.ok) throw new Error(`Pigeon Express responded with ${res.status}`)

    const data = await res.json()
    const ql = q.toLowerCase()
    const qlTranslit = transliterateToCyrillic(q)

    const offices = ((data.locations || []) as PigeonLocation[])
      .filter(l => {
        const city = l.city.toLowerCase()
        const name = l.name.toLowerCase()
        const address = l.address.toLowerCase()
        return [ql, qlTranslit].some(needle =>
          city.includes(needle) || name.includes(needle) || address.includes(needle)
        )
      })
      .map(l => ({
        id: String(l.id),
        name: l.name,
        address: l.address,
        city: l.city,
        courier: 'pigeon' as const,
      }))
      .sort((a, b) => {
        const aCityExact = [ql, qlTranslit].includes(a.city.toLowerCase())
        const bCityExact = [ql, qlTranslit].includes(b.city.toLowerCase())
        if (aCityExact && !bCityExact) return -1
        if (!aCityExact && bCityExact) return 1
        return a.name.localeCompare(b.name, 'bg')
      })
      .slice(0, 20)

    return NextResponse.json({ offices })
  } catch (err) {
    console.error('[Pigeon offices]', err)
    return NextResponse.json({ offices: [], error: 'Failed to fetch offices' }, { status: 500 })
  }
}
