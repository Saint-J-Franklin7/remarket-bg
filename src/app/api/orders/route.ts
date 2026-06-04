import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { Order } from '@/lib/types'
import { sendOrderConfirmationToCustomer, sendNewOrderToSeller } from '@/lib/emails'

const orders = new Map<string, Order>()

async function createEcontShipment(order: Order): Promise<string | null> {
  const user = process.env.ECONT_USER
  const pass = process.env.ECONT_PASS
  const senderOfficeCode = process.env.ECONT_SENDER_OFFICE_CODE
  if (!user || !pass || !senderOfficeCode) return null

  try {
    const auth = Buffer.from(`${user}:${pass}`).toString('base64')
    const res = await fetch(
      'https://ee.econt.com/services/Shipments/ShipmentsService.createShipments.json',
      {
        method: 'POST',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipments: [{
            shipmentType: 'PACK',
            senderOfficeCode,
            receiverClient: {
              name: order.customer.name,
              phones: [{ number: order.customer.phone }],
            },
            receiverOfficeCode: order.delivery.officeId,
            weight: 1,
            services: {
              cdAmount: order.total,
              cdType: 'get',
            },
            instructions: [{ type: 'PACKING', description: 'Стоки' }],
          }],
        }),
      }
    )
    const data = await res.json()
    return data.shipments?.[0]?.shipmentNumber || null
  } catch (err) {
    console.error('[Econt createShipment]', err)
    return null
  }
}

async function getSpeedyClientId(user: string, pass: string): Promise<number> {
  const res = await fetch('https://api.speedy.bg/v1/client/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: user, password: pass, language: 'BG' }),
  })
  const data = await res.json()
  return data.clientId
}

async function getSpeedyWaybillPdf(trackingNumber: string): Promise<string | null> {
  const user = process.env.SPEEDY_USER
  const pass = process.env.SPEEDY_PASS
  if (!user || !pass) return null
  try {
    const res = await fetch('https://api.speedy.bg/v1/print/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: user,
        password: pass,
        language: 'BG',
        parcels: [{ id: Number(trackingNumber) }],
        labelFormat: 'PDF',
        additionalBarcodeRows: 0,
      }),
    })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    return Buffer.from(buf).toString('base64')
  } catch {
    return null
  }
}

async function createSpeedyShipment(order: Order): Promise<string | null> {
  const user = process.env.SPEEDY_USER
  const pass = process.env.SPEEDY_PASS
  const senderOfficeId = process.env.SPEEDY_SENDER_OFFICE_ID
  if (!user || !pass || !senderOfficeId) return null

  try {
    const clientId = await getSpeedyClientId(user, pass)
    const res = await fetch('https://api.speedy.bg/v1/shipment/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: user,
        password: pass,
        language: 'BG',
        sender: {
          clientId,
          dropOffOfficeId: Number(senderOfficeId),
        },
        recipient: {
          clientName: order.customer.name,
          privatePerson: true,
          phone1: { number: order.customer.phone },
          pickupOfficeId: Number(order.delivery.officeId),
        },
        service: { serviceId: 505, autoAdjustPickupDate: true },
        content: { parcelsCount: 1, totalWeight: 1, contents: 'Стоки', package: 'BOX' },
        payment: {
          courierServicePayer: 'SENDER',
          cod: { amount: order.total, currency: 'BGN', processingType: 'CASH' },
        },
      }),
    })
    const data = await res.json()
    return data.id ? String(data.id) : null
  } catch (err) {
    console.error('[Speedy createShipment]', err)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer, delivery, items, subtotal, total } = body

    if (!customer?.name || !customer?.phone || !delivery?.courier || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Липсват задължителни полета' }, { status: 400 })
    }

    const order: Order = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      customer,
      delivery,
      items,
      subtotal: Number(subtotal),
      total: Number(total),
      status: 'pending',
    }

    // Créer le shipment chez le bon coursier
    let trackingNumber: string | null = null
    if (delivery.courier === 'econt') {
      trackingNumber = await createEcontShipment(order)
    } else if (delivery.courier === 'speedy') {
      trackingNumber = await createSpeedyShipment(order)
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber
      order.status = 'confirmed'
    }

    orders.set(order.id, order)

    // Récupérer le PDF waybill Speedy et envoyer les emails (non bloquant)
    const waybillPdf = order.trackingNumber && order.delivery.courier === 'speedy'
      ? await getSpeedyWaybillPdf(order.trackingNumber).catch(() => null)
      : null

    Promise.all([
      sendNewOrderToSeller(order, waybillPdf),
      sendOrderConfirmationToCustomer(order),
    ]).catch(err => console.error('[Emails]', err))

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    console.error('[Orders POST]', err)
    return NextResponse.json({ error: 'Грешка при създаване на поръчка' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')
  if (id) {
    const order = orders.get(id)
    if (!order) return NextResponse.json({ error: 'Не е намерена' }, { status: 404 })
    return NextResponse.json(order)
  }
  return NextResponse.json({ orders: Array.from(orders.values()) })
}
