/**
 * Load before Nuxt/Vite via NODE_OPTIONS=--import=./localstorage-ssr-polyfill.mjs
 * In-memory localStorage for SSR (Node has no browser storage; --localstorage-file is not allowed in NODE_OPTIONS).
 */
if (typeof process !== 'undefined' && process.versions?.node) {
  const g = globalThis
  const ls = g.localStorage
  const broken = ls != null && typeof ls.getItem !== 'function'
  if (broken || ls == null) {
    const store = new Map()
    g.localStorage = {
      get length() {
        return store.size
      },
      clear() {
        store.clear()
      },
      getItem(key) {
        return store.has(key) ? store.get(key) : null
      },
      key(index) {
        return [...store.keys()][index] ?? null
      },
      removeItem(key) {
        store.delete(key)
      },
      setItem(key, value) {
        store.set(key, String(value))
      },
    }
  }
}
