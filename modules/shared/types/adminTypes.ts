export type Product = {
  id: number
  userId: {
    username: string
  }
  nameProduct: string
  discriptionProduct: string
  isActive: boolean
  typeProduct: string
}

export type ProductNames = {
  id: number
  name: string
}

export type ProductUpdate = {
  userId: number
  nameProduct: string
  discriptionProduct: string
  isActive: boolean
  typeProduct: string
}

export type PriceList = {
  id: number
  product: string
  price: number
  discount_percent: number
  quantity: number
}

export type PriceUpdate = {
  product_id: number
  price: number
  discount_percent: number
  quantity: number
}
