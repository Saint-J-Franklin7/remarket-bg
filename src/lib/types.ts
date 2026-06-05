export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  inStock: boolean
  minOrder: number
  unit: string
  badge?: string
  featured?: boolean
}

export interface CartItem {
  productId: string
  quantity: number
  product: Product
}

export interface CourierOffice {
  id: string
  name: string
  address: string
  city: string
  courier: 'econt' | 'speedy'
}

export interface OrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  createdAt: string
  customer: {
    name: string
    phone: string
    email: string
  }
  delivery: {
    courier: 'econt' | 'speedy' | 'home'
    officeId?: string
    officeName?: string
    officeAddress?: string
    homeAddress?: string
  }
  items: OrderItem[]
  subtotal: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  trackingNumber?: string
}
