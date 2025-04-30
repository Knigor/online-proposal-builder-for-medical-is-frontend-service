import { $fetch, type $Fetch } from 'ofetch'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
export default defineNuxtPlugin(() => {
  type ApiRequestOptions = NitroFetchOptions<NitroFetchRequest>
  const request: $Fetch = $fetch.create({
    credentials: 'include',
    baseURL: `${useRuntimeConfig().public.apiBase}`,
    onResponseError: async (err) => {
      if (err.response.status === 401) {
        // клиент не авторизован
        navigateTo('/authorization')
      }
    }
  }) as $Fetch
  const publicApi = <T>(url: string, options?: ApiRequestOptions): Promise<T> =>
    request(url, options) as Promise<T>
  return {
    provide: {
      publicApi
    }
  }
})
