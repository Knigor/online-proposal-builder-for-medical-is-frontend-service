import type { $Fetch } from 'ofetch'
import type { BaseLicenseCreate } from '~/modules/shared/types/adminTypes'

export const useBaseLicenses = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllBaseLicenses = async () => {
    try {
      const response = await $protectedApi('base-licenses', { method: 'GET' })
      return response
    } catch (error) {
      return error
    }
  }

  const getBaseLicensesById = async (id: number) => {
    try {
      const response = await $protectedApi(`base-licenses/${id}`, {
        method: 'GET'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const createBaseLicense = async (data: BaseLicenseCreate) => {
    try {
      const response = await $protectedApi('base-licenses', {
        method: 'POST',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const updateBaseLicense = async (id: number, data: BaseLicenseCreate) => {
    try {
      const response = await $protectedApi(`base-licenses/${id}`, {
        method: 'PUT',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const deleteBaseLicense = async (id: number) => {
    try {
      const response = await $protectedApi(`base-licenses/${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      return error
    }
  }

  return {
    getAllBaseLicenses,
    getBaseLicensesById,
    createBaseLicense,
    updateBaseLicense,
    deleteBaseLicense
  }
}
