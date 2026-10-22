import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { readActivityLog } from '../utils/blogActivityLog'

export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const { events } = await readActivityLog()
  return { events }
})
