import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const FILE = join(process.cwd(), '.data', 'blocked-users.json')

export type BlockedUser = {
  email: string
  at: string
  userId?: string | number | null
  reason?: string
  blockedBy?: string
}

type BlockedFile = {
  blocked: BlockedUser[]
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidBlocked(x: unknown): x is BlockedUser {
  if (!x || typeof x !== 'object') return false
  const b = x as Record<string, unknown>
  return typeof b.email === 'string' && typeof b.at === 'string' && isValidEmail(b.email)
}

export async function readBlockedUsers(): Promise<BlockedFile> {
  try {
    if (!existsSync(FILE)) return { blocked: [] }
    const raw = await readFile(FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return { blocked: [] }
    const list = (parsed as BlockedFile).blocked
    if (!Array.isArray(list)) return { blocked: [] }
    return { blocked: list.filter(isValidBlocked) }
  } catch {
    return { blocked: [] }
  }
}

async function writeBlockedUsers(data: BlockedFile): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function isBlockedIdentity(
  emailRaw?: string | null,
  userId?: string | number | null
): Promise<boolean> {
  const email = String(emailRaw || '')
    .trim()
    .toLowerCase()
  const uid = userId != null && String(userId).length ? String(userId) : ''
  if (!email && !uid) return false

  const { blocked } = await readBlockedUsers()
  return blocked.some((b) => {
    if (email && b.email === email) return true
    if (uid && b.userId != null && String(b.userId) === uid) return true
    return false
  })
}

export async function addBlockedUser(opts: {
  email: string
  userId?: string | number | null
  reason?: string
  blockedBy?: string
}): Promise<{ added: boolean; entry: BlockedUser }> {
  const email = String(opts.email || '')
    .trim()
    .toLowerCase()
  if (!isValidEmail(email)) {
    throw new Error('invalid_email')
  }

  const data = await readBlockedUsers()
  const existing = data.blocked.find((b) => b.email === email)
  if (existing) {
    if (opts.userId != null && existing.userId == null) {
      existing.userId = opts.userId
      await writeBlockedUsers(data)
    }
    return { added: false, entry: existing }
  }

  const entry: BlockedUser = {
    email,
    at: new Date().toISOString(),
    userId: opts.userId ?? null,
    reason: String(opts.reason || '').trim().slice(0, 500) || undefined,
    blockedBy: String(opts.blockedBy || '').trim().slice(0, 200) || undefined
  }
  data.blocked.unshift(entry)
  await writeBlockedUsers(data)
  return { added: true, entry }
}

export async function removeBlockedUser(
  emailRaw: string
): Promise<{ removed: boolean; email: string }> {
  const email = String(emailRaw || '')
    .trim()
    .toLowerCase()
  if (!isValidEmail(email)) {
    throw new Error('invalid_email')
  }
  const data = await readBlockedUsers()
  const before = data.blocked.length
  data.blocked = data.blocked.filter((b) => b.email !== email)
  const removed = data.blocked.length < before
  if (removed) await writeBlockedUsers(data)
  return { removed, email }
}
