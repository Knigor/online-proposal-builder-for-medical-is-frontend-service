import { defineStore } from 'pinia'

interface AuthState {
  user: {
    id: number
    email: string
    name: string
    username: string
    role: string[]
  } | null
  accessToken: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    user: null
  }),

  actions: {
    setAccessToken(accessToken: string): void {
      this.accessToken = accessToken
    },
    setAccessUser(user: AuthState['user']): void {
      this.user = user
    },
    LogOut() {
      this.accessToken = null
      this.user = null
    }
  }
})
