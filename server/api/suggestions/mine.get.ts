import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../../utils/strapiVerifyUser'
import { findSuggestionsForUser } from '../../utils/suggestionsFile'

/** Обращения текущего пользователя (со ответами админа). */
export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Войдите, чтобы увидеть ответы' })
  }

  const email = typeof user.email === 'string' ? user.email : ''
  const list = await findSuggestionsForUser({ userId: user.id, email })

  return {
    count: list.length,
    suggestions: list
  }
})
