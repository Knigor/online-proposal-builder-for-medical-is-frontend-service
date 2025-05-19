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
        name: 'admin-product',
        path: '/admin-product',
        file: path.resolve(__dirname, 'pages/AdminProduct.vue')
      })
      pages.push({
        name: 'admin-priceList',
        path: '/admin-priceList',
        file: path.resolve(__dirname, 'pages/AdminPriceList.vue')
      })
      pages.push({
        name: 'admin-kp',
        path: '/admin-kp',
        file: path.resolve(__dirname, 'pages/AdminKP.vue')
      })
      pages.push({
        name: 'manager-lk',
        path: '/manager-lk',
        file: path.resolve(__dirname, 'pages/ManagerLk.vue')
      })
      pages.push({
        name: 'manager-lk-commercial-offer',
        path: '/manager-lk/commercial-offer/:id',
        file: path.resolve(__dirname, 'pages/ManagerCommercialOffer.vue')
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
