import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { resolveStrapiBase } from '../../utils/strapiBase'
import { assertContentEditor, strapiWriteAuthHeader } from '../../utils/contentAdminGate'

/** Поля content-type About; иначе Strapi отвечает 400 Invalid key */
const ABOUT_WRITE_KEYS = new Set([
  'content',
  'text',
  'title',
  'page',
  'name',
  'heading',
  'label',
  'caption',
  'subject'
])

function sanitizeAboutData(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw createError({ statusCode: 400, message: 'data required' })
  }
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!ABOUT_WRITE_KEYS.has(k)) continue
    out[k] = v
  }
  if (!('content' in out) && !('text' in out)) {
    throw createError({ statusCode: 400, message: 'data.content required' })
  }
  return out
}

function strapiErrorMessage(json: unknown, status: number): string {
  const j = json as {
    error?: { message?: string; details?: { errors?: Array<{ path?: string[]; message?: string }> } }
    message?: string
  }
  const errs = j?.error?.details?.errors
  if (Array.isArray(errs) && errs.length) {
    return errs
      .map((x) => (x.path?.length ? `${x.path.join('.')}: ` : '') + (x.message || ''))
      .filter(Boolean)
      .join('; ')
  }
  return (
    j?.error?.message ||
    j?.message ||
    (status === 403
      ? 'Strapi запретил UPDATE для About. Включите права роли или задайте STRAPI_API_TOKEN в .env Nuxt.'
      : `Strapi ${status}`)
  )
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'id required' })
  }

  const body = (await readBody(event)) as Record<string, unknown>
  const { auth } = await assertContentEditor(event, body)
  const data = sanitizeAboutData(body?.data)

  const base = resolveStrapiBase()
  const writeAuth = strapiWriteAuthHeader(auth, event)

  const response = await fetch(
    `${base}/api/abouts/${encodeURIComponent(id)}?status=published`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: writeAuth
      },
      body: JSON.stringify({ data })
    }
  )

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    const msg = strapiErrorMessage(json, response.status)
    console.error('Strapi About PUT error:', response.status, JSON.stringify(json).slice(0, 500))
    throw createError({ statusCode: response.status, statusMessage: msg, message: msg, data: json })
  }

  return json
})
