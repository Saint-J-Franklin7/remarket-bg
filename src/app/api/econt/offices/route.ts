import { NextRequest, NextResponse } from 'next/server'

const ECONT_BASE = 'https://ee.econt.com/services'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || ''
  if (q.length < 2) return NextResponse.json({ offices: [] })

  const user = process.env.ECONT_USER
  const pass = process.env.ECONT_PASS

  if (!user || !pass) {
    return NextResponse.json({ offices: [], error: 'Econt credentials not configured' }, { status: 503 })
  }

  try {
    const auth = Buffer.from(`${user}:${pass}`).toString('base64')
    const res = await fetch(
      `${ECONT_BASE}/Nomenclatures/NomenclaturesService.getOffices.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    )

    if (!res.ok) throw new Error(`Econt responded with ${res.status}`)

    const data = await res.json()

    const ql = q.toLowerCase()

    const offices = (data.offices || [])
      .filter((o: Record<string, unknown>) => {
        const addr = o.address as Record<string, unknown> | undefined
        const city = addr?.city as Record<string, unknown> | undefined
        const country = city?.country as Record<string, unknown> | undefined
        if (country?.code2 !== 'BG') return false
        const officeName = (o.name as string | undefined) || ''
        if (/апс|aps|еконтомат|econt.*mat|automat/i.test(officeName)) return false
        const cityName = (city?.name as string | undefined)?.toLowerCase() || ''
        const street = (addr?.street as string | undefined)?.toLowerCase() || ''
        return cityName.includes(ql) || officeName.toLowerCase().includes(ql) || street.includes(ql)
      })
      .map((o: Record<string, unknown>) => {
        const addr = o.address as Record<string, unknown>
        const city = addr?.city as Record<string, unknown> | undefined
        const street = addr?.street as string | undefined
        const num = addr?.num as string | undefined
        const cityName = city?.name as string | undefined
        return {
          id: String(o.id),
          name: o.name as string,
          address: [street, num, cityName].filter(Boolean).join(', '),
          city: cityName || '',
          courier: 'econt',
        }
      })
      .sort((a: { city: string; name: string }, b: { city: string; name: string }) => {
        const aCityExact = a.city.toLowerCase() === ql
        const bCityExact = b.city.toLowerCase() === ql
        if (aCityExact && !bCityExact) return -1
        if (!aCityExact && bCityExact) return 1
        return a.name.localeCompare(b.name, 'bg')
      })
      .slice(0, 20)

    return NextResponse.json({ offices })
  } catch (err) {
    console.error('[Econt offices]', err)
    return NextResponse.json({ offices: [], error: 'Failed to fetch offices' }, { status: 500 })
  }
}
