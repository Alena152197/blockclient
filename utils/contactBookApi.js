import { STRAPI_BASE } from '~/utils/strapiBase'
import {
  getAboutEntryForEditor,
  mergeLeadImageIntoMarkdown,
  extractFirstMarkdownImage,
  encodeBlankLinesForMarkdown
} from '~/utils/contactBookSpread'

/** Стандартное фото слева, если у разворота нет своего */
export const DEFAULT_CONTACT_BOOK_PHOTO = '/img/contacts.png'

/** Сообщение об ошибке Strapi 4/5 или Nuxt/h3 createError */
export function formatStrapiErr(errJson) {
  if (!errJson || typeof errJson !== 'object') return null

  // Nuxt/h3: { error: true, statusMessage: "Server Error", message: "..." }
  if (errJson.error === true) {
    const m = errJson.message || errJson.statusMessage
    return m && m !== 'Server Error' ? m : errJson.message || null
  }

  const e = errJson.error
  if (e && typeof e === 'object') {
    const errs = e.details?.errors
    if (Array.isArray(errs) && errs.length) {
      const parts = errs.map(
        (x) => (x.path ? `${x.path.join?.('.') || x.path}: ` : '') + (x.message || '')
      )
      return parts.filter(Boolean).join('; ') || e.message || null
    }
    return e.message || null
  }

  if (typeof errJson.message === 'string' && errJson.message !== 'Server Error') {
    return errJson.message
  }
  return null
}

/** HTTP-заголовки только Latin-1 — кириллицу (алёна) нельзя класть как есть. */
function headerSafe(value) {
  const s = String(value || '').trim()
  if (!s) return ''
  return encodeURIComponent(s)
}

/** Только JWT — для прямых запросов к Strapi (upload), иначе CORS из‑за x-editor-* */
function jwtAuthHeaders(extra = {}) {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('jwt') : null
  if (!token) throw new Error('Нужна авторизация.')
  return { Authorization: `Bearer ${token}`, ...extra }
}

/** JWT + редактор — только для наших Nuxt `/api/abouts` (не слать на Strapi напрямую) */
function nuxtEditorAuthHeaders(extra = {}) {
  const headers = jwtAuthHeaders(extra)
  try {
    const raw = localStorage.getItem('strapi_auth_user')
    const u = raw ? JSON.parse(raw) : null
    if (u?.email) headers['x-editor-email'] = headerSafe(u.email)
    if (u?.username) headers['x-editor-username'] = headerSafe(u.username)
  } catch {
    /* ignore */
  }
  return headers
}

function editorIdentityFromCache() {
  try {
    const raw = localStorage.getItem('strapi_auth_user')
    const u = raw ? JSON.parse(raw) : null
    if (!u || typeof u !== 'object') return {}
    return {
      editorEmail: typeof u.email === 'string' ? u.email : '',
      editorUsername: typeof u.username === 'string' ? u.username : ''
    }
  } catch {
    return {}
  }
}

async function readFetchError(response) {
  const errJson = await response.json().catch(() => ({}))
  const msg =
    formatStrapiErr(errJson) ||
    (typeof errJson.message === 'string' ? errJson.message : null) ||
    (errJson.statusMessage && errJson.statusMessage !== 'Server Error'
      ? errJson.statusMessage
      : null) ||
    (response.status === 403
      ? 'Нет прав на запись About в Strapi. Включите update/create для роли или добавьте STRAPI_API_TOKEN в .env.'
      : `Ошибка ${response.status}`)
  return msg
}

function parseUploadFileUrl(uploadData) {
  const item = Array.isArray(uploadData) ? uploadData[0] : uploadData
  if (!item || typeof item !== 'object') return null
  const url =
    item.url ||
    item.attributes?.url ||
    item?.formats?.large?.url ||
    item?.formats?.medium?.url
  return typeof url === 'string' ? url : null
}

/** Относительный путь `/uploads/...` из URL картинки разворота */
export function toRelativeUploadPath(url) {
  if (!url || typeof url !== 'string') return null
  if (url.startsWith('/img/')) return null
  if (url.startsWith('/')) return url
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

/**
 * Текущий lead-image из полного markdown тела записи (относительный путь).
 * @param {string} fullContent
 */
export function leadImageRelativeFromContent(fullContent) {
  const ex = extractFirstMarkdownImage(fullContent || '', STRAPI_BASE)
  if (!ex.imageUrl) return null
  return toRelativeUploadPath(ex.imageUrl)
}

/**
 * Сжимает фото до разумного размера для книги (меньше 413 от nginx/Strapi).
 * @param {File|Blob} file
 * @param {{ maxSide?: number, quality?: number, maxBytes?: number }} [opts]
 * @returns {Promise<File>}
 */
export async function compressImageForUpload(file, opts = {}) {
  const maxSide = opts.maxSide ?? 1600
  const quality = opts.quality ?? 0.82
  const maxBytes = opts.maxBytes ?? 600 * 1024
  if (!file || typeof file !== 'object') return file
  const type = file.type || ''
  if (!type.startsWith('image/') || type === 'image/gif' || type === 'image/svg+xml') {
    return file
  }
  // Уже достаточно маленький — не трогаем
  if (typeof file.size === 'number' && file.size <= maxBytes) {
    return file instanceof File ? file : new File([file], 'photo.jpg', { type })
  }

  try {
    const bitmap = await createImageBitmap(file)
    let { width, height } = bitmap
    const scale = Math.min(1, maxSide / Math.max(width, height))
    width = Math.max(1, Math.round(width * scale))
    height = Math.max(1, Math.round(height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close?.()
      return file instanceof File ? file : new File([file], 'photo.jpg', { type })
    }
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()

    let q = quality
    let blob = await new Promise((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', q)
    })
    // Если всё ещё крупно (лимит nginx ~1 МБ) — сильнее жмём
    while (blob && blob.size > 900 * 1024 && q > 0.45) {
      q = Math.round((q - 0.12) * 100) / 100
      blob = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', q)
      })
    }
    if (!blob) return file instanceof File ? file : new File([file], 'photo.jpg', { type })

    const base =
      (file instanceof File && file.name ? file.name.replace(/\.[^.]+$/, '') : 'photo') ||
      'photo'
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
  } catch {
    return file instanceof File ? file : new File([file], 'photo.jpg', { type: type || 'image/jpeg' })
  }
}

/** Загрузка только через Nuxt `/api/upload` (прокси + API token), без CORS. */
export async function uploadImageToStrapi(file) {
  const prepared = await compressImageForUpload(file)
  const formData = new FormData()
  formData.append('files', prepared)

  // Не ходим напрямую в Strapi из браузера — CORS и права upload у Authenticated
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: nuxtEditorAuthHeaders(),
    body: formData
  })

  if (!response.ok) {
    const text = await response.text()
    let msg = `Загрузка: ${response.status}`
    try {
      const j = JSON.parse(text)
      msg = formatStrapiErr(j) || j.message || j.error?.message || msg
    } catch {
      if (text) msg += ` — ${text.slice(0, 180)}`
    }
    if (response.status === 413) {
      msg =
        'Файл всё ещё слишком большой для nginx у Strapi. На VPS: в конфиге nginx добавьте client_max_body_size 20M; затем nginx -t && systemctl reload nginx'
    }
    throw new Error(msg)
  }

  const uploadData = await response.json()
  const url = parseUploadFileUrl(uploadData)
  if (!url) throw new Error('Ответ загрузки без URL.')
  return toRelativeUploadPath(url) || url
}

/**
 * PUT записи about.
 * @param {unknown} entry
 * @param {{ content: string, title?: string }} fields
 */
/** Только поля схемы About — лишний ключ в data → Strapi 400 Invalid key */
const ABOUT_WRITE_KEYS = new Set([
  'content',
  'text',
  'title',
  'page',
  'name',
  'heading',
  'label',
  'caption',
  'subject'
])

export async function updateAboutEntry(entry, fields) {
  const { documentId, id, bodyField, titleStrapiKey } = getAboutEntryForEditor(entry)
  const docId = documentId || id
  if (!docId) throw new Error('Нет идентификатора записи.')

  const field = ABOUT_WRITE_KEYS.has(bodyField) ? bodyField : 'content'
  const content =
    typeof fields.content === 'string' ? fields.content : String(fields.content ?? '')
  const data = { [field]: content }
  // title всегда пишем, если передали строку (даже пустую — сброс заголовка)
  const titleKey =
    titleStrapiKey && ABOUT_WRITE_KEYS.has(titleStrapiKey) ? titleStrapiKey : 'title'
  if (typeof fields.title === 'string') {
    data[titleKey] = fields.title.trim()
  }

  // Через Nuxt API: можно писать с STRAPI_API_TOKEN, если у роли Strapi нет update
  const response = await fetch(`/api/abouts/${encodeURIComponent(docId)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...nuxtEditorAuthHeaders()
    },
    body: JSON.stringify({ data, ...editorIdentityFromCache() })
  })

  if (!response.ok) {
    const msg = await readFetchError(response)
    if (/at most \d+ characters|максимум|maxLength|must be at most/i.test(msg)) {
      throw new Error(
        `${msg} В Strapi Admin → Content-Type Builder → About → content увеличьте Max length (например до 5000) и сохраните.`
      )
    }
    throw new Error(msg)
  }

  return response.json()
}

/**
 * POST нового разворота.
 * @param {{ bodyField?: string, content?: string }} [opts]
 */
export async function createAboutEntry(opts = {}) {
  const bodyField = opts.bodyField || 'content'
  const content =
    typeof opts.content === 'string' ? opts.content : 'Новый разворот.\n\nНажмите на текст, чтобы редактировать.'

  const response = await fetch('/api/abouts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...nuxtEditorAuthHeaders()
    },
    body: JSON.stringify({
      data: {
        [bodyField]: content
      },
      ...editorIdentityFromCache()
    })
  })

  if (!response.ok) {
    throw new Error(await readFetchError(response))
  }

  return response.json()
}

/**
 * Собрать полное тело: текст справа + опциональный lead-image.
 * Пустые строки кодируются как `&nbsp;`, чтобы абзацный пробел не пропадал после save.
 * @param {string} textMarkdown
 * @param {string | null} leadRelativeOrNull
 */
export function buildAboutContent(textMarkdown, leadRelativeOrNull) {
  const text = encodeBlankLinesForMarkdown(textMarkdown || '')
  if (leadRelativeOrNull) {
    return mergeLeadImageIntoMarkdown(text, leadRelativeOrNull, false)
  }
  return mergeLeadImageIntoMarkdown(text, null, true)
}
