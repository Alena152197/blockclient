/**
 * Мягкий лимит текста на правом листе (без lead-image).
 * Не обрезаем уже сохранённый длинный текст при открытии редактора —
 * только не даём набрать сверх лимита в поле ввода.
 */
export const BOOK_SPREAD_BODY_MAX_CHARS = 850

/**
 * Обрезка только при новом вводе / форматировании (не при загрузке в редактор).
 * @param {string} text
 * @param {number} [max]
 */
export function clampBookBodyText(text, max = BOOK_SPREAD_BODY_MAX_CHARS) {
  const s = String(text ?? '')
  if (s.length <= max) return s
  return s.slice(0, max)
}

/**
 * Обёртка выделения в textarea markdown-разметкой / HTML.
 * @param {HTMLTextAreaElement | null | undefined} el
 * @param {(selected: string) => { before: string, mid: string, after: string }} wrap
 * @param {(next: string) => void} setValue
 */
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

/** Жирный markdown */
export function wrapBold(selected) {
  const mid = selected || 'текст'
  return { before: '**', mid, after: '**' }
}

/** Курсив markdown */
export function wrapItalic(selected) {
  const mid = selected || 'текст'
  return { before: '*', mid, after: '*' }
}

/** Подчёркивание через HTML (markdown-it html: true) */
export function wrapUnderline(selected) {
  const mid = selected || 'текст'
  return { before: '<u>', mid, after: '</u>' }
}

/** Цвет текста */
export function wrapColor(selected, color) {
  const hex = String(color || '#8b4513').replace(/[^\w#]/g, '')
  const mid = selected || 'текст'
  return {
    before: `<span style="color:${hex}">`,
    mid,
    after: '</span>'
  }
}

/** Размеры шрифта для выделения (относительные к тексту листа) */
export const BOOK_FONT_SIZE_OPTIONS = [
  { value: '0.85em', label: 'Мелкий' },
  { value: '1em', label: 'Обычный' },
  { value: '1.15em', label: 'Крупный' },
  { value: '1.35em', label: 'Очень крупный' }
]

/** Размер текста через HTML span */
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

/** Ссылка markdown [text](url) */
export function wrapLink(selected, url) {
  const href = String(url || '').trim()
  if (!href) return { before: '', mid: selected, after: '' }
  const mid = selected || 'ссылка'
  return { before: '[', mid, after: `](${href})` }
}

/** HTML-обёртки для блокнота на главной (хранится как HTML, не markdown) */
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

/**
 * HTML блокнота → текст для textarea (абзацы → переносы, inline-теги сохраняем).
 * @param {string} html
 */
export function notebookHtmlToEditable(html) {
  let s = String(html || '')
  // компактный разрыв абзаца → пустая строка в редакторе
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

/** Лимит текста блокнота на главной (буквы, пробелы, знаки; HTML-теги не считаем) */
export const NOTEBOOK_BODY_MAX_CHARS = 520

/** Длина видимого текста без HTML-тегов */
export function notebookPlainLength(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .length
}

/**
 * Обрезка по видимым символам (теги форматирования сохраняем по возможности).
 * @param {string} text
 * @param {number} [max]
 */
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

/**
 * Текст textarea блокнота → HTML для сохранения.
 * Пустая строка → компактный разрыв (не съедает половину листа).
 * @param {string} plain
 */
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
      // не дублируем подряд идущие разрывы
      if (result[result.length - 1] !== '__gap__') {
        result.push('__gap__')
      }
    } else {
      currentParagraph.push(line)
    }
  }
  if (currentParagraph.length > 0) result.push(currentParagraph)
  // убрать разрыв в начале/конце
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
        const paragraphText = paragraph
          .join(' ')
          .replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/gi, ' ')
          .trim()
        if (
          paragraphText.length < 60 &&
          (paragraphText.toLowerCase().includes('привет') ||
            paragraphText.toLowerCase().includes('знакомы') ||
            paragraphText.toLowerCase().includes('меня зовут'))
        ) {
          return `<h4>${paragraphContent}</h4>`
        }
        return `<p>${paragraphContent}</p>`
      })
      .join('') || ''
  )
}
