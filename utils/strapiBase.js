/**
 * Базовый URL Strapi CMS.
 * Задаётся через NUXT_PUBLIC_STRAPI_URL (клиент + сервер) или STRAPI_URL (сервер).
 * Хардкод продакшен-URL убран — иначе адрес CMS светится в бандле даже без .env.
 */
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
    const v = import.meta.env?.NUXT_PUBLIC_STRAPI_URL
    return typeof v === 'string' ? v : ''
  } catch {
    return ''
  }
}

function fromRuntimeConfig() {
  try {
    if (typeof useRuntimeConfig === 'function') {
      const c = useRuntimeConfig()
      const u = c?.public?.strapiUrl
      return typeof u === 'string' ? u : ''
    }
  } catch {
    /* вне Nuxt-контекста */
  }
  return ''
}

export function resolveStrapiBase() {
  const raw = fromImportMeta() || fromRuntimeConfig() || fromEnv()
  const url = String(raw || '').replace(/\/$/, '')
  if (!url) {
    if (import.meta.dev) {
      console.warn(
        '[strapiBase] Задайте NUXT_PUBLIC_STRAPI_URL в .env (URL Strapi без хвоста /).'
      )
    }
    return ''
  }
  return url
}

export const STRAPI_BASE = resolveStrapiBase()
