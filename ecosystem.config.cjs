const fs = require('fs')
const path = require('path')

const root = __dirname
const polyfill = path.join(root, 'localstorage-ssr-polyfill.mjs')

/** Подхватить .env в process PM2 (NUXT_*/DEPLOY_SECRET и т.д.) */
function loadEnvFile() {
  const out = {}
  try {
    const envPath = path.join(root, '.env')
    if (!fs.existsSync(envPath)) return out
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const i = t.indexOf('=')
      if (i < 1) continue
      const key = t.slice(0, i).trim()
      let val = t.slice(i + 1).trim()
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1)
      }
      out[key] = val
    }
  } catch {
    /* ignore */
  }
  return out
}

const fileEnv = loadEnvFile()

module.exports = {
  apps: [
    {
      name: 'client-dev',
      cwd: root,
      script: 'npm',
      args: 'run dev',
      env: {
        ...fileEnv,
        NODE_ENV: 'development'
      }
    },
    {
      // Production: run Nitro directly (not `nuxt start` — it cds into .output and breaks --import path)
      name: 'client-prod',
      cwd: root,
      script: path.join(root, '.output/server/index.mjs'),
      interpreter: 'node',
      interpreter_args: `--import ${polyfill}`,
      env: {
        ...fileEnv,
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: process.env.PORT || fileEnv.PORT || '3000'
      }
    }
  ]
}
