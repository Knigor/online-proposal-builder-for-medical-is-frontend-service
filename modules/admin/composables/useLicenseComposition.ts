import type { $Fetch } from 'ofetch'
import type { createLicenseComposition } from '~/modules/shared/types/adminTypes'

export const useLicenseComposition = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllLicenseComposition = async (
    params: {
      base_license_name?: string
      required?: boolean
      compatible?: boolean
      sort?: 'base_license_name' | 'additional_module_name'
      direction?: 'asc' | 'desc'
    } = {}
  ) => {
    try {
      const response = await $protectedApi('license-compositions', {
        method: 'GET',
        params
      })
      return response
    } catch (error) {
      console.error('Ошибка при получении композиций лицензий:', error)
      throw error
    }
  }

  const getLicenseCompositionById = async (id: number) => {
    try {
      const response = await $protectedApi(`license-compositions/${id}`, {
        method: 'GET'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const createLicenseCompositionPOST = async (
    data: createLicenseComposition
  ) => {
    try {
      const response = await $protectedApi('license-compositions', {
        method: 'POST',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  const deleteLicenseComposition = async (id: number) => {
    try {
      const response = await $protectedApi(`license-compositions/${id}`, {
        method: 'DELETE'
      })
      return response
    } catch (error) {
      return error
    }
  }

  const updateLicenseComposition = async (
    id: number,
    data: createLicenseComposition
  ) => {
    try {
      const response = await $protectedApi(`license-compositions/${id}`, {
        method: 'PUT',
        body: data
      })
      return response
    } catch (error) {
      return error
    }
  }

  return {
    getAllLicenseComposition,
    createLicenseCompositionPOST,
    deleteLicenseComposition,
    updateLicenseComposition,
    getLicenseCompositionById
  }
}
