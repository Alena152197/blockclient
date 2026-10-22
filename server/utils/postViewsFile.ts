import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const FILE = join(process.cwd(), '.data', 'post-views.json')

export type PostViewsMap = Record<string, number>

export async function readPostViewsFile(): Promise<PostViewsMap> {
  try {
    if (!existsSync(FILE)) return {}
    const raw = await readFile(FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return {}
    const out: PostViewsMap = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      const n = Number(v)
      if (Number.isFinite(n) && n >= 0) out[k] = Math.floor(n)
    }
    return out
  } catch {
    return {}
  }
}

export async function writePostViewsFile(data: PostViewsMap): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function incrementPostView(documentId: string): Promise<number> {
  const map = await readPostViewsFile()
  const next = (map[documentId] || 0) + 1
  map[documentId] = next
  await writePostViewsFile(map)
  return next
}
