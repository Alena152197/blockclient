import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const FILE = join(process.cwd(), '.data', 'blog-activity.json')

/** Максимум записей (старые отбрасываются) */
const MAX_EVENTS = 8000

export type ActivityEvent = {
  at: string
  type: 'post_view'
  documentId: string
  visitorKey: string
}

type ActivityFile = {
  events: ActivityEvent[]
}

export async function readActivityLog(): Promise<ActivityFile> {
  try {
    if (!existsSync(FILE)) return { events: [] }
    const raw = await readFile(FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return { events: [] }
    const events = (parsed as ActivityFile).events
    if (!Array.isArray(events)) return { events: [] }
    return { events: events.filter(isValidEvent) }
  } catch {
    return { events: [] }
  }
}

function isValidEvent(e: unknown): e is ActivityEvent {
  if (!e || typeof e !== 'object') return false
  const x = e as Record<string, unknown>
  return (
    typeof x.at === 'string' &&
    x.type === 'post_view' &&
    typeof x.documentId === 'string' &&
    typeof x.visitorKey === 'string'
  )
}

async function writeActivityLog(data: ActivityFile): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function appendPostViewEvent(documentId: string, visitorKey: string): Promise<void> {
  const data = await readActivityLog()
  const ev: ActivityEvent = {
    at: new Date().toISOString(),
    type: 'post_view',
    documentId,
    visitorKey
  }
  data.events.push(ev)
  if (data.events.length > MAX_EVENTS) {
    data.events = data.events.slice(-MAX_EVENTS)
  }
  await writeActivityLog(data)
}
