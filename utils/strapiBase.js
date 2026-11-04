/**
 * Базовый URL Strapi CMS.
 * NUXT_PUBLIC_STRAPI_URL / runtimeConfig.public.strapiUrl.
 * Важно: не кэшировать пустую строку на import — иначе `${STRAPI_BASE}/api/auth/local`
 * превращается в `/api/auth/local` на fenix1521.ru → 404.
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
    return typeof v === 'string' ? v.trim() : ''
  } catch {
    return ''
  }
}

function fromRuntimeConfig() {
  try {
    if (typeof useRuntimeConfig === 'function') {
      const c = useRuntimeConfig()
      const u = c?.public?.strapiUrl
      return typeof u === 'string' ? u.trim() : ''
    }
  } catch {
    /* вне Nuxt-контекста / до инициализации */
  }
  return ''
}

export function resolveStrapiBase() {
  // runtimeConfig первым: на проде подхватывает NUXT_PUBLIC_* после pm2 --update-env
  const raw = fromRuntimeConfig() || fromImportMeta() || fromEnv()
  return String(raw || '')
    .trim()
    .replace(/\/$/, '')
}

/** Ленивый URL: работает в шаблонных строках `${STRAPI_BASE}/api/...` */
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
