import { defineEventHandler, readBody, createError, getHeader } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { incrementPostView } from '../utils/postViewsFile'
import { appendPostViewEvent } from '../utils/blogActivityLog'

function isValidDocumentId(id: unknown): id is string {
  if (typeof id !== 'string') return false
  const s = id.trim()
  if (s.length < 1 || s.length > 200) return false
  if (/\s/.test(s)) return false
  return true
}

function isValidAnonVisitorId(id: unknown): id is string {
  if (typeof id !== 'string') return false
  const s = id.trim()
  if (s.length < 8 || s.length > 128) return false
  if (/\s/.test(s)) return false
  return /^[a-zA-Z0-9_.:-]+$/.test(s)
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const documentId = (body as { documentId?: unknown })?.documentId
  if (!isValidDocumentId(documentId)) {
    throw createError({ statusCode: 400, message: 'Invalid documentId' })
  }

  const strapiUser = await verifyBearerUser(getHeader(event, 'authorization'))
  let visitorKey: string | null = null
  if (strapiUser) {
    const raw = strapiUser as { id?: unknown; documentId?: unknown }
    const uid = raw.id ?? raw.documentId
    if (uid != null && String(uid).length > 0) {
      visitorKey = `user:${String(uid)}`
    }
  }
  if (!visitorKey) {
    const visitorId = (body as { visitorId?: unknown }).visitorId
    if (!isValidAnonVisitorId(visitorId)) {
      throw createError({ statusCode: 400, message: 'visitorId required for guests' })
    }
    visitorKey = `anon:${(visitorId as string).trim()}`
  }

  const count = await incrementPostView(documentId)
  await appendPostViewEvent(documentId, visitorKey)
  return { documentId, count }
})
