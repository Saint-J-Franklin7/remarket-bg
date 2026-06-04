import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/products'
import ProductDetail from '@/components/ProductDetail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = getProduct(id)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
