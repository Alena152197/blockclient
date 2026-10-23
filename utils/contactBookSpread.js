import { STRAPI_BASE } from '~/utils/strapiBase'

/**
 * Достаёт «плоский» объект записи (Strapi v4 attributes или плоский v5).
 * @param {unknown} entry
 */
function unwrapEntry(entry) {
  if (!entry || typeof entry !== 'object') return {}
  const a = /** @type {Record<string, unknown>} */ (entry).attributes
  if (a && typeof a === 'object') return /** @type {Record<string, unknown>} */ ({ ...a, id: entry.id, documentId: entry.documentId })
  return /** @type {Record<string, unknown>} */ (entry)
}

/**
 * Строка из поля Strapi: plain string или локализация `{ "ru-RU": "..." }`.
 * @param {unknown} v
 */
function strapiScalarToString(v) {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
    const vals = Object.values(v).filter((x) => typeof x === 'string' && x.trim())
    return vals[0] || ''
  }
  return ''
}

/**
 * URL медиа из типичных полей Strapi (image, cover, photo).
 * @param {Record<string, unknown>} raw
 * @param {string} base
 */
function mediaUrlFromFields(raw, base) {
  for (const key of ['image', 'cover', 'photo', 'picture']) {
    const v = raw[key]
    if (!v) continue
    const d = /** @type {{ data?: unknown }} */ (v).data
    if (d) {
      const one = Array.isArray(d) ? d[0] : d
      const url =
        /** @type {{ attributes?: { url?: string } }} */ (one)?.attributes?.url ??
        /** @type {{ url?: string }} */ (one)?.url
      if (url && typeof url === 'string') return url.startsWith('http') ? url : `${base}${url}`
    }
    if (typeof v === 'object' && v !== null && 'url' in v && typeof /** @type {{ url?: string }} */ (v).url === 'string') {
      const url = /** @type {{ url: string }} */ (v).url
      return url.startsWith('http') ? url : `${base}${url}`
    }
  }
  return null
}

/**
 * Первое markdown-изображение `![](url)` в начале текста — на лист с фото, остаток — на соседний.
 * @param {string} md
 * @param {string} base
 */
export function extractFirstMarkdownImage(md, base) {
  if (!md || typeof md !== 'string') return { imageUrl: null, rest: '' }
  const trimmed = md.trim()
  const re = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*/m
  const m = trimmed.match(re)
  if (!m) return { imageUrl: null, rest: md }
  let url = m[2].trim()
  if (url.startsWith('/') && !url.startsWith('//')) url = `${base}${url}`
  return { imageUrl: url, rest: trimmed.slice(m[0].length).trim() }
}

/**
 * Пустая строка в редакторе → `&nbsp;` в markdown.
 * Иначе после сохранения markdown схлопывает «абзацный» пробел в обычный перенос.
 * @param {string} text
 */
export function encodeBlankLinesForMarkdown(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => (line.trim() === '' ? '&nbsp;' : line))
    .join('\n')
}

/**
 * Обратно для textarea: строки `&nbsp;` → пустые (чтобы снова править абзацы).
 * @param {string} text
 */
export function decodeBlankLinesFromMarkdown(text) {
  return String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => {
      const t = line.trim()
      if (t === '&nbsp;' || t === '\u00a0') return ''
      return line
    })
    .join('\n')
}

/**
 * Подставить или убрать ведущее фото `![](url)` в теле записи.
 * @param {string} md
 * @param {string | null} relativeUrl — путь вида `/uploads/...` или null при снятии
 * @param {boolean} remove — только убрать первую картинку
 */
export function mergeLeadImageIntoMarkdown(md, relativeUrl, remove) {
  const trimmed = (md || '').trim()
  const ex = extractFirstMarkdownImage(trimmed, STRAPI_BASE)
  const withoutFirst = ex.imageUrl != null ? ex.rest : trimmed
  if (remove) return withoutFirst.trim()
  if (!relativeUrl || typeof relativeUrl !== 'string') return trimmed
  const line = `![](${relativeUrl})`
  const body = withoutFirst.trim()
  return body ? `${line}\n\n${body}` : line
}

/**
 * Какое поле Strapi использовать как заголовок — только если оно реально есть в ответе API
 * (иначе PUT с лишним ключом даёт 400).
 * @param {Record<string, unknown>} raw
 * @returns {string | null}
 */
function pickTitleStrapiKey(raw) {
  const candidates = ['title', 'name', 'heading', 'label', 'caption', 'subject']
  for (const k of candidates) {
    if (!Object.prototype.hasOwnProperty.call(raw, k)) continue
    const v = raw[k]
    if (v == null || typeof v === 'string') return k
    if (typeof v === 'object' && v !== null && strapiScalarToString(v)) return k
  }
  return null
}

/**
 * Один разворот книги: слева фото (если есть), справа текст markdown.
 * @param {unknown} entry — элемент из data[]
 * @param {{ strapiBase?: string }} [opts]
 */
export function spreadFromAboutEntry(entry, opts = {}) {
  const base = opts.strapiBase ?? STRAPI_BASE
  const raw = unwrapEntry(entry)
  const content = typeof raw.content === 'string' ? raw.content : typeof raw.text === 'string' ? raw.text : ''

  let imageUrl = mediaUrlFromFields(raw, base)
  let textMarkdown = content

  if (!imageUrl) {
    const ex = extractFirstMarkdownImage(content, base)
    imageUrl = ex.imageUrl
    textMarkdown = ex.rest
  }

  const tk = pickTitleStrapiKey(raw)
  const title = tk ? strapiScalarToString(raw[tk]).trim() : ''

  return {
    imageUrl,
    textMarkdown,
    title
  }
}

/**
 * Сырые поля записи «О себе» для редактора (Strapi v4/v5).
 * @param {unknown} entry — элемент из data[]
 */
export function getAboutEntryForEditor(entry) {
  if (!entry || typeof entry !== 'object') {
    return {
      documentId: null,
      id: null,
      title: '',
      content: '',
      bodyField: 'content',
      titleStrapiKey: null
    }
  }
  const raw = unwrapEntry(entry)
  const documentId = raw.documentId ?? entry.documentId ?? null
  const id = raw.id ?? entry.id ?? null
  const hasContent = typeof raw.content === 'string'
  const hasText = typeof raw.text === 'string'
  const content = hasContent ? raw.content : hasText ? raw.text : ''
  /** В какое поле Strapi писать при сохранении */
  const bodyField = hasContent ? 'content' : hasText ? 'text' : 'content'

  const titleStrapiKey = pickTitleStrapiKey(raw)
  let title = ''
  if (titleStrapiKey != null) {
    title = strapiScalarToString(raw[titleStrapiKey]).trim()
  }

  return { documentId, id, title, content, bodyField, titleStrapiKey }
}
