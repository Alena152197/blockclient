import { defineEventHandler } from 'h3'
import { readBlogSettingsFile } from '../utils/blogSettingsFile'

export default defineEventHandler(async () => {
  return await readBlogSettingsFile()
})
