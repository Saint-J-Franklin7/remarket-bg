import { NextRequest, NextResponse } from 'next/server'

const ECONT_BASE = 'https://ee.econt.com/services'
const SPEEDY_BASE = 'https://api.speedy.bg/v1'

interface Props {
  params: Promise<{ courier: string; number: string }>
}

export async function GET(_request: NextRequest, { params }: Props) {
  const { courier, number } = await params

  try {
    if (courier === 'econt') {
      const user = process.env.ECONT_USER
      const pass = process.env.ECONT_PASS
      if (!user || !pass) return NextResponse.json({ events: [] })

      const auth = Buffer.from(`${user}:${pass}`).toString('base64')
      const res = await fetch(
        `${ECONT_BASE}/Shipments/ShipmentsService.getShipmentStatusEx.json`,
        {
          method: 'POST',
          headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ shipmentNumbers: [number] }),
        }
      )
      const data = await res.json()
      const ops = (data.shipmentStatus?.[0]?.operations || []) as Record<string, unknown>[]
      const events = ops.map(op => ({
        date: op.date as string,
        description: op.description as string,
        status: op.code as string,
      }))
      return NextResponse.json({ events })
    }

    if (courier === 'speedy') {
      const user = process.env.SPEEDY_USER
      const pass = process.env.SPEEDY_PASS
      if (!user || !pass) return NextResponse.json({ events: [] })

      const res = await fetch(`${SPEEDY_BASE}/track/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user,
          password: pass,
          language: 'BG',
          parcels: [{ id: Number(number) }],
        }),
      })
      const data = await res.json()
      const ops = (data.parcels?.[0]?.operations || []) as Record<string, unknown>[]
      const events = ops.map(op => ({
        date: op.dateTime as string,
        description: op.description as string,
        status: op.operationCode as string,
      }))
      return NextResponse.json({ events })
    }

    return NextResponse.json({ error: 'Invalid courier' }, { status: 400 })
  } catch (err) {
    console.error('[Track]', err)
    return NextResponse.json({ events: [], error: 'Tracking unavailable' }, { status: 500 })
  }
}
