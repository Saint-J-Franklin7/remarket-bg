import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProduct } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = getProduct(id)
  if (!product) return {}

  const image = product.images[0]
  const imageUrl = image.startsWith('http') ? image : `https://www.remarketbg.com${image}`

  return {
    title: `${product.name} — РеМаркет`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `https://www.remarketbg.com/products/${id}`,
      siteName: 'РеМаркет',
      images: [{ url: imageUrl, width: 1200, height: 1200, alt: product.name }],
      type: 'website',
      locale: 'bg_BG',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [imageUrl],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
