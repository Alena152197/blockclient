import { defineEventHandler, getHeader, getRequestURL, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { isBlockedIdentity } from '../utils/blockedUsersFile'

/**
 * Заблокированный пользователь не может пользоваться API сайта
 * (кроме проверки статуса).
 */
export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/')) return
  if (path === '/api/blocked/status') return
  if (path === '/api/blog-settings') return

  const auth = getHeader(event, 'authorization')
  if (!auth || !/^Bearer\s+\S+/i.test(auth)) return

  const user = await verifyBearerUser(auth)
  if (!user) return

  const email = typeof user.email === 'string' ? user.email : ''
  const id = user.id ?? user.documentId
  if (await isBlockedIdentity(email, id as string | number | null)) {
    throw createError({
      statusCode: 403,
      message: 'Ваш доступ к сайту ограничен администратором.'
    })
  }
})
