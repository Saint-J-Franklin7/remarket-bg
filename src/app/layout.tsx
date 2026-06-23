import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
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
  title: 'РеМаркет — Качество на достъпна цена',
  description: 'Качествени продукти на достъпна цена. Поръчайте онлайн, доставяме с Еконт и Спиди до всяка точка в България. Плащане при получаване.',
  keywords: 'ремаркет, едро, онлайн магазин, българия, еконт, спиди, доставка',
  metadataBase: new URL('https://www.remarketbg.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${inter.variable} overflow-x-hidden`}>
      <body className="min-h-screen flex flex-col overflow-x-hidden w-full">
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '995386490060228');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=995386490060228&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <CartProvider>
          <Header />
          <div className="flex-1 w-full overflow-x-hidden">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
