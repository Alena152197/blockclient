import { defineEventHandler, readBody, createError } from 'h3'
import { resolveStrapiBase } from '../../utils/strapiBase'
import { assertContentEditor, strapiWriteAuthHeader } from '../../utils/contentAdminGate'

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

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Record<string, unknown>
  const { auth } = await assertContentEditor(event, body)
  const data = sanitizeAboutData(body?.data)

  const base = resolveStrapiBase()
  const writeAuth = strapiWriteAuthHeader(auth, event)

  const response = await fetch(`${base}/api/abouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: writeAuth
    },
    body: JSON.stringify({ data })
  })

  const json = await response.json().catch(() => ({}))
  if (!response.ok) {
    const j = json as { error?: { message?: string }; message?: string }
    const msg =
      j?.error?.message ||
      j?.message ||
      (response.status === 403
        ? 'Strapi запретил CREATE для About. Включите права роли или задайте STRAPI_API_TOKEN в .env Nuxt.'
        : `Strapi ${response.status}`)
    console.error('Strapi About POST error:', response.status, JSON.stringify(json).slice(0, 500))
    throw createError({ statusCode: response.status, statusMessage: msg, message: msg, data: json })
  }

  return json
})
