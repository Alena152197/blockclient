import { defineEventHandler, readBody, createError } from 'h3'
import {
  assertContentEditor,
  getContentAdminAllowlist
} from '../utils/contentAdminGate'
import { addBlockedUser } from '../utils/blockedUsersFile'

export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as {
    email?: unknown
    userId?: unknown
    reason?: unknown
  }

  const editor = await assertContentEditor(event)

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email) {
    throw createError({ statusCode: 400, message: 'Укажите email.' })
  }

  const { emails: adminEmails } = getContentAdminAllowlist(event)
  if (adminEmails.includes(email)) {
    throw createError({ statusCode: 400, message: 'Нельзя заблокировать администратора.' })
  }
  if (editor.email && editor.email === email) {
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
      blockedBy: editor.email || editor.username || ''
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
