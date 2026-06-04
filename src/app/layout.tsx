import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'РеМаркет — Качество на едро за България',
  description: 'Онлайн магазин за едро. Поръчайте онлайн, доставяме с Еконт и Спиди до всяка точка в България. Плащане при получаване.',
  keywords: 'ремаркет, едро, онлайн магазин, българия, еконт, спиди, доставка',
  metadataBase: new URL('https://www.remarketbg.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${inter.variable} overflow-x-hidden`}>
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full">
        <CartProvider>
          <Header />
          <div className="flex-1 w-full overflow-x-hidden">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
