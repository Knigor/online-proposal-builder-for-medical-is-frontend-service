import { useAuthStore } from '~/modules/auth/store/authStore'

import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

export default defineNuxtPlugin(() => {
  type ApiRequestOptions = NitroFetchOptions<NitroFetchRequest>
  const authStore = useAuthStore()

  const request = $fetch.create({
    responseType: 'json',
    credentials: 'include',
    headers: {},
    baseURL: `${useRuntimeConfig().public.apiBase}`,

    async onRequest({ request, options }) {
      if (authStore.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }
    },

    async onResponse({ request, options, response }) {
      console.log('Protected API onResponse:', {
        response,
        status: response.status,
        request,
        options
      })
    },

    async onResponseError(ctx) {
      if ([401].includes(ctx.response.status)) {
        // authStore.logout()
        return navigateTo('/authorization')
      }
    }
  })

  const protectedApi = <T>(
    url: string,
    options?: ApiRequestOptions
  ): Promise<T> => request(url, options) as Promise<T>

  return {
    provide: {
      protectedApi
    }
  }
})
