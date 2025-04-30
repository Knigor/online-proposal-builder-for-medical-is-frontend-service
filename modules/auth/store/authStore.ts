import { defineStore } from 'pinia'

interface Role {
  role: string[]
}

interface AuthState {
  user: {
    id: number
    email: string
    name: string
    username: string
    role: Role
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
