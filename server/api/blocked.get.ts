import { defineEventHandler, getHeader, createError } from 'h3'
import { verifyBearerUser } from '../utils/strapiVerifyUser'
import { assertContentEditor } from '../utils/contentAdminGate'
import { readBlockedUsers } from '../utils/blockedUsersFile'

/** Список заблокированных — только админ контента. */
export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const user = await verifyBearerUser(authHeader)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  await assertContentEditor(event)

  const { blocked } = await readBlockedUsers()
  const sorted = [...blocked].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  )
  return { count: sorted.length, blocked: sorted }
})
