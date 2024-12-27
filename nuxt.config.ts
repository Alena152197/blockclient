// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    host: '0.0.0.0',
  },
  // app: {
  //   cdnURL: 'https://fenix1521.ru/'
  // },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // modules: ['@pinia/nuxt'],
  // pinia: {
  //   storesDirs: ['./stores/**'],
  // },
})