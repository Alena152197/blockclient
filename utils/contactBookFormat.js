export const BOOK_SPREAD_BODY_MAX_CHARS = 850

export function clampBookBodyText(text, max = BOOK_SPREAD_BODY_MAX_CHARS) {
  const s = String(text ?? '')
  if (s.length <= max) return s
  return s.slice(0, max)
}

export function wrapTextareaSelection(el, wrap, setValue) {
  if (!el) return
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const value = el.value ?? ''
  const selected = value.slice(start, end)
  const { before, mid, after } = wrap(selected)
  const next = value.slice(0, start) + before + mid + after + value.slice(end)
  setValue(next)
  const selStart = start + before.length
  const selEnd = selStart + mid.length
  requestAnimationFrame(() => {
    el.focus()
    try {
      el.setSelectionRange(selStart, selEnd)
    } catch {
      /* ignore */
    }
  })
}

export function wrapBold(selected) {
  const mid = selected || 'текст'
  return { before: '**', mid, after: '**' }
}

export function wrapItalic(selected) {
  const mid = selected || 'текст'
  return { before: '*', mid, after: '*' }
}

export function wrapUnderline(selected) {
  const mid = selected || 'текст'
  return { before: '<u>', mid, after: '</u>' }
}

export function wrapColor(selected, color) {
  const hex = String(color || '#8b4513').replace(/[^\w#]/g, '')
  const mid = selected || 'текст'
  return {
    before: `<span style="color:${hex}">`,
    mid,
    after: '</span>'
  }
}

export const BOOK_FONT_SIZE_OPTIONS = [
  { value: '0.85em', label: 'Мелкий' },
  { value: '1em', label: 'Обычный' },
  { value: '1.15em', label: 'Крупный' },
  { value: '1.35em', label: 'Очень крупный' }
]

export function wrapFontSize(selected, size) {
  const allowed = new Set(BOOK_FONT_SIZE_OPTIONS.map((o) => o.value))
  const fs = allowed.has(size) ? size : '1em'
  const mid = selected || 'текст'
  return {
    before: `<span style="font-size:${fs}">`,
    mid,
    after: '</span>'
  }
}

export function wrapLink(selected, url) {
  const href = String(url || '').trim()
  if (!href) return { before: '', mid: selected, after: '' }
  const mid = selected || 'ссылка'
  return { before: '[', mid, after: `](${href})` }
}

export function wrapHtmlBold(selected) {
  const mid = selected || 'текст'
  return { before: '<strong>', mid, after: '</strong>' }
}

export function wrapHtmlItalic(selected) {
  const mid = selected || 'текст'
  return { before: '<em>', mid, after: '</em>' }
}

export function wrapHtmlLink(selected, url) {
  const href = String(url || '').trim()
  if (!href) return { before: '', mid: selected, after: '' }
  const safe = href.replace(/"/g, '')
  const mid = selected || 'ссылка'
  return { before: `<a href="${safe}" target="_blank" rel="noopener">`, mid, after: '</a>' }
}

export function notebookHtmlToEditable(html) {
  let s = String(html || '')
  s = s.replace(
    /<p[^>]*class=["'][^"']*notebook-gap[^"']*["'][^>]*>[\s\S]*?<\/p>/gi,
    '\n\n'
  )
  s = s.replace(/<p[^>]*>\s*(?:&nbsp;|\u00a0|<br\s*\/?>)?\s*<\/p>/gi, '\n\n')
  s = s.replace(/<\/p>/gi, '\n\n')
  s = s.replace(/<\/h[1-6]>/gi, '\n\n')
  s = s.replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/&nbsp;/gi, ' ')
  s = s.replace(/<p[^>]*>/gi, '')
  s = s.replace(/<h[1-6][^>]*>/gi, '')
  s = s.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{3,}/g, '\n\n')
  return s.trim()
}

export const NOTEBOOK_BODY_MAX_CHARS = 520

export function notebookPlainLength(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .length
}

export function clampNotebookBodyText(text, max = NOTEBOOK_BODY_MAX_CHARS) {
  const s = String(text ?? '')
  if (notebookPlainLength(s) <= max) return s
  let out = ''
  let plain = 0
  let i = 0
  while (i < s.length && plain < max) {
    if (s[i] === '<') {
      const end = s.indexOf('>', i)
      if (end === -1) break
      out += s.slice(i, end + 1)
      i = end + 1
      continue
    }
    out += s[i]
    plain += 1
    i += 1
  }
  return out
}

export function notebookEditableToHtml(plain) {
  let formattedText = String(plain || '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')

  const allLines = formattedText.split('\n')
  /** @type {Array<string[] | '__gap__'>} */
  const result = []
  let currentParagraph = []

  for (let i = 0; i < allLines.length; i++) {
    const line = allLines[i]
    const isLineEmpty = line.trim() === ''
    if (isLineEmpty) {
      if (currentParagraph.length > 0) {
        result.push(currentParagraph)
        currentParagraph = []
      }
      if (result[result.length - 1] !== '__gap__') {
        result.push('__gap__')
      }
    } else {
      currentParagraph.push(line)
    }
  }
  if (currentParagraph.length > 0) result.push(currentParagraph)
  while (result[0] === '__gap__') result.shift()
  while (result[result.length - 1] === '__gap__') result.pop()

  return (
    result
      .map((paragraph) => {
        if (paragraph === '__gap__') {
          return '<p class="notebook-gap">&nbsp;</p>'
        }
        const processedLines = paragraph.map((line) => line)
        const paragraphContent = processedLines.join('<br>')
        return `<p>${paragraphContent}</p>`
      })
      .join('') || ''
  )
}
