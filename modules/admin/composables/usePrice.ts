import type { $Fetch } from 'ofetch'
import type { PriceUpdate } from '~/modules/shared/types/adminTypes'

export const usePrice = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllPrice = async () => {
    try {
      const response = await $protectedApi('price-list', { method: 'GET' })
      return response
    } catch (error) {
      return error
    }
  }

  const addedPrice = async (data: PriceUpdate) => {
    try {
      const response = await $protectedApi('price-list/add', {
        method: 'POST',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  return { getAllPrice, addedPrice }
}
