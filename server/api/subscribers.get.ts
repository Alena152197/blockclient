import { defineEventHandler } from 'h3'
import { assertContentEditor } from '../utils/contentAdminGate'
import { readSubscribers } from '../utils/subscribersFile'

/** Список подписчиков — только content-admin. */
export default defineEventHandler(async (event) => {
  await assertContentEditor(event)

  const { subscribers } = await readSubscribers()
  const sorted = [...subscribers].sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  )

  return {
    count: sorted.length,
    subscribers: sorted
  }
})
