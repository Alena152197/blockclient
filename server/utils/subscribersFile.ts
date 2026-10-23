import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const FILE = join(process.cwd(), '.data', 'subscribers.json')
const UNSUB_FILE = join(process.cwd(), '.data', 'unsubscribes.json')

export type Subscriber = {
  email: string
  at: string
  userId?: string | number | null
}

export type UnsubscribeRecord = {
  email: string
  at: string
  reason: string
  userId?: string | number | null
}

type SubscribersFile = {
  subscribers: Subscriber[]
}

type UnsubscribesFile = {
  items: UnsubscribeRecord[]
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidSubscriber(x: unknown): x is Subscriber {
  if (!x || typeof x !== 'object') return false
  const s = x as Record<string, unknown>
  return typeof s.email === 'string' && typeof s.at === 'string' && isValidEmail(s.email)
}

export async function readSubscribers(): Promise<SubscribersFile> {
  try {
    if (!existsSync(FILE)) return { subscribers: [] }
    const raw = await readFile(FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return { subscribers: [] }
    const list = (parsed as SubscribersFile).subscribers
    if (!Array.isArray(list)) return { subscribers: [] }
    return { subscribers: list.filter(isValidSubscriber) }
  } catch {
    return { subscribers: [] }
  }
}

async function writeSubscribers(data: SubscribersFile): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

/**
 * Добавить email. Возвращает { added, count, email }.
 * Повторная подписка тем же email — не дублирует.
 */
export async function addSubscriber(
  emailRaw: string,
  userId?: string | number | null
): Promise<{ added: boolean; count: number; email: string }> {
  const email = String(emailRaw || '')
    .trim()
    .toLowerCase()
  if (!isValidEmail(email)) {
    throw new Error('invalid_email')
  }

  const data = await readSubscribers()
  const existing = data.subscribers.find((s) => s.email === email)
  if (!existing) {
    data.subscribers.push({
      email,
      at: new Date().toISOString(),
      userId: userId ?? null
    })
    await writeSubscribers(data)
    return { added: true, count: data.subscribers.length, email }
  }
  // Повторный вход с аккаунтом — привязываем userId, чтобы в статистике был «Подписан»
  if (userId != null && (existing.userId == null || String(existing.userId) !== String(userId))) {
    existing.userId = userId
    await writeSubscribers(data)
  }
  return { added: false, count: data.subscribers.length, email }
}

export async function isEmailSubscribed(emailRaw: string): Promise<boolean> {
  const email = String(emailRaw || '')
    .trim()
    .toLowerCase()
  if (!isValidEmail(email)) return false
  const data = await readSubscribers()
  return data.subscribers.some((s) => s.email === email)
}

function isValidUnsub(x: unknown): x is UnsubscribeRecord {
  if (!x || typeof x !== 'object') return false
  const r = x as Record<string, unknown>
  return (
    typeof r.email === 'string' &&
    typeof r.at === 'string' &&
    typeof r.reason === 'string' &&
    r.reason.trim().length > 0
  )
}

export async function readUnsubscribes(): Promise<UnsubscribesFile> {
  try {
    if (!existsSync(UNSUB_FILE)) return { items: [] }
    const raw = await readFile(UNSUB_FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return { items: [] }
    const items = (parsed as UnsubscribesFile).items
    if (!Array.isArray(items)) return { items: [] }
    return { items: items.filter(isValidUnsub) }
  } catch {
    return { items: [] }
  }
}

async function appendUnsubscribeReason(record: UnsubscribeRecord): Promise<void> {
  const data = await readUnsubscribes()
  data.items.unshift(record)
  if (data.items.length > 500) data.items = data.items.slice(0, 500)
  await mkdir(dirname(UNSUB_FILE), { recursive: true })
  await writeFile(UNSUB_FILE, JSON.stringify(data, null, 2), 'utf8')
}

/**
 * Удалить подписчика и сохранить причину отписки.
 */
export async function removeSubscriber(
  emailRaw: string,
  reasonRaw: string,
  userId?: string | number | null
): Promise<{ removed: boolean; email: string }> {
  const email = String(emailRaw || '')
    .trim()
    .toLowerCase()
  if (!isValidEmail(email)) {
    throw new Error('invalid_email')
  }
  const reason = String(reasonRaw || '').trim()
  if (!reason || reason.length > 2000) {
    throw new Error('invalid_reason')
  }

  const data = await readSubscribers()
  const before = data.subscribers.length
  data.subscribers = data.subscribers.filter((s) => s.email !== email)
  const removed = data.subscribers.length < before
  if (removed) {
    await writeSubscribers(data)
  }
  await appendUnsubscribeReason({
    email,
    at: new Date().toISOString(),
    reason,
    userId: userId ?? null
  })
  return { removed, email }
}
