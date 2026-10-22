import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { readPostViewsFile } from '../utils/postViewsFile'

/** Сводка просмотров — только для авторизованных пользователей (страница настроек) */
export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  const views = await readPostViewsFile()
  return { views }
})
