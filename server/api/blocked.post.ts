import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { assertContentEditor } from '../utils/contentAdminGate'
import { addBlockedUser } from '../utils/blockedUsersFile'
import { useRuntimeConfig } from '#imports'

function splitList(raw: string | undefined) {
  if (!raw) return []
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as {
    email?: unknown
    userId?: unknown
    reason?: unknown
    editorEmail?: unknown
    editorUsername?: unknown
  }

  const authHeader = getHeader(event, 'authorization')
  const user = await verifyBearerUser(authHeader)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const editor = await assertContentEditor(event, body as Record<string, unknown>)

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email) {
    throw createError({ statusCode: 400, message: 'Укажите email.' })
  }

  const config = useRuntimeConfig(event)
  const adminEmails = splitList(
    (config.public?.contentAdminEmails as string) ||
      process.env.NUXT_PUBLIC_CONTENT_ADMIN_EMAILS
  )
  if (adminEmails.includes(email)) {
    throw createError({ statusCode: 400, message: 'Нельзя заблокировать администратора.' })
  }
  if (typeof user.email === 'string' && user.email.toLowerCase() === email) {
    throw createError({ statusCode: 400, message: 'Нельзя заблокировать себя.' })
  }

  const userId =
    body.userId != null && String(body.userId).trim() !== '' ? body.userId : null
  const reason = typeof body.reason === 'string' ? body.reason : ''

  try {
    const result = await addBlockedUser({
      email,
      userId: userId as string | number | null,
      reason,
      blockedBy: editor.email || editor.username || String(user.email || '')
    })
    return {
      ok: true,
      added: result.added,
      blocked: result.entry,
      message: result.added ? 'Пользователь заблокирован.' : 'Уже в списке заблокированных.'
    }
  } catch (e) {
    if ((e as Error)?.message === 'invalid_email') {
      throw createError({ statusCode: 400, message: 'Некорректный email.' })
    }
    throw createError({ statusCode: 500, message: 'Не удалось заблокировать.' })
  }
})
