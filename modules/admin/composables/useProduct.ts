import type { $Fetch } from 'ofetch'
import type { ProductUpdate } from '~/modules/shared/types/adminTypes'

export const useProduct = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllProducts = async () => {
    try {
      const response = await $protectedApi('products/', { method: 'GET' })
      return response
    } catch (error) {
      return error
    }
  }

  const getAllProductsName = async () => {
    try {
      const response = await $protectedApi('products/names', { method: 'GET' })
      return response
    } catch (error) {
      return error
    }
  }

  const getProductById = async (id: number) => {
    try {
      const response = await $protectedApi(`products/${id}`, { method: 'GET' })
      return response
    } catch (error) {
      return error
    }
  }

  const editProductById = async (id: number, data: ProductUpdate) => {
    try {
      const response = await $protectedApi(`products/${id}`, {
        method: 'PUT',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const deleteproductById = async (id: number) => {
    try {
      const response = await $protectedApi(`products/${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const addedProduct = async (data: ProductUpdate) => {
    try {
      const response = await $protectedApi('products/', {
        method: 'POST',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  return {
    getAllProducts,
    getProductById,
    editProductById,
    deleteproductById,
    addedProduct,
    getAllProductsName
  }
}
