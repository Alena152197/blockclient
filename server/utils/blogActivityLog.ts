import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const FILE = join(process.cwd(), '.data', 'blog-activity.json')

/** Максимум записей (старые отбрасываются) */
const MAX_EVENTS = 8000

export type ActivityEventType = 'post_view' | 'subscribe' | 'unsubscribe'

export type ActivityEvent = {
  at: string
  type: ActivityEventType
  visitorKey: string
  /** Для post_view — id статьи */
  documentId?: string
  /** Страна посетителя (если удалось определить) */
  country?: string
  /** Email при подписке / отписке */
  email?: string
  /** Причина отписки */
  detail?: string
}

type ActivityFile = {
  events: ActivityEvent[]
}

const EVENT_TYPES = new Set<ActivityEventType>(['post_view', 'subscribe', 'unsubscribe'])

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
  if (typeof x.at !== 'string' || typeof x.visitorKey !== 'string') return false
  if (!EVENT_TYPES.has(x.type as ActivityEventType)) return false
  if (x.type === 'post_view' && typeof x.documentId !== 'string') return false
  return true
}

async function writeActivityLog(data: ActivityFile): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

async function appendEvent(ev: ActivityEvent): Promise<void> {
  const data = await readActivityLog()
  data.events.push(ev)
  if (data.events.length > MAX_EVENTS) {
    data.events = data.events.slice(-MAX_EVENTS)
  }
  await writeActivityLog(data)
}

function withOptionalMeta(
  base: ActivityEvent,
  opts?: { country?: string; email?: string; detail?: string }
): ActivityEvent {
  const c = String(opts?.country || '').trim()
  if (c) base.country = c.slice(0, 80)
  const email = String(opts?.email || '')
    .trim()
    .toLowerCase()
  if (email) base.email = email.slice(0, 200)
  const detail = String(opts?.detail || '').trim()
  if (detail) base.detail = detail.slice(0, 500)
  return base
}

export async function appendPostViewEvent(
  documentId: string,
  visitorKey: string,
  country?: string
): Promise<void> {
  await appendEvent(
    withOptionalMeta(
      {
        at: new Date().toISOString(),
        type: 'post_view',
        documentId,
        visitorKey
      },
      { country }
    )
  )
}

export async function appendSubscribeEvent(
  visitorKey: string,
  email: string,
  country?: string
): Promise<void> {
  await appendEvent(
    withOptionalMeta(
      {
        at: new Date().toISOString(),
        type: 'subscribe',
        visitorKey
      },
      { country, email }
    )
  )
}

export async function appendUnsubscribeEvent(
  visitorKey: string,
  email: string,
  reason: string,
  country?: string
): Promise<void> {
  await appendEvent(
    withOptionalMeta(
      {
        at: new Date().toISOString(),
        type: 'unsubscribe',
        visitorKey
      },
      { country, email, detail: reason }
    )
  )
}
