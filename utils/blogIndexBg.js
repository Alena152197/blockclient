/** @deprecated — миграция со старых данных */
export const BLOG_INDEX_BG_STORAGE_KEY = 'blog_index_bg_url'

/** JSON: { url, brightness, contrast, ... } */
export const BLOG_INDEX_BG_STATE_KEY = 'blog_index_bg'

/** Фон страницы «Моя история» (/contact) */
export const CONTACT_PAGE_BG_STATE_KEY = 'contact_page_bg'

/** Фон страницы «Мои интересы» (/blog) */
export const INTERESTS_PAGE_BG_STATE_KEY = 'interests_page_bg'

/** @type {Record<string, { stateKey: string, legacyKey: string | null, event: string }>} */
const PAGE_BG_CONFIG = {
    index: {
        stateKey: BLOG_INDEX_BG_STATE_KEY,
        legacyKey: BLOG_INDEX_BG_STORAGE_KEY,
        event: 'blog-index-bg-changed'
    },
    contact: {
        stateKey: CONTACT_PAGE_BG_STATE_KEY,
        legacyKey: null,
        event: 'contact-page-bg-changed'
    },
    interests: {
        stateKey: INTERESTS_PAGE_BG_STATE_KEY,
        legacyKey: null,
        event: 'interests-page-bg-changed'
    }
}

function getPageBgConfig(pageId) {
    const c = PAGE_BG_CONFIG[pageId]
    if (!c) throw new Error(`Unknown page background id: ${pageId}`)
    return c
}

export const DEFAULT_BLOG_BG_EFFECTS = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hue: 0,
    overlay: 0,
    vignette: 0,
    posX: 50,
    posY: 50,
    fit: 'cover'
}

function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n))
}

export function normalizeBlogBgState(raw) {
    if (!raw || typeof raw !== 'object') return null
    const d = DEFAULT_BLOG_BG_EFFECTS
    const url = typeof raw.url === 'string' ? raw.url : ''
    return {
        url,
        brightness: clamp(Number(raw.brightness) || d.brightness, 30, 200),
        contrast: clamp(Number(raw.contrast) || d.contrast, 30, 200),
        saturation: clamp(Number(raw.saturation) || d.saturation, 0, 200),
        blur: clamp(Number(raw.blur) || d.blur, 0, 16),
        hue: clamp(Number(raw.hue) || d.hue, 0, 360),
        overlay: clamp(Number(raw.overlay) || d.overlay, 0, 85),
        vignette: clamp(Number(raw.vignette) || d.vignette, 0, 100),
        posX: clamp(Number(raw.posX) ?? d.posX, 0, 100),
        posY: clamp(Number(raw.posY) ?? d.posY, 0, 100),
        fit: ['cover', 'contain', 'fill'].includes(raw.fit) ? raw.fit : 'cover'
    }
}

export function loadPageBgState(pageId) {
    if (typeof window === 'undefined') return null
    const { stateKey, legacyKey } = getPageBgConfig(pageId)
    try {
        const json = localStorage.getItem(stateKey)
        if (json) {
            return normalizeBlogBgState(JSON.parse(json))
        }
        if (legacyKey) {
            const legacy = localStorage.getItem(legacyKey)
            if (legacy) {
                return normalizeBlogBgState({ url: legacy })
            }
        }
    } catch {
        /* ignore */
    }
    return null
}

export function savePageBgState(pageId, state) {
    if (typeof window === 'undefined' || !state?.url) return
    const normalized = normalizeBlogBgState(state)
    if (!normalized?.url) return
    const { stateKey, legacyKey, event } = getPageBgConfig(pageId)
    try {
        localStorage.setItem(stateKey, JSON.stringify(normalized))
        if (legacyKey) localStorage.removeItem(legacyKey)
        window.dispatchEvent(new Event(event))
    } catch {
        /* ignore */
    }
    if (typeof window !== 'undefined') {
        import('~/utils/blogClientSettingsRemote').then((m) => m.schedulePersistBlogSettingsToServer()).catch(() => {})
    }
}

export function clearPageBgState(pageId) {
    if (typeof window === 'undefined') return
    const { stateKey, legacyKey, event } = getPageBgConfig(pageId)
    try {
        localStorage.removeItem(stateKey)
        if (legacyKey) localStorage.removeItem(legacyKey)
        window.dispatchEvent(new Event(event))
    } catch {
        /* ignore */
    }
    if (typeof window !== 'undefined') {
        import('~/utils/blogClientSettingsRemote').then((m) => m.schedulePersistBlogSettingsToServer()).catch(() => {})
    }
}

export function loadBlogIndexBgState() {
    return loadPageBgState('index')
}

export function saveBlogIndexBgState(state) {
    return savePageBgState('index', state)
}

export function buildCustomBgLayerStyle(state) {
    if (!state?.url) return {}
    const e = { ...DEFAULT_BLOG_BG_EFFECTS, ...state }
    const parts = []
    if (e.hue) parts.push(`hue-rotate(${e.hue}deg)`)
    parts.push(`brightness(${e.brightness}%)`)
    parts.push(`contrast(${e.contrast}%)`)
    parts.push(`saturate(${e.saturation}%)`)
    if (e.blur > 0) parts.push(`blur(${e.blur}px)`)

    const bgSize = e.fit === 'fill' ? '100% 100%' : e.fit

    return {
        backgroundImage: `url(${state.url})`,
        backgroundSize: bgSize,
        backgroundPosition: `${e.posX}% ${e.posY}%`,
        backgroundRepeat: 'no-repeat',
        filter: parts.join(' ')
    }
}

/**
 * Стили для полноэкранного <img> с object-fit — на узких/высоких экранах ведёт себя предсказуемее, чем background-size.
 * Те же фильтры и режим вписывания (cover / contain / fill), что в {@link buildCustomBgLayerStyle}.
 */
export function buildCustomBgImageStyle(state) {
    if (!state?.url) return {}
    const e = { ...DEFAULT_BLOG_BG_EFFECTS, ...state }
    const parts = []
    if (e.hue) parts.push(`hue-rotate(${e.hue}deg)`)
    parts.push(`brightness(${e.brightness}%)`)
    parts.push(`contrast(${e.contrast}%)`)
    parts.push(`saturate(${e.saturation}%)`)
    if (e.blur > 0) parts.push(`blur(${e.blur}px)`)

    const objectFit = e.fit === 'fill' ? 'fill' : e.fit === 'contain' ? 'contain' : 'cover'

    return {
        objectFit,
        objectPosition: `${e.posX}% ${e.posY}%`,
        filter: parts.join(' ')
    }
}

export function buildCustomBgOverlayStyle(state) {
    if (!state?.url) return {}
    const e = { ...DEFAULT_BLOG_BG_EFFECTS, ...state }
    const o = (e.overlay || 0) / 100
    const v = (e.vignette || 0) / 100
    const styles = {
        backgroundColor: o > 0 ? `rgba(0,0,0,${o * 0.82})` : 'transparent',
        boxShadow: 'none'
    }
    if (v > 0) {
        const spread = 40 + v * 1.4
        const alpha = v * 0.55
        styles.boxShadow = `inset 0 0 ${spread}px rgba(0,0,0,${alpha})`
    }
    return styles
}
