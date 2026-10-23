import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { readSubscribers } from '../utils/subscribersFile'

/** Список подписчиков — только для вошедшего (страница настроек / активности). */
export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { subscribers } = await readSubscribers()
  const sorted = [...subscribers].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  )

  return {
    count: sorted.length,
    subscribers: sorted
  }
})
