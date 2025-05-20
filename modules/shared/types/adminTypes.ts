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

export type ProductUpdate = {
  userId: number
  nameProduct: string
  discriptionProduct: string
  isActive: boolean
  typeProduct: string
}
