'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { CourierOffice } from '@/lib/types'

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [courier, setCourier] = useState<'econt' | 'speedy'>('econt')
  const [officeQuery, setOfficeQuery] = useState('')
  const [officeResults, setOfficeResults] = useState<CourierOffice[]>([])
  const [selectedOffice, setSelectedOffice] = useState<CourierOffice | null>(null)
  const [loadingOffices, setLoadingOffices] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const dropdownRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(officeQuery, 350)

  // Fetch offices when query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setOfficeResults([])
      setShowDropdown(false)
      return
    }
    setLoadingOffices(true)
    fetch(`/api/${courier}/offices?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => r.json())
      .then(data => {
        setOfficeResults(data.offices || [])
        setShowDropdown(true)
      })
      .catch(() => setOfficeResults([]))
      .finally(() => setLoadingOffices(false))
  }, [debouncedQuery, courier])

  // Reset office when courier changes
  useEffect(() => {
    setSelectedOffice(null)
    setOfficeQuery('')
    setOfficeResults([])
    setShowDropdown(false)
  }, [courier])

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Въведете имена'
    if (!phone.trim() || !/^[\d\s\+\-]{8,15}$/.test(phone)) errs.phone = 'Невалиден телефон'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Невалиден имейл'
    if (!selectedOffice) errs.office = 'Изберете офис за доставка'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name, phone, email },
          delivery: {
            courier,
            officeId: selectedOffice!.id,
            officeName: selectedOffice!.name,
            officeAddress: selectedOffice!.address,
          },
          items: items.map(i => ({
            productId: i.productId,
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
          })),
          subtotal: total,
          total,
        }),
      })

      if (!res.ok) throw new Error('Order failed')
      const order = await res.json()

      localStorage.setItem(`order-${order.id}`, JSON.stringify(order))
      clearCart()
      router.push(`/order/${order.id}`)
    } catch {
      setErrors({ submit: 'Грешка при поръчката. Опитайте отново.' })
      setSubmitting(false)
    }
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <main className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-5">🛒</div>
        <h1 className="text-2xl font-black mb-2">Количката е празна</h1>
        <p className="text-gray-400 mb-8">Добавете продукти преди да продължите</p>
        <Link href="/" className="inline-block bg-brand text-white font-bold px-8 py-3.5 rounded-xl hover:bg-brand-dark transition-all">
          Виж каталога
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-black mb-2">Поръчка</h1>
      <p className="text-gray-400 text-sm mb-8">Попълнете данните за доставка</p>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-5 gap-8 items-start">
        {/* Left: Form */}
        <div className="md:col-span-3 space-y-5">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold text-base mb-5">Данни за контакт</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Имена</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Иван Иванов"
                  className={`w-full border rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 ${errors.name ? 'border-red-400' : 'border-border'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Телефон</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+359 88 123 4567"
                  className={`w-full border rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 ${errors.phone ? 'border-red-400' : 'border-border'}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Имейл</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ivanov@gmail.com"
                  className={`w-full border rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 ${errors.email ? 'border-red-400' : 'border-border'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
          </div>

          {/* Courier + Office */}
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-bold text-base mb-5">Избор на куриер</h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {(['econt', 'speedy'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCourier(c)}
                  className={`border-2 rounded-xl p-4 font-semibold text-sm transition-all ${
                    courier === c
                      ? 'border-brand bg-brand-50 text-brand'
                      : 'border-border hover:border-gray-300 text-dark'
                  }`}
                >
                  {c === 'econt' ? '🟢 Еконт' : '🔴 Спиди'}
                </button>
              ))}
            </div>

            <div ref={dropdownRef} className="relative">
              <label className="block text-sm font-medium mb-1.5">Офис за доставка</label>

              {selectedOffice ? (
                <div className={`border-2 border-brand rounded-xl px-4 py-3 flex justify-between items-start gap-2`}>
                  <div>
                    <p className="font-semibold text-sm text-dark">{selectedOffice.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedOffice.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedOffice(null); setOfficeQuery('') }}
                    className="text-gray-300 hover:text-red-400 transition-colors text-lg shrink-0 mt-0.5"
                  >×</button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <input
                      type="text"
                      value={officeQuery}
                      onChange={e => setOfficeQuery(e.target.value)}
                      placeholder="Търсете по град или адрес..."
                      className={`w-full border rounded-xl px-4 py-3 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 ${errors.office ? 'border-red-400' : 'border-border'}`}
                    />
                    {loadingOffices && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {showDropdown && officeResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-xl z-30 max-h-56 overflow-y-auto">
                      {officeResults.map(office => (
                        <button
                          key={office.id}
                          type="button"
                          onMouseDown={() => {
                            setSelectedOffice(office)
                            setOfficeQuery(office.name)
                            setShowDropdown(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-surface transition-colors border-b border-border/50 last:border-0"
                        >
                          <p className="font-semibold text-sm text-dark">{office.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{office.address}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {showDropdown && officeResults.length === 0 && !loadingOffices && debouncedQuery.length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-30 px-4 py-3 text-sm text-gray-400">
                      Няма намерени офиси
                    </div>
                  )}
                </>
              )}
              {errors.office && <p className="text-red-500 text-xs mt-1">{errors.office}</p>}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-bold text-base mb-5">Резюме</h2>

            <div className="space-y-3 mb-5">
              {items.map(item => (
                <div key={item.productId} className="flex justify-between gap-2 text-sm">
                  <span className="text-gray-600 flex-1 min-w-0">
                    <span className="line-clamp-1">{item.product.name}</span>
                    <span className="text-gray-400 text-xs">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold shrink-0">
                    {(item.product.price * item.quantity).toFixed(2)} лв.
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mb-5">
              <div className="flex justify-between font-black text-lg">
                <span>Общо</span>
                <span>{total.toFixed(2)} лв.</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Плащате при получаване</p>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl transition-all disabled:opacity-60 text-base active:scale-98"
            >
              {submitting ? 'Обработва се...' : 'Потвърди поръчката'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Наложен платеж — плащате на куриера при доставка
            </p>
          </div>
        </div>
      </form>
    </main>
  )
}
