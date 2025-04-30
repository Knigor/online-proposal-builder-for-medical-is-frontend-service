import { defineNuxtModule } from '@nuxt/kit'
import path from 'path'

export default defineNuxtModule({
  meta: {
    name: 'admin',
    configKey: 'admin'
  },
  setup(_, nuxt) {
    // Pages
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'admin-main',
        path: '/admin-main',
        file: path.resolve(__dirname, 'pages/AdminMain.vue')
      })
    })

    // Components
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: path.resolve(__dirname, 'components')
      })
    })

    // // Composables
    // nuxt.hook('imports:dirs', (dirs) => {
    //   dirs.push(path.resolve(__dirname, 'composables'))
    // })
  }
})
