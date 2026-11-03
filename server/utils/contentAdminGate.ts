import { createError, getHeader } from 'h3'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
import { verifyBearerUser } from './strapiVerifyUser'
import { isContentAdminStrapiUser } from './strapiContentAdmin'

function splitList(raw: string | undefined | null) {
  if (!raw) return []
  return String(raw)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

/** Allowlist только с сервера — не из NUXT_PUBLIC_* в браузерном бандле. */
export function getContentAdminAllowlist(event?: H3Event) {
  let emails = ''
  let usernames = ''
  try {
    const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
    emails = String(config.contentAdminEmails || '')
    usernames = String(config.contentAdminUsernames || '')
  } catch {
    /* вне Nuxt-контекста */
  }

  if (!emails) {
    emails =
      process.env.CONTENT_ADMIN_EMAILS ||
      process.env.NUXT_CONTENT_ADMIN_EMAILS ||
      process.env.NUXT_PUBLIC_CONTENT_ADMIN_EMAILS ||
      ''
  }
  if (!usernames) {
    usernames =
      process.env.CONTENT_ADMIN_USERNAMES ||
      process.env.NUXT_CONTENT_ADMIN_USERNAMES ||
      process.env.NUXT_PUBLIC_CONTENT_ADMIN_USERNAMES ||
      ''
  }

  return {
    emails: splitList(emails),
    usernames: splitList(usernames)
  }
}

/** Админ по роли Strapi или по серверному allowlist; identity только из verified user. */
export function isVerifiedContentAdmin(user: Record<string, unknown> | null | undefined, event?: H3Event) {
  if (!user) return false
  if (isContentAdminStrapiUser(user)) return true

  const { emails, usernames } = getContentAdminAllowlist(event)
  const email = String(user.email || '')
    .toLowerCase()
    .trim()
  const username = String(user.username || '')
    .toLowerCase()
    .trim()

  if (email && emails.includes(email)) return true
  if (username && usernames.includes(username)) return true
  return false
}

/**
 * JWT проверяется в Strapi (/users/me). Email/username из заголовков и body
 * не доверяем — только поля верифицированного пользователя.
 */
export async function assertContentEditor(event: H3Event, _body?: Record<string, unknown>) {
  const auth = getHeader(event, 'authorization')
  if (!auth || !/^Bearer\s+\S+/i.test(auth)) {
    throw createError({ statusCode: 401, message: 'Нужна авторизация' })
  }

  const user = await verifyBearerUser(auth)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Недействительный токен' })
  }

  if (!isVerifiedContentAdmin(user, event)) {
    throw createError({
      statusCode: 403,
      message:
        'Редактирование только для администратора. Нужна роль Admin в Strapi или CONTENT_ADMIN_EMAILS на сервере.'
    })
  }

  const email = String(user.email || '')
    .toLowerCase()
    .trim()
  const username = String(user.username || '')
    .toLowerCase()
    .trim()

  return { auth, email, username, user }
}

/** Токен для записи в Strapi: API Token (полный доступ) или JWT пользователя. */
export function strapiWriteAuthHeader(userAuth: string, event?: H3Event): string {
  const fromEnv = process.env.STRAPI_API_TOKEN || process.env.STRAPI_TOKEN || ''
  let apiToken = fromEnv
  try {
    const config = event ? useRuntimeConfig(event) : useRuntimeConfig()
    const fromConfig = config?.strapiApiToken
    if (fromConfig && String(fromConfig).trim()) {
      apiToken = String(fromConfig).trim()
    }
  } catch {
    /* вне Nuxt-контекста */
  }
  if (apiToken && String(apiToken).trim()) {
    return `Bearer ${String(apiToken).trim()}`
  }
  return userAuth
}
