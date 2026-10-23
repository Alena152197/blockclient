const path = require('path')

const root = __dirname
const polyfill = path.join(root, 'localstorage-ssr-polyfill.mjs')

module.exports = {
  apps: [
    {
      name: 'client-dev',
      cwd: root,
      script: 'npm',
      args: 'run dev',
      env: {
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
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: process.env.PORT || '3000'
      }
    }
  ]
}
