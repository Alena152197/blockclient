/**
 * Полная очистка кэша Nuxt (если после `npm run dev` страницы отдают 500 или странные ошибки импорта).
 * Использование: `npm run clean:all`, затем снова `npm run dev`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

for (const name of ['.nuxt', '.output']) {
  const p = path.join(root, name)
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true })
    console.log(`removed ${name}`)
  }
}
