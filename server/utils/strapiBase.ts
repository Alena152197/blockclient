/**
 * Базовый URL Strapi для Nitro API-роутов.
 * (Импорт из ~/utils ломается в Nitro → file:///utils/...)
 */
const DEFAULT_STRAPI_URL = 'https://324cbb377ef9.vps.myjino.ru'

export function resolveStrapiBase(): string {
  const raw =
    process.env.NUXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    DEFAULT_STRAPI_URL
  return String(raw).replace(/\/$/, '')
}

export const STRAPI_BASE = resolveStrapiBase()
