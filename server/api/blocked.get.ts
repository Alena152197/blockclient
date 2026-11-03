import { defineEventHandler } from 'h3'
import { assertContentEditor } from '../utils/contentAdminGate'
import { readBlockedUsers } from '../utils/blockedUsersFile'

/** Список заблокированных — только админ контента. */
export default defineEventHandler(async (event) => {
  await assertContentEditor(event)

  const { blocked } = await readBlockedUsers()
  const sorted = [...blocked].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  )
  return { count: sorted.length, blocked: sorted }
})
