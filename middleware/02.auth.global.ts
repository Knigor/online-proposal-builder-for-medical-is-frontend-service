import { useAuthStore } from '~/modules/auth/store/authStore'
import { navigateTo } from '#app'
import { useAuth } from '~/modules/auth/composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const { onRefreshToken } = useAuth()
  const publicRoutes = ['/authorization', '/register']

  if (!publicRoutes.includes(to.path) && authStore.accessToken == null) {
    try {
      console.log('вызывается middleware')
      const response = await onRefreshToken()

      if (response && !response.success) {
        return navigateTo('/authorization')
      }
    } catch (error) {
      console.log('MIDLEWARE ERROR:', error)
    }
  }
})
