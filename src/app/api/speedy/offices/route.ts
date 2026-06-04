import { NextRequest, NextResponse } from 'next/server'

const SPEEDY_BASE = 'https://api.speedy.bg/v1'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || ''
  if (q.length < 2) return NextResponse.json({ offices: [] })

  const user = process.env.SPEEDY_USER
  const pass = process.env.SPEEDY_PASS

  if (!user || !pass) {
    return NextResponse.json({ offices: [], error: 'Speedy credentials not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(`${SPEEDY_BASE}/location/office/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: user,
        password: pass,
        language: 'BG',
        countryId: 100,
        name: q,
        maxResults: 25,
      }),
    })

    if (!res.ok) throw new Error(`Speedy responded with ${res.status}`)

    const data = await res.json()
    const offices = (data.offices || []).map((o: Record<string, unknown>) => {
      const addr = o.address as Record<string, unknown> | undefined
      return {
        id: String(o.id),
        name: o.name as string,
        address: [
          addr?.streetName as string,
          addr?.streetNo as string,
          addr?.siteName as string,
        ].filter(Boolean).join(', '),
        city: (addr?.siteName as string) || '',
        courier: 'speedy',
      }
    })

    return NextResponse.json({ offices })
  } catch (err) {
    console.error('[Speedy offices]', err)
    return NextResponse.json({ offices: [], error: 'Failed to fetch offices' }, { status: 500 })
  }
}
