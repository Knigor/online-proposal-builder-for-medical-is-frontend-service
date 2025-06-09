export type Product = {
  id: number
  name_product: string
  discription_product: string
  user_id: number
}

export type ProductNames = {
  id: number
  name: string
}

export type ProductCreate = {
  user_id: number
  name_product: string
  discription_product: string
}

export type ProductUpdate = {
  name_product: string
  discription_product: string
}

export type AdditionalModule = {
  id: number
  name_module: string
  description_module: string
  offer_price: number
  purchase_price: number
  max_discount_percent: number
  product_id: number
}

export type AdditionalModuleCreate = AdditionalModuleUpdate

export interface AdditionalModuleUpdate {
  name_module: string
  description_module: string
  offer_price: number
  purchase_price: number
  max_discount_percent: number
  product_id: number
}

export interface BaseLicenses {
  id: number
  nameLicense: string
  descriptionLicense: string
  offerPriceLicense: number
  purchasePriceLicense: number
  maxDiscount: number
  typeLicense: string
  product: {
    nameProduct: string
    id: number
  }
}
export interface BaseLicenseCreate {
  name_license: string
  description_license: string
  offer_price_license: number
  purchase_price_license: number
  max_discount: number
  type_license: string
  product_id: number
}

export interface LicenseCompositionBaseLicense {
  id: number
  nameLicense: string
  descriptionLicense: string
  offerPriceLicense: number
  purchasePriceLicense: number
  maxDiscount: number
  typeLicense: string
  product: {
    id: number
    nameProduct: string
  }
}

export interface LicenseCompositionAdditionalModule {
  id: number
  nameModule: string
  descriptionModule: string
  offerPrice: number
  purchasePrice: number
  maxDiscountPercent: number
  product: {
    id: number
    nameProduct: string
  }
}

export interface LicenseComposition {
  id: number
  required: boolean
  compatible: boolean
  baseLicense: LicenseCompositionBaseLicense
  additionalModule: LicenseCompositionAdditionalModule
}

export interface createLicenseComposition {
  required: boolean
  compatible: boolean
  base_license_id: number
  additional_module_id: number
}

export interface DiscountProduct {
  id: number
  name: number
}

export interface PricingTier {
  id: number
  type: string
  min_licenses: number
  max_licenses: number
  min_amount: number
  max_amount: number
  discount_percent: number
  product: DiscountProduct
}

export interface createPricingTier {
  type: string
  min_licenses: number
  max_licenses: number
  min_amount: number
  max_amount: number
  product_id: number
}

export interface createDiscount {
  id: number
  discountPercent: number
}

export const typeDiscount = [
  { id: 1, type: 'По количеству' },
  { id: 2, type: 'По сумме' }
] as const

export interface CommercialOffer {
  id: number
  status: boolean
  created_at: string
  total_price: number
  accepted_at: string
  items_count: number
}

export interface CreateCommercialOffer {
  id: number
  creed_at: string
}

export interface AddProductToCommercialOffer {
  product_id: number
  base_license_id: number
  additional_module_id: number
}

export interface CommercialOffersItems {
  product_id: number
  base_license_id: number
  additional_module_id: number
}

export interface CommercialOffersItemsById {
  id: number
  product: {
    id: number
    name: string
  }
  base_license?: {
    id: number
    name: string
    price: number
  }
  additional_module?: {
    id: number
    name: string
    price: number
  }
  quantity: number
  price: number
  discount: number | null
  total: number
}

export interface CommercialOffersById {
  id: number
  status: boolean
  created_at: string
  total_price: number
  accepted_at: string | null
  items: CommercialOffersItemsById[]
}
