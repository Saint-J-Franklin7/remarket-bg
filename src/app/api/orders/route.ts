import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { Order } from '@/lib/types'
import { sendOrderConfirmationToCustomer, sendNewOrderToSeller } from '@/lib/emails'

const orders = new Map<string, Order>()

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

    orders.set(order.id, order)

    Promise.all([
      sendNewOrderToSeller(order),
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
