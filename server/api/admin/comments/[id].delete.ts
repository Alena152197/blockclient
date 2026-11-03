import { defineEventHandler, getHeader, getRouterParam, createError } from 'h3'
import { assertContentEditor, strapiWriteAuthHeader } from '../../../utils/contentAdminGate'
import { resolveStrapiBase } from '../../../utils/strapiBase'

/** Удаление комментария — только content-admin (через API Token). */
export default defineEventHandler(async (event) => {
  const { auth } = await assertContentEditor(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'id required' })
  }

  const base = resolveStrapiBase()
  const writeAuth = strapiWriteAuthHeader(auth || getHeader(event, 'authorization') || '', event)

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
