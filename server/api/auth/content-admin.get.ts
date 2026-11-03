import { defineEventHandler, getHeader } from 'h3'
import { verifyBearerUser } from '../../utils/strapiVerifyUser'
import { isVerifiedContentAdmin } from '../../utils/contentAdminGate'

/**
 * Для UI: админ ли текущий JWT (роль Strapi или серверный allowlist).
 * Список почт на клиент не отдаём.
 */
export default defineEventHandler(async (event) => {
  const user = await verifyBearerUser(getHeader(event, 'authorization'))
  if (!user) {
    return { isAdmin: false }
  }
  return { isAdmin: isVerifiedContentAdmin(user, event) }
})
