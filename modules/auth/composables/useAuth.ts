import { useAuthStore } from '../store/authStore'
import type { $Fetch } from 'ofetch'

export const useAuth = () => {
  const { $publicApi } = useNuxtApp() as unknown as { $publicApi: $Fetch }

  const authStore = useAuthStore()

  const onLogin = async (email: string, password: string) => {
    try {
      const { access_token, user } = await $publicApi('v1/auth', {
        method: 'POST',
        body: { email, password }
      })
      authStore.setAccessToken(access_token)
      authStore.setAccessUser(user)

      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const onRegister = async (
    email: string,
    name: string,
    password: string,
    phone: string
  ) => {
    try {
      const { access_token, user } = await $publicApi('register', {
        method: 'POST',
        body: { email: email, nameUser: name, password, phone }
      })
      authStore.setAccessToken(access_token)
      authStore.setAccessUser(user)

      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const onRefreshToken = async () => {
    try {
      const { access_token, user } = await $publicApi('v1/refresh-token', {
        method: 'GET'
      })
      authStore.setAccessToken(access_token)
      authStore.setAccessUser(user)
    } catch (error) {
      return { success: false, error }
    }
  }

  const logOut = async () => {
    try {
      await $publicApi('logout', { method: 'GET' })
      authStore.LogOut()

      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  return { onLogin, onRefreshToken, onRegister, logOut }
}
