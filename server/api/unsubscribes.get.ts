import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { readUnsubscribes } from '../utils/subscribersFile'

/** Причины отписки — для админской страницы активности. */
export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { items } = await readUnsubscribes()
  return {
    count: items.length,
    unsubscribes: items
  }
})
