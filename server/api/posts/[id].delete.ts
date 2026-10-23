import { defineEventHandler, getRouterParam, createError } from 'h3'
import { resolveStrapiBase } from '../../utils/strapiBase'
import { assertContentEditor, strapiWriteAuthHeader } from '../../utils/contentAdminGate'

/**
 * DELETE /api/posts/:id — только content-admin.
 * Пишет в Strapi через API Token (у роли Authenticated часто нет delete → 403).
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'id required' })
  }

  const { auth } = await assertContentEditor(event)
  const base = resolveStrapiBase()
  const writeAuth = strapiWriteAuthHeader(auth, event)

  const response = await fetch(`${base}/api/posts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: writeAuth
    }
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    const j = json as { error?: { message?: string }; message?: string }
    const msg =
      j?.error?.message ||
      j?.message ||
      (response.status === 403
        ? 'Strapi запретил DELETE для Post. Задайте STRAPI_API_TOKEN (Full access) в .env Nuxt.'
        : `Strapi ${response.status}`)
    console.error('Strapi Post DELETE error:', response.status, JSON.stringify(json).slice(0, 500))
    throw createError({ statusCode: response.status, statusMessage: msg, message: msg, data: json })
  }

  return json?.data !== undefined ? json : { ok: true }
})
