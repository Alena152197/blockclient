import { defineEventHandler, readBody, createError, getHeader } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { addSubscriber } from '../utils/subscribersFile'
import { appendSubscribeEvent } from '../utils/blogActivityLog'
import { resolveVisitorCountry } from '../utils/geoCountry'
import { isBlockedIdentity } from '../utils/blockedUsersFile'

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {
    email?: unknown
    countryCode?: unknown
    country?: unknown
  }
  const email = typeof body?.email === 'string' ? body.email : ''

  let userId: string | number | null = null
  try {
    const user = await verifyBearerUser(getHeader(event, 'authorization'))
    if (user?.id != null) userId = user.id
  } catch {
    /* гости тоже могут подписаться */
  }

  if (await isBlockedIdentity(email, userId)) {
    throw createError({
      statusCode: 403,
      message: 'Этот адрес заблокирован. Подписка недоступна.'
    })
  }

  try {
    const result = await addSubscriber(email, userId)
    if (result.added) {
      const visitorKey = userId != null ? `user:${String(userId)}` : `email:${result.email}`
      const country = await resolveVisitorCountry(event, body.countryCode || body.country)
      await appendSubscribeEvent(visitorKey, result.email, country)
    }
    return {
      ok: true,
      added: result.added,
      email: result.email,
      count: result.count,
      message: result.added
        ? 'Благодарю! Вы подписались.'
        : 'Вы уже в списке подписчиков.'
    }
  } catch (e) {
    if ((e as Error)?.message === 'invalid_email') {
      throw createError({ statusCode: 400, message: 'Укажите корректный email.' })
    }
    throw createError({ statusCode: 500, message: 'Не удалось сохранить подписку.' })
  }
})
