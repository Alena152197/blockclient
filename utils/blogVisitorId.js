const STORAGE_KEY = 'blog_anon_visitor_id'

/** Стабильный ID гостя в этом браузере (для журнала посещений) */
export function getOrCreateVisitorId() {
    if (typeof window === 'undefined') return ''
    try {
        let id = localStorage.getItem(STORAGE_KEY)
        if (!id || id.length < 8) {
            id =
                typeof crypto !== 'undefined' && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `v_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`
            localStorage.setItem(STORAGE_KEY, id)
        }
        return id
    } catch {
        return `fallback_${Date.now()}`
    }
}
