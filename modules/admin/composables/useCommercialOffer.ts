import type { $Fetch } from 'ofetch'
import type { AddProductToCommercialOffer } from '~/modules/shared/types/adminTypes'

export const useCommercialOffer = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllCommercialOffers = async (params: {
    search?: string
    status?: boolean
    sort?: string
  }) => {
    try {
      const response = await $protectedApi('commercial-offers', {
        method: 'GET',
        params
      })
      return response
    } catch (error) {
      return error
    }
  }

  const getCommercialOffersById = async (id: number) => {
    try {
      const response = await $protectedApi(`commercial-offers/${id}`, {
        method: 'GET'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const createCommercialOffer = async () => {
    try {
      const response = await $protectedApi('commercial-offers', {
        method: 'POST'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const addedProductKP = async (
    data: AddProductToCommercialOffer,
    id: number
  ) => {
    try {
      const response = await $protectedApi(`commercial-offers/${id}/items`, {
        method: 'POST',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const deleteCommercialOffers = async (id: number) => {
    try {
      const response = await $protectedApi(`commercial-offers/${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      return error
    }
  }

  return {
    getAllCommercialOffers,
    getCommercialOffersById,
    createCommercialOffer,
    addedProductKP,
    deleteCommercialOffers
  }
}
