'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, count } = useCart()
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className={`fixed inset-0 z-40 overflow-hidden ${open ? '' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white z-10 flex flex-col shadow-2xl transition-transform duration-300 ease-out pointer-events-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-black text-lg">
            Количка
            {count > 0 && <span className="ml-2 text-sm font-semibold text-gray-400">({count} артикула)</span>}
          </h2>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-semibold text-dark mb-1">Количката е празна</p>
              <p className="text-sm text-gray-400 mb-6">Добавете продукти за да поръчате</p>
              <button
                onClick={onClose}
                className="bg-brand text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-brand-dark transition-colors"
              >
                Виж каталога
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="flex gap-3 pb-4 border-b border-border last:border-0">
                {/* Image */}
                <Link href={`/products/${item.productId}`} onClick={onClose} className="shrink-0 w-18 h-18">
                  <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden bg-surface border border-border">
                    {item.product.images[0] ? (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1" sizes="72px" />
                    ) : (
                      <div className="w-full h-full bg-surface" />
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.productId}`} onClick={onClose}>
                    <p className="text-sm font-semibold text-dark leading-snug line-clamp-2 hover:text-brand transition-colors">
                      {item.product.name}
                    </p>
                  </Link>
                  <p className="text-sm font-black text-dark mt-1">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface text-base font-medium transition-colors"
                      >−</button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface text-base font-medium transition-colors"
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-300 hover:text-red-400 transition-colors p-1"
                      aria-label="Премахни"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-5 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-500">Общо</span>
              <span className="font-black text-xl text-dark">{total.toFixed(2)} €</span>
            </div>
            <p className="text-xs text-gray-400">Доставката се изчислява при поръчката</p>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-brand hover:bg-brand-dark text-white font-bold py-4 rounded-xl text-center transition-all active:scale-95"
            >
              Поръчай сега →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
