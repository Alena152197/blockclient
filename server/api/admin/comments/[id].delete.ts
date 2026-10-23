import { defineEventHandler, getHeader, getRouterParam, createError } from 'h3'
import { verifyBearerUser } from '../../../utils/strapiVerifyUser'
import { resolveStrapiBase } from '../../../utils/strapiBase'
import { strapiWriteAuthHeader } from '../../../utils/contentAdminGate'

/** Удаление комментария админом (через API Token). */
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const user = await verifyBearerUser(authHeader)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'id required' })
  }

  const base = resolveStrapiBase()
  const writeAuth = strapiWriteAuthHeader(authHeader || '', event)

  const response = await fetch(`${base}/api/comments/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { Authorization: writeAuth }
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    const msg =
      (json as { error?: { message?: string } })?.error?.message ||
      (response.status === 403
        ? 'Strapi запретил DELETE Comment. Нужен STRAPI_API_TOKEN.'
        : `Strapi ${response.status}`)
    console.error('Admin comment DELETE error:', response.status, JSON.stringify(json).slice(0, 400))
    throw createError({ statusCode: response.status, message: msg })
  }

  return { ok: true, id }
})
