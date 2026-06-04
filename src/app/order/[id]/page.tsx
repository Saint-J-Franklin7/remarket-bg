'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { Order } from '@/lib/types'

interface TrackingEvent {
  date: string
  description: string
  status: string
}

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [tracking, setTracking] = useState<TrackingEvent[]>([])
  const [loadingTracking, setLoadingTracking] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(`order-${id}`)
    if (!stored) return
    const parsed: Order = JSON.parse(stored)
    setOrder(parsed)

    if (parsed.trackingNumber) {
      setLoadingTracking(true)
      fetch(`/api/track/${parsed.delivery.courier}/${parsed.trackingNumber}`)
        .then(r => r.json())
        .then(data => setTracking(data.events || []))
        .catch(() => {})
        .finally(() => setLoadingTracking(false))
    }
  }, [id])

  const statusMap: Record<string, { label: string; color: string }> = {
    pending:   { label: 'Получена',   color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Потвърдена', color: 'bg-blue-100 text-blue-700' },
    shipped:   { label: 'Изпратена',  color: 'bg-orange-100 text-orange-700' },
    delivered: { label: 'Доставена',  color: 'bg-green-100 text-green-700' },
  }

  if (!order) {
    return (
      <main className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-dark mb-2">Поръчката не е намерена</h1>
        <p className="text-gray-400 text-sm mb-6">Поръчките се пазят само в браузъра ви</p>
        <Link href="/" className="text-brand font-medium hover:underline">← Към начало</Link>
      </main>
    )
  }

  const { label: statusLabel, color: statusColor } = statusMap[order.status] || statusMap.pending

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">✅</div>
        <h1 className="text-2xl md:text-3xl font-black mb-2">Поръчката е приета!</h1>
        <p className="text-gray-400">Ще ви се обадим на <strong className="text-dark">{order.customer.phone}</strong> за потвърждение</p>
      </div>

      {/* Order details */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-4">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Поръчка №</p>
            <p className="font-mono font-bold">{id.substring(0, 8).toUpperCase()}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColor}`}>
            {statusLabel}
          </span>
        </div>

        <div className="space-y-2.5 mb-5">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.name} <span className="text-gray-400">× {item.quantity}</span></span>
              <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} лв.</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 flex justify-between font-black text-lg">
          <span>Общо</span>
          <span>{order.total.toFixed(2)} лв.</span>
        </div>
      </div>

      {/* Delivery */}
      <div className="bg-white rounded-2xl border border-border p-6 mb-4">
        <h2 className="font-bold mb-4">Доставка</h2>
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-gray-400 w-20 shrink-0">Куриер</span>
            <span className="font-semibold">{order.delivery.courier === 'econt' ? 'Еконт' : 'Спиди'}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-20 shrink-0">Офис</span>
            <span>{order.delivery.officeName}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-400 w-20 shrink-0">Адрес</span>
            <span>{order.delivery.officeAddress}</span>
          </div>
          {order.trackingNumber && (
            <div className="flex gap-2">
              <span className="text-gray-400 w-20 shrink-0">Номер</span>
              <span className="font-mono font-bold text-brand">{order.trackingNumber}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="bg-white rounded-2xl border border-border p-6 mb-6">
          <h2 className="font-bold mb-4">Проследяване</h2>
          {loadingTracking ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              Зарежда се...
            </div>
          ) : tracking.length > 0 ? (
            <div className="space-y-4">
              {tracking.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${i === 0 ? 'bg-brand' : 'bg-gray-200'}`} />
                    {i < tracking.length - 1 && <div className="w-px flex-1 bg-gray-100 mt-1" />}
                  </div>
                  <div className="pb-2">
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Все още няма информация за проследяване</p>
          )}
        </div>
      )}

      <div className="text-center">
        <Link href="/" className="text-brand font-medium hover:underline text-sm">
          ← Обратно към каталога
        </Link>
      </div>
    </main>
  )
}
