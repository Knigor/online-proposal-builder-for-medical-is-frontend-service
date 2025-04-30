import { defineNuxtModule } from '@nuxt/kit'
import path from 'path'

export default defineNuxtModule({
  meta: {
    name: 'main',
    configKey: 'main'
  },
  setup(_, nuxt) {
    // Pages
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'main',
        path: '/',
        file: path.resolve(__dirname, 'pages/MainPage.vue')
      })
    })
  }
})
