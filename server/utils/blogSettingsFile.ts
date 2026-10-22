import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const FILE = join(process.cwd(), '.data', 'blog-client-settings.json')

export type BlogClientSettingsFile = {
  blog_index_bg?: Record<string, unknown> | null
  contact_page_bg?: Record<string, unknown> | null
  interests_page_bg?: Record<string, unknown> | null
  blog_display_title?: string
  post_card_style?: Record<string, unknown> | null
}

export async function readBlogSettingsFile(): Promise<BlogClientSettingsFile> {
  try {
    if (!existsSync(FILE)) return {}
    const raw = await readFile(FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    return parsed as BlogClientSettingsFile
  } catch {
    return {}
  }
}

export async function writeBlogSettingsFile(data: BlogClientSettingsFile): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}
