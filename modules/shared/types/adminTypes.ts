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
