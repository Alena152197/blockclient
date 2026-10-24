import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * HTTPS-деплой для Jino. Секрет: DEPLOY_SECRET / NUXT_DEPLOY_SECRET.
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

  // PM2 cwd = корень проекта, но на всякий случай явный путь
  const root =
    process.env.DEPLOY_ROOT ||
    (existsSync(resolve(process.cwd(), 'scripts/deploy-prod.sh'))
      ? process.cwd()
      : '/var/www/blockclient')
  const script = resolve(root, 'scripts/deploy-prod.sh')
  if (!existsSync(script)) {
    throw createError({
      statusCode: 500,
      statusMessage: `deploy script missing at ${script}`,
    })
  }

  const child = spawn('/bin/bash', [script], {
    cwd: root,
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      HOME: process.env.HOME || '/root',
      DEPLOY_ROOT: root,
    },
  })
  child.unref()

  return {
    ok: true,
    started: true,
    pid: child.pid ?? null,
    root,
    log: '.deploy.log',
    status: '.deploy.status',
  }
})
