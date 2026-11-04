import { createError, getRequestIP } from 'h3'
import type { H3Event } from 'h3'

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

/** Простая in-memory квота (на один инстанс Node/PM2). */
export function assertRateLimit(
  event: H3Event,
  opts: { key: string; limit: number; windowMs: number; message?: string }
) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const id = `${opts.key}:${ip}`
  const now = Date.now()
  let b = buckets.get(id)
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + opts.windowMs }
    buckets.set(id, b)
  }
  b.count += 1
  if (b.count > opts.limit) {
    throw createError({
      statusCode: 429,
      message: opts.message || 'Слишком много запросов. Подождите немного.'
    })
  }
}

/** Квота по ключу пользователя (после verify), не только по IP. */
export function assertKeyedRateLimit(
  key: string,
  opts: { limit: number; windowMs: number; message?: string }
) {
  const id = key
  const now = Date.now()
  let b = buckets.get(id)
  if (!b || now >= b.resetAt) {
    b = { count: 0, resetAt: now + opts.windowMs }
    buckets.set(id, b)
  }
  b.count += 1
  if (b.count > opts.limit) {
    throw createError({
      statusCode: 429,
      message: opts.message || 'Слишком много запросов. Подождите немного.'
    })
  }
}

/** Периодическая уборка, чтобы Map не росла бесконечно. */
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [k, b] of buckets) {
      if (now >= b.resetAt) buckets.delete(k)
    }
  }, 60_000).unref?.()
}
