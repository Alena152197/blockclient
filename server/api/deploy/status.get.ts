import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineEventHandler, getHeader } from 'h3'

/**
 * Статус фонового деплоя.
 * Без секрета — только status (ok/busy/fail), без logTail.
 * С DEPLOY_SECRET — полный ответ включая хвост .deploy.log.
 */
export default defineEventHandler((event) => {
  const expected =
    process.env.DEPLOY_SECRET ||
    process.env.NUXT_DEPLOY_SECRET ||
    useRuntimeConfig().deploySecret ||
    ''

  const got =
    getHeader(event, 'x-deploy-secret') ||
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '') ||
    ''

  const authed = Boolean(expected && String(expected).length >= 16 && got && got === expected)

  const root =
    process.env.DEPLOY_ROOT ||
    (existsSync(resolve(process.cwd(), '.deploy.status'))
      ? process.cwd()
      : '/var/www/blockclient')
  const statusPath = resolve(root, '.deploy.status')
  const logPath = resolve(root, '.deploy.log')

  let status = 'unknown'
  let detail = ''
  if (existsSync(statusPath)) {
    detail = readFileSync(statusPath, 'utf8').trim()
    status = detail.split(/\s+/)[0] || 'unknown'
  }

  if (!authed) {
    // CI поллит status без секрета — logTail не отдаём
    return { status }
  }

  let logTail = ''
  if (existsSync(logPath)) {
    const raw = readFileSync(logPath, 'utf8')
    logTail = raw.slice(-1200)
  }

  return { status, detail, logTail }
})
