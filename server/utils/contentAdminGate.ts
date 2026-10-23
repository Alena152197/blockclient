import { createError, getHeader } from 'h3'
import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

function splitList(raw: string | undefined) {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

function decodeHeaderValue(raw: string) {
  const s = String(raw || '').trim()
  if (!s) return ''
  try {
    return decodeURIComponent(s)
  } catch {
    return s
  }
}

/**
 * Проверка: есть JWT и email/username из allowlist.
 * Identity: заголовки (URI-encoded) или поля body.editorEmail / editorUsername.
 */
export async function assertContentEditor(event: H3Event, body?: Record<string, unknown>) {
  const auth = getHeader(event, 'authorization')
  if (!auth || !/^Bearer\s+\S+/i.test(auth)) {
    throw createError({ statusCode: 401, message: 'Нужна авторизация' })
  }

  let email = decodeHeaderValue(getHeader(event, 'x-editor-email') || '').toLowerCase()
  let username = decodeHeaderValue(getHeader(event, 'x-editor-username') || '').toLowerCase()

  const b = body && typeof body === 'object' ? body : null
  if (!email && typeof b?.editorEmail === 'string') {
    email = b.editorEmail.toLowerCase().trim()
  }
  if (!username && typeof b?.editorUsername === 'string') {
    username = b.editorUsername.toLowerCase().trim()
  }

  const config = useRuntimeConfig(event)
  const emails = splitList(
    (config.public?.contentAdminEmails as string) ||
      process.env.NUXT_PUBLIC_CONTENT_ADMIN_EMAILS
  )
  const names = splitList(
    (config.public?.contentAdminUsernames as string) ||
      process.env.NUXT_PUBLIC_CONTENT_ADMIN_USERNAMES
  )

  const ok =
    (email && emails.includes(email)) || (username && names.includes(username))

  if (!ok) {
    throw createError({
      statusCode: 403,
      message:
        'Редактирование только для администратора. Проверьте NUXT_PUBLIC_CONTENT_ADMIN_EMAILS в .env'
    })
  }

  return { auth, email, username }
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
