import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProduct, products } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

interface Props {
  params: Promise<{ id: string }>
}

export function generateStaticParams() {
  return products.map(p => ({ id: p.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = getProduct(id)
  if (!product) return {}

  const image = product.images[0]

  return {
    title: `${product.name} — РеМаркет`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://www.remarketbg.com/products/${id}`,
      siteName: 'РеМаркет',
      images: [{
        url: `https://www.remarketbg.com${image}`,
        width: 800,
        height: 800,
        alt: product.name,
      }],
      type: 'website',
      locale: 'bg_BG',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [`https://www.remarketbg.com${image}`],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
