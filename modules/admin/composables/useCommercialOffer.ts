import type { $Fetch } from 'ofetch'
import type {
  CreateCommercialOffer,
  AddProductToCommercialOffer
} from '~/modules/shared/types/adminTypes'

export const useCommercialOffer = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllCommercialOffers = async () => {
    try {
      const response = await $protectedApi('commercial-offers', {
        method: 'GET'
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

  const createCommercialOffer = async (data: CreateCommercialOffer) => {
    try {
      const response = await $protectedApi('commercial-offers', {
        method: 'POST',
        body: data
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

  return {
    getAllCommercialOffers,
    getCommercialOffersById,
    createCommercialOffer,
    addedProductKP
  }
}
