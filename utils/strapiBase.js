/**
 * Базовый URL Strapi CMS.
 * Задаётся через NUXT_PUBLIC_STRAPI_URL (клиент + сервер) или STRAPI_URL (сервер).
 */
const DEFAULT_STRAPI_URL = 'https://324cbb377ef9.vps.myjino.ru'

function fromEnv() {
  if (typeof process === 'undefined' || !process.env) return ''
  return (
    process.env.NUXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_URL ||
    ''
  )
}

function fromImportMeta() {
  try {
    // Vite/Nuxt подставляет NUXT_PUBLIC_* на этапе сборки
    const v = import.meta.env?.NUXT_PUBLIC_STRAPI_URL
    return typeof v === 'string' ? v : ''
  } catch {
    return ''
  }
}

export function resolveStrapiBase() {
  const raw = fromImportMeta() || fromEnv() || DEFAULT_STRAPI_URL
  return String(raw).replace(/\/$/, '')
}

export const STRAPI_BASE = resolveStrapiBase()
