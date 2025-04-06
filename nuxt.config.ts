import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  devServer: {
    host: '0.0.0.0',
  },

  app: {
    cdnURL: 'https://fenix1521.ru/'
  },

  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: ['fenix1521.ru'],
    },
  },

  modules: ['@pinia/nuxt','pinia-plugin-persistedstate/nuxt'],
  pinia: {
    storesDirs: ['./stores/**'],
  },

})