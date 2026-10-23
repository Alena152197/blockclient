import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { addSuggestion } from '../utils/suggestionsFile'

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {
    name?: unknown
    text?: unknown
    email?: unknown
  }

  const text = typeof body?.text === 'string' ? body.text : ''
  const name = typeof body?.name === 'string' ? body.name : ''
  let email = typeof body?.email === 'string' ? body.email : ''

  let userId: string | number | null = null
  try {
    const user = await verifyBearerUser(getHeader(event, 'authorization'))
    if (user?.id != null) userId = user.id
    if (!email && typeof user?.email === 'string') email = user.email
  } catch {
    /* гости тоже могут писать */
  }

  try {
    const entry = await addSuggestion({ name, text, email, userId })
    return {
      ok: true,
      id: entry.id,
      message: 'Благодарю! Обращение сохранено!'
    }
  } catch (e) {
    if ((e as Error)?.message === 'invalid_text') {
      throw createError({ statusCode: 400, message: 'Напишите текст предложения (до 2000 символов).' })
    }
    throw createError({ statusCode: 500, message: 'Не удалось сохранить обращение.' })
  }
})
