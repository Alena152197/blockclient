import { defineEventHandler } from 'h3'
import { assertContentEditor } from '../utils/contentAdminGate'
import { readPostViewsFile } from '../utils/postViewsFile'

/** Сводка просмотров — только content-admin. */
export default defineEventHandler(async (event) => {
  await assertContentEditor(event)
  const views = await readPostViewsFile()
  return { views }
})
