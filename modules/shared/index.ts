import { defineNuxtModule } from '@nuxt/kit'
import path from 'path'

export default defineNuxtModule({
  meta: {
    name: 'shared',
    configKey: 'shared'
  },

  setup(_, nuxt) {
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'offers',
        path: '/offers-select',
        file: path.resolve(__dirname, 'pages/OffersSelect.vue')
      })
    })
  }
})
