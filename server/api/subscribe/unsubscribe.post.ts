import { defineEventHandler, readBody, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../../utils/strapiVerifyUser'
import { removeSubscriber } from '../../utils/subscribersFile'
import { appendUnsubscribeEvent } from '../../utils/blogActivityLog'
import { resolveVisitorCountry } from '../../utils/geoCountry'

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {
    email?: unknown
    reason?: unknown
    countryCode?: unknown
    country?: unknown
  }
  let email = typeof body?.email === 'string' ? body.email : ''
  const reason = typeof body?.reason === 'string' ? body.reason : ''

  let userId: string | number | null = null
  try {
    const user = await verifyBearerUser(getHeader(event, 'authorization'))
    if (user?.id != null) userId = user.id
    if (!email && typeof user?.email === 'string') email = user.email
  } catch {
    /* guest with email in body */
  }

  try {
    const result = await removeSubscriber(email, reason, userId)
    const visitorKey = userId != null ? `user:${String(userId)}` : `email:${result.email}`
    const country = await resolveVisitorCountry(event, body.countryCode || body.country)
    await appendUnsubscribeEvent(visitorKey, result.email, reason, country)
    return {
      ok: true,
      removed: result.removed,
      email: result.email,
      message: result.removed
        ? 'Вы отписались. Жаль, что уходите — буду рада видеть вас снова.'
        : 'Этого email не было в списке. Форма отписки сохранена.'
    }
  } catch (e) {
    const msg = (e as Error)?.message
    if (msg === 'invalid_email') {
      throw createError({ statusCode: 400, message: 'Укажите корректный email.' })
    }
    if (msg === 'invalid_reason') {
      throw createError({ statusCode: 400, message: 'Напишите причину отписки (до 2000 символов).' })
    }
    throw createError({ statusCode: 500, message: 'Не удалось отписаться.' })
  }
})
