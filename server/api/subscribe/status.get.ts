import { defineEventHandler, getQuery, getHeader } from 'h3'
import { verifyBearerUser } from '../../utils/strapiVerifyUser'
import { isEmailSubscribed } from '../../utils/subscribersFile'

/** Проверка: подписан ли email (свой или из query). */
export default defineEventHandler(async (event) => {
  const q = getQuery(event)
  let email = typeof q.email === 'string' ? q.email.trim().toLowerCase() : ''

  try {
    const user = await verifyBearerUser(getHeader(event, 'authorization'))
    if (!email && typeof user?.email === 'string') {
      email = user.email.trim().toLowerCase()
    }
  } catch {
    /* guest */
  }

  if (!email) {
    return { subscribed: false, email: '' }
  }

  const subscribed = await isEmailSubscribed(email)
  return { subscribed, email }
})
