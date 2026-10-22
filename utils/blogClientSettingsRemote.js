import {
  BLOG_INDEX_BG_STATE_KEY,
  CONTACT_PAGE_BG_STATE_KEY,
  INTERESTS_PAGE_BG_STATE_KEY
} from '~/utils/blogIndexBg'
import { BLOG_DISPLAY_TITLE_KEY } from '~/utils/blogDisplayTitle'
import { POST_CARD_STYLE_STORAGE_KEY, POST_CARD_STYLE_CHANGED_EVENT } from '~/utils/postCardStyle'

/**
 * Объект с сервера + уже сохранённый local: локальные поля не затираются устаревшим ответом GET
 * (иначе после «Сохранить» настройки могут пропасть при следующей загрузке или гонке с PUT).
 */
function mergeObjectPayload(serverVal, storageKey) {
  if (serverVal == null || typeof serverVal !== 'object') return serverVal
  const local = parseJsonState(localStorage.getItem(storageKey))
  if (!local || typeof local !== 'object') return serverVal
  return { ...serverVal, ...local }
}

/** Ключи в теле GET/PUT /api/blog-settings совпадают с ключами localStorage для фонов и названия */
export function applyBlogSettingsPayload(payload) {
  if (!payload || typeof payload !== 'object' || typeof window === 'undefined') return

  const applyBg = (storageKey, eventName) => {
    if (!Object.prototype.hasOwnProperty.call(payload, storageKey)) return
    const v = payload[storageKey]
    try {
      if (v === null || v === undefined) {
        localStorage.removeItem(storageKey)
      } else {
        localStorage.setItem(storageKey, JSON.stringify(v))
      }
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(eventName))
  }

  applyBg(BLOG_INDEX_BG_STATE_KEY, 'blog-index-bg-changed')
  applyBg(CONTACT_PAGE_BG_STATE_KEY, 'contact-page-bg-changed')
  applyBg(INTERESTS_PAGE_BG_STATE_KEY, 'interests-page-bg-changed')

  if (Object.prototype.hasOwnProperty.call(payload, BLOG_DISPLAY_TITLE_KEY)) {
    const t = payload[BLOG_DISPLAY_TITLE_KEY]
    try {
      const s = typeof t === 'string' ? t.trim() : ''
      if (!s) {
        localStorage.removeItem(BLOG_DISPLAY_TITLE_KEY)
      } else {
        localStorage.setItem(BLOG_DISPLAY_TITLE_KEY, s)
      }
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event('blog-display-title-changed'))
  }

  if (Object.prototype.hasOwnProperty.call(payload, POST_CARD_STYLE_STORAGE_KEY)) {
    const v = payload[POST_CARD_STYLE_STORAGE_KEY]
    try {
      // null с сервера = «нет данных в файле», а не «сбросить браузер»: иначе локальные
      // настройки (без успешного PUT / без JWT) затирались при каждой загрузке.
      if (v === null || v === undefined) {
        /* keep localStorage */
      } else {
        const merged = mergeObjectPayload(v, POST_CARD_STYLE_STORAGE_KEY)
        localStorage.setItem(POST_CARD_STYLE_STORAGE_KEY, JSON.stringify(merged))
      }
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(POST_CARD_STYLE_CHANGED_EVENT))
  }
}

function parseJsonState(raw) {
  if (raw == null || raw === '') return null
  try {
    const o = JSON.parse(raw)
    return o && typeof o === 'object' ? o : null
  } catch {
    return null
  }
}

export function collectBlogSettingsPayloadForPut() {
  if (typeof window === 'undefined') {
    return {}
  }
  const out = {}
  try {
    out[BLOG_INDEX_BG_STATE_KEY] = parseJsonState(localStorage.getItem(BLOG_INDEX_BG_STATE_KEY))
    out[CONTACT_PAGE_BG_STATE_KEY] = parseJsonState(localStorage.getItem(CONTACT_PAGE_BG_STATE_KEY))
    out[INTERESTS_PAGE_BG_STATE_KEY] = parseJsonState(localStorage.getItem(INTERESTS_PAGE_BG_STATE_KEY))
    out[BLOG_DISPLAY_TITLE_KEY] = localStorage.getItem(BLOG_DISPLAY_TITLE_KEY)?.trim() ?? ''
    const postCard = parseJsonState(localStorage.getItem(POST_CARD_STYLE_STORAGE_KEY))
    if (postCard != null) out[POST_CARD_STYLE_STORAGE_KEY] = postCard
  } catch {
    /* ignore */
  }
  return out
}

let persistTimer = null

export function schedulePersistBlogSettingsToServer() {
  if (typeof window === 'undefined') return
  clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    persistBlogSettingsToServer().catch(() => {})
  }, 800)
}

export async function persistBlogSettingsToServer() {
  if (typeof window === 'undefined') return
  const token = localStorage.getItem('jwt')
  if (!token) return
  const body = collectBlogSettingsPayloadForPut()
  await $fetch('/api/blog-settings', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body
  })
}
