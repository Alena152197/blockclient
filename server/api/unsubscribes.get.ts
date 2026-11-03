import { defineEventHandler } from 'h3'
import { assertContentEditor } from '../utils/contentAdminGate'
import { readUnsubscribes } from '../utils/subscribersFile'

/** Причины отписки — только content-admin. */
export default defineEventHandler(async (event) => {
  await assertContentEditor(event)

  const { items } = await readUnsubscribes()
  return {
    count: items.length,
    unsubscribes: items
  }
})
