import type { $Fetch } from 'ofetch'
import type { createPricingTier } from '~/modules/shared/types/adminTypes'

export const useDiscountLevel = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllDiscountLevel = async (params: {
    type?: string
    product_id?: number
    search?: string
    min_discount?: number
    max_discount?: number
  }) => {
    try {
      const response = await $protectedApi('discount-levels', {
        method: 'GET',
        params
      })
      return response
    } catch (error) {
      return error
    }
  }

  const getDiscountLevelById = async (id: number) => {
    try {
      const response = await $protectedApi(`discount-levels/${id}`, {
        method: 'GET'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const createDiscountLevel = async (data: createPricingTier) => {
    try {
      const response = await $protectedApi('discount-levels', {
        method: 'POST',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const updateDiscountLevel = async (id: number, data: createPricingTier) => {
    try {
      const response = await $protectedApi(`discount-levels/${id}`, {
        method: 'PUT',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const deleteDiscountLevel = async (id: number) => {
    try {
      const response = await $protectedApi(`discount-levels/${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const generateDiscountPrice = async (id: number) => {
    try {
      const response = await $protectedApi(
        `discount-levels/${id}/calculate-discount`,
        {
          method: 'POST'
        }
      )
      return response
    } catch (error) {
      return error
    }
  }

  return {
    getAllDiscountLevel,
    getDiscountLevelById,
    createDiscountLevel,
    generateDiscountPrice,
    updateDiscountLevel,
    deleteDiscountLevel
  }
}
