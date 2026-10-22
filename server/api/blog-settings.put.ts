import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { isContentAdminStrapiUser } from '../utils/strapiContentAdmin'
import { readBlogSettingsFile, writeBlogSettingsFile } from '../utils/blogSettingsFile'

const KEYS = [
  'blog_index_bg',
  'contact_page_bg',
  'interests_page_bg',
  'blog_display_title',
  'post_card_style'
] as const

function sanitizeBody(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object') return {}
  return raw as Record<string, unknown>
}

export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  if (!isContentAdminStrapiUser(user as Record<string, unknown>)) {
    throw createError({ statusCode: 403, message: 'Только для администратора' })
  }

  const body = sanitizeBody(await readBody(event))
  const existing = await readBlogSettingsFile()
  const next = { ...existing } as Record<string, unknown>

  for (const k of KEYS) {
    if (!(k in body)) continue
    const v = body[k]
    if (k === 'blog_display_title') {
      next[k] = typeof v === 'string' ? v.trim() : v == null ? '' : String(v)
      continue
    }
    if (v === null || v === undefined) {
      next[k] = null
      continue
    }
    if (typeof v === 'object') {
      next[k] = v
      continue
    }
    throw createError({ statusCode: 400, message: `Invalid value for ${k}` })
  }

  await writeBlogSettingsFile(next as import('../utils/blogSettingsFile').BlogClientSettingsFile)
  return next
})
