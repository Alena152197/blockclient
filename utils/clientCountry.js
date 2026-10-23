let cached = null
let inflight = null

/**
 * Страна с стороны браузера (нужно на localhost и когда у Nuxt private IP).
 * Кэшируется на время жизни вкладки.
 * @returns {Promise<{ code: string, name: string }>}
 */
export async function detectClientCountry() {
  if (cached) return cached
  if (inflight) return inflight

  inflight = (async () => {
    const empty = { code: '', name: '' }
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), 2200)
      const res = await fetch('https://ipapi.co/json/', { signal: ctrl.signal })
      clearTimeout(t)
      if (!res.ok) {
        cached = empty
        return empty
      }
      const data = await res.json()
      const code = String(data?.country_code || '')
        .trim()
        .toUpperCase()
        .slice(0, 2)
      const name = String(data?.country_name || '')
        .trim()
        .slice(0, 80)
      cached = { code, name }
      return cached
    } catch {
      cached = empty
      return empty
    } finally {
      inflight = null
    }
  })()

  return inflight
}
