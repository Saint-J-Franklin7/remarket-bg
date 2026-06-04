'use client'

import { useState } from 'react'
import { products, CATEGORIES } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('Всички')

  const filtered = activeCategory === 'Всички'
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <main>
      {/* Hero */}
      <section className="bg-brand-dark text-white py-14 md:py-20 relative overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-[#1a3a9e] to-[#0076b8] opacity-80" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            🚚 Доставка с Еконт и Спиди — Наложен платеж
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight">
            Качество на <span className="text-brand">едро</span>.<br />
            Доставка до вас.
          </h1>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-8">
            Поръчайте онлайн — получавате до всяка точка в България. Плащате при получаване.
          </p>
          <a
            href="#catalog"
            className="inline-block bg-brand hover:bg-white hover:text-brand-dark text-white font-bold px-8 py-3.5 rounded-xl transition-all active:scale-95"
          >
            Виж каталога ↓
          </a>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="max-w-6xl mx-auto px-4 py-12">
        {/* Category filters */}
        <div id="categories" className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-white text-dark border border-border hover:border-brand hover:text-brand'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">Няма продукти в тази категория</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Trust bar */}
      <section className="border-t border-border py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['🚚', 'Бърза доставка', 'Еконт & Спиди'],
            ['💳', 'Наложен платеж', 'Плащате при получаване'],
            ['📦', 'Безплатна доставка', 'При поръчки над 100 €'],
            ['🔄', 'Лесно връщане', '14 дни без въпроси'],
          ].map(([icon, title, sub]) => (
            <div key={title} className="flex flex-col items-center gap-1.5">
              <span className="text-2xl">{icon}</span>
              <p className="font-bold text-sm text-dark">{title}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
