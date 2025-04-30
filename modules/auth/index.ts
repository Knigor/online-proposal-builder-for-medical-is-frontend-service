import { defineNuxtModule } from '@nuxt/kit'
import path from 'path'

export default defineNuxtModule({
  meta: {
    name: 'auth',
    configKey: 'auth'
  },
  setup(_, nuxt) {
    // Pages
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'auth',
        path: '/authorization',
        file: path.resolve(__dirname, 'pages/auth.vue')
      })
      pages.push({
        name: 'register',
        path: '/register',
        file: path.resolve(__dirname, 'pages/register.vue')
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
