'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Product } from '@/lib/types'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product, product.minOrder)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const hasImage = product.images.length > 0

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-surface">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
        )}

        {product.badge && (
          <span className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-dark text-xs font-bold px-3 py-1.5 rounded-full">Изчерпано</span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-dark text-sm leading-snug mb-1 hover:text-brand transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.minOrder > 1 && (
          <p className="text-xs text-gray-400 mb-2">Мин. {product.minOrder} {product.unit}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3">
          <div>
            <span className="text-lg font-black text-dark">{product.price.toFixed(2)}</span>
            <span className="text-sm text-gray-400 ml-1">лв.</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className="bg-brand hover:bg-brand-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {added ? '✓ Добавено' : 'Купи'}
          </button>
        </div>
      </div>
    </div>
  )
}
