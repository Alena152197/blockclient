import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'

const FILE = join(process.cwd(), '.data', 'suggestions.json')
const MAX = 500

export type Suggestion = {
  id: string
  at: string
  name: string
  text: string
  email?: string
  userId?: string | number | null
  /** Ответ администратора */
  reply?: string
  repliedAt?: string
}

type SuggestionsFile = {
  suggestions: Suggestion[]
}

function isValid(x: unknown): x is Suggestion {
  if (!x || typeof x !== 'object') return false
  const s = x as Record<string, unknown>
  return (
    typeof s.id === 'string' &&
    typeof s.at === 'string' &&
    typeof s.name === 'string' &&
    typeof s.text === 'string' &&
    s.text.trim().length > 0
  )
}

export async function readSuggestions(): Promise<SuggestionsFile> {
  try {
    if (!existsSync(FILE)) return { suggestions: [] }
    const raw = await readFile(FILE, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return { suggestions: [] }
    const list = (parsed as SuggestionsFile).suggestions
    if (!Array.isArray(list)) return { suggestions: [] }
    return { suggestions: list.filter(isValid) }
  } catch {
    return { suggestions: [] }
  }
}

async function writeSuggestions(data: SuggestionsFile): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function addSuggestion(input: {
  name?: string
  text: string
  email?: string
  userId?: string | number | null
}): Promise<Suggestion> {
  const text = String(input.text || '').trim()
  if (!text || text.length > 2000) {
    throw new Error('invalid_text')
  }
  const name = String(input.name || '').trim().slice(0, 80) || 'Без имени'
  const email = String(input.email || '')
    .trim()
    .toLowerCase()
    .slice(0, 120)

  const entry: Suggestion = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    name,
    text,
    email: email || undefined,
    userId: input.userId ?? null
  }

  const data = await readSuggestions()
  data.suggestions.unshift(entry)
  if (data.suggestions.length > MAX) {
    data.suggestions = data.suggestions.slice(0, MAX)
  }
  await writeSuggestions(data)
  return entry
}

export async function replyToSuggestion(
  id: string,
  replyRaw: string
): Promise<Suggestion> {
  const reply = String(replyRaw || '').trim()
  if (!reply || reply.length > 4000) {
    throw new Error('invalid_reply')
  }

  const data = await readSuggestions()
  const idx = data.suggestions.findIndex((s) => s.id === id)
  if (idx < 0) throw new Error('not_found')

  data.suggestions[idx] = {
    ...data.suggestions[idx],
    reply,
    repliedAt: new Date().toISOString()
  }
  await writeSuggestions(data)
  return data.suggestions[idx]
}

/** Обращения текущего пользователя (по userId и/или email). */
export async function findSuggestionsForUser(opts: {
  userId?: string | number | null
  email?: string | null
}): Promise<Suggestion[]> {
  const { suggestions } = await readSuggestions()
  const uid = opts.userId != null ? String(opts.userId) : ''
  const email = String(opts.email || '')
    .trim()
    .toLowerCase()

  return suggestions.filter((s) => {
    if (uid && s.userId != null && String(s.userId) === uid) return true
    if (email && s.email && s.email === email) return true
    return false
  })
}
