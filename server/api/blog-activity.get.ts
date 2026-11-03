import { defineEventHandler } from 'h3'
import { assertContentEditor } from '../utils/contentAdminGate'
import { readActivityLog } from '../utils/blogActivityLog'

export default defineEventHandler(async (event) => {
  await assertContentEditor(event)
  const { events } = await readActivityLog()
  return { events }
})
