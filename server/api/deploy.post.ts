import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * HTTPS-деплой для Jino: внешний SSH в контейнер часто не проброшен,
 * а 80/443 уже работают. Секрет: DEPLOY_SECRET (или NUXT_DEPLOY_SECRET).
 */
export default defineEventHandler(async (event) => {
  const expected =
    process.env.DEPLOY_SECRET ||
    process.env.NUXT_DEPLOY_SECRET ||
    useRuntimeConfig().deploySecret ||
    ''

  if (!expected || String(expected).length < 16) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Deploy is not configured (DEPLOY_SECRET)',
    })
  }

  const got =
    getHeader(event, 'x-deploy-secret') ||
    getHeader(event, 'authorization')?.replace(/^Bearer\s+/i, '') ||
    ''

  if (!got || got !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const root = process.cwd()
  const script = resolve(root, 'scripts/deploy-prod.sh')
  if (!existsSync(script)) {
    throw createError({ statusCode: 500, statusMessage: 'deploy script missing' })
  }

  // Фоном: иначе GitHub Actions / прокси отвалятся на длинной сборке
  const child = spawn('bash', [script], {
    cwd: root,
    detached: true,
    stdio: 'ignore',
    env: process.env,
  })
  child.unref()

  return {
    ok: true,
    started: true,
    pid: child.pid ?? null,
    log: '.deploy.log',
  }
})
