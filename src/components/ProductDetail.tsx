'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'
import { useCart } from '@/context/CartContext'
import ImageGallery from '@/components/ImageGallery'

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [qty, setQty] = useState(product.minOrder)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addItem(product, qty)
    router.push('/checkout')
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 w-full overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 min-w-0">
        <Link href="/" className="hover:text-brand transition-colors">Начало</Link>
        <span>/</span>
        <span className="text-dark font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 min-w-0">
        {/* Gallery */}
        <div>
          <ImageGallery images={product.images} productName={product.name} />
          {product.badge && (
            <span className="inline-block mt-3 bg-brand text-white text-sm font-bold px-3 py-1.5 rounded-full">
              {product.badge}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-brand mb-2">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-black text-dark mb-4 leading-tight">{product.name}</h1>
          <p className="text-gray-500 leading-relaxed mb-6 break-words">{product.description}</p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-black text-dark">{product.price.toFixed(2)}</span>
            <span className="text-xl text-gray-400">€</span>
            <span className="text-sm text-gray-400">/ {product.unit}</span>
          </div>

          {product.inStock ? (
            <>
              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-gray-600">Количество:</span>
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(Math.max(product.minOrder, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface text-lg font-medium transition-colors"
                  >−</button>
                  <span className="w-12 text-center font-bold text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-surface text-lg font-medium transition-colors"
                  >+</button>
                </div>
                {product.minOrder > 1 && (
                  <span className="text-xs text-gray-400">Мин. {product.minOrder}</span>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAdd}
                  className="w-full bg-surface border-2 border-brand text-brand font-bold py-3.5 rounded-xl hover:bg-brand-50 transition-all active:scale-98"
                >
                  {added ? '✓ Добавено в количката' : 'Добави в количката'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl transition-all active:scale-98"
                >
                  Купи сега →
                </button>
              </div>
            </>
          ) : (
            <div className="bg-surface border border-border rounded-xl py-4 text-center text-gray-400 font-medium">
              Изчерпано — свържете се с нас
            </div>
          )}

          {/* Delivery info */}
          <div className="mt-6 bg-surface rounded-xl p-4 border border-border text-sm text-gray-500 space-y-1.5">
            <p>🚚 Доставка с <strong className="text-dark">Еконт</strong> или <strong className="text-dark">Спиди</strong></p>
            <p>💳 Плащане при получаване — наложен платеж</p>
            <p>📦 Безплатна доставка при поръчки над 100 €</p>
          </div>
        </div>
      </div>
    </main>
  )
}
