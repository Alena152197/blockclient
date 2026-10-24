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

  /** Лимит тела запроса для прокси /api/upload (фото книги) */
  nitro: {
    // @ts-expect-error — поддерживается runtime Nitro 2.x / node-server
    maxRequestBodySize: 25 * 1024 * 1024,
  },

  runtimeConfig: {
    /** Серверный URL Strapi (можно задать STRAPI_URL) */
    strapiUrl: process.env.STRAPI_URL || process.env.NUXT_PUBLIC_STRAPI_URL || '',
    /** Full-access API Token для записи About/upload (только сервер) */
    strapiApiToken: process.env.STRAPI_API_TOKEN || process.env.STRAPI_TOKEN || '',
    /** Секрет POST /api/deploy (лучше задать NUXT_DEPLOY_SECRET в .env на VPS) */
    deploySecret: process.env.DEPLOY_SECRET || process.env.NUXT_DEPLOY_SECRET || '',
    public: {
      /** Клиентский URL Strapi — NUXT_PUBLIC_STRAPI_URL */
      strapiUrl:
        process.env.NUXT_PUBLIC_STRAPI_URL ||
        process.env.STRAPI_URL ||
        'https://324cbb377ef9.vps.myjino.ru',
      /** Через запятую: email админов контента (запасной список, если в Strapi нет роли Admin) */
      contentAdminEmails: process.env.NUXT_PUBLIC_CONTENT_ADMIN_EMAILS || '',
      contentAdminUsernames: process.env.NUXT_PUBLIC_CONTENT_ADMIN_USERNAMES || '',
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
    build: {
      // меньше шума в логе сборки от @tailwindcss/vite без sourcemap
      sourcemap: false,
    },
    server: {
      allowedHosts: ['fenix1521.ru', 'localhost'],
    },
  },

  modules: ['@pinia/nuxt','pinia-plugin-persistedstate/nuxt'],
  pinia: {
    storesDirs: ['./stores/**'],
  },

})
