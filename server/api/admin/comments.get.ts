import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../../utils/strapiVerifyUser'
import { resolveStrapiBase } from '../../utils/strapiBase'
import { strapiWriteAuthHeader } from '../../utils/contentAdminGate'

/**
 * Список комментариев для страницы активности.
 * Читает Strapi через API Token — у роли Authenticated часто нет find на Comment (403).
 */
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const user = await verifyBearerUser(authHeader)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const base = resolveStrapiBase()
  const writeAuth = strapiWriteAuthHeader(authHeader || '', event)

  const url = `${base}/api/comments?populate=*&sort=createdAt:desc&pagination[pageSize]=100`
  const response = await fetch(url, {
    headers: { Authorization: writeAuth }
  })
  const json = await response.json().catch(() => ({}))

  if (!response.ok) {
    const msg =
      (json as { error?: { message?: string } })?.error?.message ||
      (response.status === 403
        ? 'Strapi запретил чтение Comment. Задайте STRAPI_API_TOKEN (Full access) в .env Nuxt.'
        : `Strapi ${response.status}`)
    console.error('Admin comments GET error:', response.status, JSON.stringify(json).slice(0, 400))
    throw createError({ statusCode: response.status || 502, message: msg })
  }

  const data = Array.isArray((json as { data?: unknown }).data)
    ? (json as { data: unknown[] }).data
    : []
  return { data }
})
