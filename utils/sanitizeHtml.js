import DOMPurify from 'isomorphic-dompurify'

/** Разрешённые теги для статей / книги / блокнота (без script/iframe/событий). */
const ALLOWED_TAGS = [
  'a',
  'b',
  'strong',
  'i',
  'em',
  'u',
  's',
  'br',
  'p',
  'div',
  'span',
  'ul',
  'ol',
  'li',
  'blockquote',
  'pre',
  'code',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'img',
  'hr',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'figure',
  'figcaption',
  'mark',
  'sub',
  'sup'
]

const ALLOWED_ATTR = [
  'href',
  'title',
  'target',
  'rel',
  'src',
  'alt',
  'width',
  'height',
  'class',
  'style'
]

/**
 * Очищает HTML перед v-html, чтобы скрипт в статье не украл JWT из localStorage.
 * @param {unknown} dirty
 * @returns {string}
 */
export function sanitizeHtml(dirty) {
  if (dirty == null) return ''
  const html = String(dirty)
  if (!html.trim()) return ''

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'link', 'meta', 'base'],
    FORBID_ATTR: ['srcdoc']
  })
}

/**
 * Экранирование текста (поиск / plain).
 * @param {unknown} s
 */
export function escapeHtml(s) {
  if (typeof s !== 'string') return ''
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
