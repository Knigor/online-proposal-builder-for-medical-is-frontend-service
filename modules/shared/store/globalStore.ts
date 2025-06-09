import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    loading: false,
    totalSumm: 0 as number
  }),

  actions: {}
})
