import { resolveStrapiBase } from './strapiBase'

/** Совпадает с клиентом; при необходимости задайте STRAPI_URL / NUXT_PUBLIC_STRAPI_URL. */
function strapiBase(): string {
  return resolveStrapiBase()
}

function meUrlTries(): string[] {
  const base = strapiBase()
  // Сначала лёгкие URL: страница статистики дергает verify много раз подряд.
  return [
    `${base}/api/users/me?populate[role]=true`,
    `${base}/api/users/me?populate=role`,
    `${base}/api/users/me`,
    `${base}/api/users/me?populate=*`,
    `${base}/api/users/me?populate[avatar]=true&populate[role]=true`
  ]
}

/** Strapi 4/5: /users/me обычно плоский; редко — обёртка data/attributes. */
function unwrapMeBody(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  if (o.data && typeof o.data === 'object' && !Array.isArray(o.data)) {
    const inner = o.data as Record<string, unknown>
    if (inner.attributes && typeof inner.attributes === 'object' && !Array.isArray(inner.attributes)) {
      const a = inner.attributes as Record<string, unknown>
      return {
        id: inner.id,
        documentId: inner.documentId,
        ...a
      }
    }
    return inner as Record<string, unknown>
  }
  return o
}

/**
 * Как в `stores/search.js` `fetchUserMe`: role часто только с populate или вложена в data.
 */
function normalizeRoleFromMe(rawRole: unknown): { name?: string; type?: string } | null {
  let r = rawRole
  if (r && typeof r === 'object' && 'data' in (r as Record<string, unknown>)) {
    const d = (r as { data: unknown }).data
    r = Array.isArray(d) ? d[0] : d
  }
  if (typeof r === 'string') {
    return { name: r, type: undefined }
  }
  if (!r || typeof r !== 'object') return null
  const row = Array.isArray(r) ? r[0] : r
  if (!row || typeof row !== 'object') return null
  const rec = row as Record<string, unknown>
  const attrs = rec.attributes
  if (attrs && typeof attrs === 'object') {
    const a = attrs as Record<string, unknown>
    const name = typeof a.name === 'string' ? a.name : undefined
    const type = typeof a.type === 'string' ? a.type : undefined
    if (name || type) return { name, type }
  }
  const name = typeof rec.name === 'string' ? rec.name : undefined
  const type = typeof rec.type === 'string' ? rec.type : undefined
  if (name || type) return { name, type }
  return null
}

function roleIsActionable(r: { name?: string; type?: string } | null): boolean {
  if (!r) return false
  return Boolean(String(r.name || '').trim() || String(r.type || '').trim())
}

type VerifiedUser = Record<string, unknown>

const VERIFY_TTL_MS = 60_000
const verifyCache = new Map<string, { at: number; user: VerifiedUser }>()
const verifyInflight = new Map<string, Promise<VerifiedUser | null>>()

async function verifyBearerUserUncached(authHeader: string): Promise<VerifiedUser | null> {
  try {
    let lastOk: Record<string, unknown> | null = null

    for (const url of meUrlTries()) {
      const res = await fetch(url, {
        headers: { Authorization: authHeader }
      })
      if (!res.ok) continue

      const rawJson = await res.json()
      const data = unwrapMeBody(rawJson)
      lastOk = data

      const normalized = normalizeRoleFromMe(data.role)
      if (roleIsActionable(normalized)) {
        return { ...data, role: normalized }
      }
    }

    if (lastOk) {
      const normalized = normalizeRoleFromMe(lastOk.role)
      return { ...lastOk, role: normalized ?? lastOk.role }
    }
    return null
  } catch {
    return null
  }
}

/** Проверка JWT через Strapi; при успехе возвращает объект пользователя с плоским `role` */
export async function verifyBearerUser(authHeader: string | undefined) {
  if (!authHeader || !/^Bearer\s+\S+/i.test(authHeader)) {
    return null
  }

  const key = authHeader.trim()
  const cached = verifyCache.get(key)
  if (cached && Date.now() - cached.at < VERIFY_TTL_MS) {
    return cached.user
  }

  const pending = verifyInflight.get(key)
  if (pending) return pending

  const task = verifyBearerUserUncached(key)
    .then((user) => {
      if (user) {
        verifyCache.set(key, { at: Date.now(), user })
      }
      return user
    })
    .finally(() => {
      verifyInflight.delete(key)
    })

  verifyInflight.set(key, task)
  return task
}
