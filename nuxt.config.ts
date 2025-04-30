// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
import AuthModule from './modules/auth/index'
import MainModule from './modules/main/index'
import SharedModule from './modules/shared/index'
import AdminMain from './modules/admin/index'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: { host: 'online-proposal.local', port: 3000 },
  alias: {
    '@shared': './modules/shared',
    '@auth': './modules/auth'
  },
  dir: {
    layouts: './modules/shared/layouts'
  },
  modules: [
    '@pinia/nuxt',
    'nuxt-svgo',
    'nuxt-lucide-icons',
    '@nuxt/eslint',
    '@vueuse/nuxt',
    'proxima-vue/nuxt',
    'vue-sonner/nuxt',
    AuthModule,
    AdminMain,
    MainModule,
    SharedModule
  ],
  proxima: {
    injectStyles: false,
    injectComponents: true,
    injectComposables: true
    // other options
  },
  css: ['~/modules/shared/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  ssr: false,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000'
    }
  },
  svgo: {
    autoImportPath: false
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Конструктор коммерческих предложений',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
      script: [
        {
          src: 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js',
          defer: true
        }
      ]
    }
  }
})
