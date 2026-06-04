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
        body: JSON.stringify({ filter: { nameFilter: q } }),
      }
    )

    if (!res.ok) throw new Error(`Econt responded with ${res.status}`)

    const data = await res.json()

    const offices = (data.offices || [])
      .filter((o: Record<string, unknown>) => {
        const addr = o.address as Record<string, unknown> | undefined
        const country = (addr?.city as Record<string, unknown> | undefined)?.country as Record<string, unknown> | undefined
        return country?.code2 === 'BG'
      })
      .slice(0, 25)
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

    return NextResponse.json({ offices })
  } catch (err) {
    console.error('[Econt offices]', err)
    return NextResponse.json({ offices: [], error: 'Failed to fetch offices' }, { status: 500 })
  }
}
