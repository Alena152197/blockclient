import { defineEventHandler, getHeader } from 'h3'
import { verifyBearerUser } from '../../utils/strapiVerifyUser'
import { isBlockedIdentity } from '../../utils/blockedUsersFile'

/**
 * Проверка текущего пользователя (по JWT).
 * Без токена — не заблокирован (гость).
 */
export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user) {
    return { blocked: false }
  }
  const email = typeof user.email === 'string' ? user.email : ''
  const id = user.id ?? user.documentId
  const blocked = await isBlockedIdentity(email, id as string | number | null)
  return { blocked, email: email || undefined }
})
