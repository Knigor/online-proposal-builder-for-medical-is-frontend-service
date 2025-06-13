import type { $Fetch } from 'ofetch'

export const useCustomer = () => {
  const { $protectedApi } = useNuxtApp() as unknown as { $protectedApi: $Fetch }

  const getAllCustomers = async () => {
    try {
      const response = await $protectedApi('customers', { method: 'GET' })
      return response
    } catch (error) {
      return error
    }
  }

  return { getAllCustomers }
}
