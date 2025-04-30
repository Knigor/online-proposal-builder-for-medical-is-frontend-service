/** @type {import('tailwindcss').Config} */
export default {
  plugins: [require('daisyui'), require('tailwind-scrollbar')],
  daisyui: {
    themes: ['light'] // Только светлая тема (без переключения)
  },
  content: [
    './modules/**/*.{js,vue,ts}',
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    boxShadow: {
      xs: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
      sm: '0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
      lg: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
      xl: '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
      'custom-lg':
        '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)'
    },
    fontFamily: {
      sans: ['Inter', 'Arial', 'sans-serif']
    },
    colors: {
      transparent: 'transparent',
      inherit: 'inherit',
      current: 'currentColor',
      black: '#000000'
    }
  },
  themes: ['light']
}
