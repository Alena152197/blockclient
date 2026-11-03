import { defineEventHandler, readBody, createError } from 'h3'
import { assertContentEditor } from '../../utils/contentAdminGate'
import { removeBlockedUser } from '../../utils/blockedUsersFile'

export default defineEventHandler(async (event) => {
  const body = (await readBody(event).catch(() => ({}))) as {
    email?: unknown
  }

  await assertContentEditor(event)

  const email = typeof body.email === 'string' ? body.email : ''
  try {
    const result = await removeBlockedUser(email)
    return {
      ok: true,
      removed: result.removed,
      email: result.email,
      message: result.removed ? 'Пользователь разблокирован.' : 'Этого email не было в списке.'
    }
  } catch (e) {
    if ((e as Error)?.message === 'invalid_email') {
      throw createError({ statusCode: 400, message: 'Некорректный email.' })
    }
    throw createError({ statusCode: 500, message: 'Не удалось разблокировать.' })
  }
})
