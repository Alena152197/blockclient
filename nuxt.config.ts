import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  /**
   * Вывод Nitro — по умолчанию каталог `.output` в корне проекта.
   * Кастомный `.nuxt/nitro-output` давал ENOTEMPTY: внутренний `rmdir` не очищает непустой каталог.
   * Перед `dev`/`build` см. `scripts/rm-output.mjs` и `predev` / `prebuild` в package.json.
   */

  devServer: {
    host: '0.0.0.0',
  },

  // app: {
  //   cdnURL: 'https://fenix1521.ru/'
  // },

  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  runtimeConfig: {
    /** Серверный URL Strapi (можно задать STRAPI_URL) */
    strapiUrl: process.env.STRAPI_URL || process.env.NUXT_PUBLIC_STRAPI_URL || '',
    public: {
      /** Клиентский URL Strapi — NUXT_PUBLIC_STRAPI_URL */
      strapiUrl:
        process.env.NUXT_PUBLIC_STRAPI_URL ||
        process.env.STRAPI_URL ||
        'https://324cbb377ef9.vps.myjino.ru',
    },
  },

  /** Иначе при F5 на /settings дочерний index SSR’ится без учёта ssr:false родителя — гидратация и «ошибки» с HTML ссылки в консоли. */
  routeRules: {
    '/settings': { ssr: false },
    '/settings/**': { ssr: false },
  },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      allowedHosts: ['fenix1521.ru', 'localhost'],
    },
  },

  modules: ['@pinia/nuxt','pinia-plugin-persistedstate/nuxt'],
  pinia: {
    storesDirs: ['./stores/**'],
  },

})
