/**
 * Базовый URL Strapi для Nitro API-роутов.
 * Без хардкода продакшен-хоста — только env (читается на каждый вызов).
 */
export function resolveStrapiBase(): string {
  const raw =
    process.env.NUXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    ''
  const url = String(raw)
    .trim()
    .replace(/\r/g, '')
    .replace(/\/$/, '')
  if (!url) {
    console.warn(
      '[strapiBase] Задайте NUXT_PUBLIC_STRAPI_URL или STRAPI_URL на сервере.'
    )
  }
  return url
}

/** Лениво — чтобы подхватить env после pm2 restart --update-env */
export const STRAPI_BASE = {
  toString() {
    return resolveStrapiBase()
  },
  valueOf() {
    return resolveStrapiBase()
  },
  [Symbol.toPrimitive]() {
    return resolveStrapiBase()
  }
}
