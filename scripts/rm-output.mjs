/**
 * Перед `nuxt dev` / `nuxt build` (predev / prebuild) удаляем каталоги вывода:
 * — `.output` — стандартный вывод Nitro;
 * — `.nuxt/nitro-output` — остатки от старого nuxt.config (nitro.output.dir), иначе ENOTEMPTY;
 * — `.nuxt/dist` — бандл SSR; если он остаётся «битым» после hot-restart, в браузере бывает 500:
 *   Package import specifier "#internal/nuxt/paths" is not defined…
 *
 * Сначала `rm -rf` из shell; затем fs.rmSync.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const dirsToRemove = [
  path.join(root, '.output'),
  path.join(root, '.nuxt', 'nitro-output'),
  path.join(root, '.nuxt', 'dist')
]

function removeWithFs(dir) {
  fs.rmSync(dir, { recursive: true, force: true })
}

function removeWithShell(dir) {
  if (process.platform === 'win32') {
    execFileSync('cmd', ['/c', 'rmdir', '/s', '/q', dir], {
      stdio: 'ignore',
      cwd: root,
      windowsHide: true
    })
  } else {
    execFileSync('rm', ['-rf', '--', dir], { stdio: 'ignore', cwd: root })
  }
}

function removeDir(dir) {
  if (!fs.existsSync(dir)) return
  try {
    removeWithShell(dir)
  } catch {
    try {
      removeWithFs(dir)
    } catch (e) {
      if (e && e.code !== 'ENOENT') throw e
    }
  }
}

for (const dir of dirsToRemove) {
  removeDir(dir)
}
