'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'

export default function Header() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <header className="bg-brand-dark text-white sticky top-0 z-40 shadow-lg">
        <div className="bg-brand">
          <div className="max-w-6xl mx-auto px-4 h-8 flex items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs">
            <a href="tel:+359879806569" className="flex items-center gap-1.5 font-bold hover:underline underline-offset-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              087 980 6569
            </a>
            <span className="w-px h-3 bg-white/40 shrink-0" />
            <span className="flex items-center gap-1.5 font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              10:00 – 20:00
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/logo.jpeg"
              alt="РеМаркет"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              Ре<span className="text-brand">Маркет</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-brand transition-colors">Каталог</Link>
            <Link href="/#categories" className="hover:text-brand transition-colors">Категории</Link>
            <Link href="/#contact" className="hover:text-brand transition-colors">Контакти</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Cart button → opens drawer */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:text-brand transition-colors"
              aria-label="Количка"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Mobile toggle */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-1">
            {[['/', 'Каталог'], ['/#categories', 'Категории'], ['/#contact', 'Контакти']].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="block py-2.5 text-sm font-medium hover:text-brand transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
