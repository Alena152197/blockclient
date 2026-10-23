import { defineEventHandler, getRouterParam, readBody, createError } from 'h3'
import { assertContentEditor } from '../../../utils/contentAdminGate'
import { replyToSuggestion } from '../../../utils/suggestionsFile'

/** Ответ администратора на обращение. */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'id required' })
  }

  const body = (await readBody(event)) as Record<string, unknown>
  await assertContentEditor(event, body)

  const reply = typeof body?.reply === 'string' ? body.reply : ''

  try {
    const updated = await replyToSuggestion(id, reply)
    return { ok: true, suggestion: updated }
  } catch (e) {
    const msg = (e as Error)?.message
    if (msg === 'not_found') {
      throw createError({ statusCode: 404, message: 'Обращение не найдено' })
    }
    if (msg === 'invalid_reply') {
      throw createError({ statusCode: 400, message: 'Напишите текст ответа (до 4000 символов).' })
    }
    throw createError({ statusCode: 500, message: 'Не удалось сохранить ответ.' })
  }
})
