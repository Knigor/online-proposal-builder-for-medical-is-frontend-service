import type { $Fetch } from 'ofetch'
import type {
  AdditionalModuleUpdate,
  AdditionalModuleCreate
} from '~/modules/shared/types/adminTypes'

export const useAdditionalModule = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllAdditionalModules = async (
    params: {
      name_module?: string
      product_id?: number
      sort?: 'name_module' | 'offer_price' | 'purchase_price'
      direction?: 'asc' | 'desc'
    } = {}
  ) => {
    try {
      const response = await $protectedApi('additional-modules/', {
        method: 'GET',
        params
      })
      return response
    } catch (error) {
      console.error('Ошибка при получении модулей:', error)
      throw error
    }
  }

  const getAdditionalModuleById = async (id: number) => {
    try {
      const response = await $protectedApi(`additional-modules/${id}`, {
        method: 'GET'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const createAdditionalModule = async (data: AdditionalModuleCreate) => {
    try {
      const response = await $protectedApi('additional-modules', {
        method: 'POST',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const updateAdditionalModule = async (
    id: number,
    data: AdditionalModuleUpdate
  ) => {
    try {
      const response = await $protectedApi(`additional-modules/${id}`, {
        method: 'PUT',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const deleteAdditionalModuleModal = async (id: number) => {
    try {
      const response = await $protectedApi(`additional-modules/${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      return error
    }
  }

  return {
    getAllAdditionalModules,
    getAdditionalModuleById,
    createAdditionalModule,
    updateAdditionalModule,
    deleteAdditionalModuleModal
  }
}
