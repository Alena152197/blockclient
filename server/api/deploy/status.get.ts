import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Статус фонового деплоя (для CI и отладки). Без секрета — только ok/busy/fail + sha. */
export default defineEventHandler(() => {
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

  let logTail = ''
  if (existsSync(logPath)) {
    const raw = readFileSync(logPath, 'utf8')
    logTail = raw.slice(-1200)
  }

  return { status, detail, logTail }
})
