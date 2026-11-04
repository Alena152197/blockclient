/**
 * Базовый URL Strapi для Nitro API-роутов.
 * Без хардкода продакшен-хоста — только env.
 */
export function resolveStrapiBase(): string {
  const raw =
    process.env.NUXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    ''
  const url = String(raw).replace(/\/$/, '')
  if (!url) {
    console.warn(
      '[strapiBase] Задайте NUXT_PUBLIC_STRAPI_URL или STRAPI_URL на сервере.'
    )
  }
  return url
}

export const STRAPI_BASE = resolveStrapiBase()
