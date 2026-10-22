/** Ключ в localStorage и в теле GET/PUT /api/blog-settings */
export const POST_CARD_STYLE_STORAGE_KEY = 'post_card_style'

export const POST_CARD_STYLE_CHANGED_EVENT = 'post-card-style-changed'

/** Пресеты цвета фона кнопки «Подробнее» (без ручного ввода hex) */
export const POST_CARD_BUTTON_BG_PRESETS = [
  { id: 'amber', label: 'Янтарь / золото', hex: '#a79d1c' },
  { id: 'moss', label: 'Оливковый', hex: '#5c6b2f' },
  { id: 'slate', label: 'Сланец', hex: '#475569' },
  { id: 'wine', label: 'Винный', hex: '#9f1239' },
  { id: 'teal', label: 'Бирюза', hex: '#0d9488' },
  { id: 'indigo', label: 'Индиго', hex: '#4f46e5' },
  { id: 'ocean', label: 'Синий', hex: '#1d4ed8' },
  { id: 'cocoa', label: 'Какао', hex: '#78350f' }
]

/** Класс круга-свотча в настройках (как у «Цвет фона кнопки») */
export const POST_CARD_COLOR_SWATCH_DISC_CLASS =
  'h-10 w-10 shrink-0 rounded-full border-2 border-white shadow-md ring-2 ring-black/10'

const BUTTON_BG_PRESET_IDS = POST_CARD_BUTTON_BG_PRESETS.map((p) => p.id)

/** Миграция старых ключей Tailwind → пресеты как у кнопки */
function legacyCardBgToPreset(bg) {
  const m = {
    white: 'amber',
    'gray-50': 'slate',
    'stone-50': 'moss',
    'amber-50': 'amber',
    'slate-50': 'slate'
  }
  return m[bg] ?? null
}

function legacyTitleColorKeyToPreset(key) {
  const m = {
    'gray-800': 'cocoa',
    'gray-900': 'cocoa',
    'stone-800': 'cocoa',
    'amber-950': 'amber',
    'slate-900': 'slate'
  }
  return m[key] ?? null
}

function legacyExcerptColorKeyToPreset(key) {
  const m = {
    'gray-700': 'slate',
    'gray-800': 'cocoa',
    'gray-900': 'cocoa',
    'stone-700': 'moss',
    'slate-700': 'slate'
  }
  return m[key] ?? null
}

export const DEFAULT_POST_CARD_STYLE = {
  cardMaxWidth: 'xs',
  cardRounded: 'lg',
  cardShadow: 'md',
  cardBorder: 'default',
  /** Те же id, что у buttonBgPreset — см. POST_CARD_BUTTON_BG_PRESETS */
  cardBgPreset: 'amber',
  imageHeight: 32,
  /** По умолчанию показываем фото целиком в рамке (без обрезки); в настройках можно включить cover */
  imageObjectFit: 'contain',
  titleSize: 'xl',
  titleWeight: 'bold',
  titleColorPreset: 'cocoa',
  excerptSize: 'sm',
  excerptColorPreset: 'slate',
  excerptLineClamp: 2,
  bodyPadding: '3',
  buttonLabel: 'Подробнее',
  buttonShowArrow: true,
  buttonBgPreset: 'amber',
  buttonBgOpacity: 40,
  buttonTextLight: true,
  buttonPadding: 'default',
  buttonRounded: 'lg',
  buttonFontSize: 'sm',
  buttonFullWidth: false,
  /** Только для раскладки «Список в строку» на «Мои интересы» */
  listImageWidth: 'compact',
  listImageMinHeight: 'short',
  listMobileCoverHeight: 'compact',
  listContentAlign: 'center'
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function safeButtonLabel(s) {
  if (typeof s !== 'string') return DEFAULT_POST_CARD_STYLE.buttonLabel
  const t = s.trim().slice(0, 48)
  return t.length ? t : DEFAULT_POST_CARD_STYLE.buttonLabel
}

export function hexForButtonBgPreset(presetId) {
  const p = POST_CARD_BUTTON_BG_PRESETS.find((x) => x.id === presetId)
  return p?.hex ?? POST_CARD_BUTTON_BG_PRESETS[0].hex
}

export function normalizePostCardStyle(raw) {
  const d = DEFAULT_POST_CARD_STYLE
  if (!raw || typeof raw !== 'object') return { ...d }

  const cardMaxWidth = ['xs', 'sm', 'md', 'lg'].includes(raw.cardMaxWidth) ? raw.cardMaxWidth : d.cardMaxWidth
  const cardRounded = ['none', 'sm', 'md', 'lg', 'xl', '2xl'].includes(raw.cardRounded)
    ? raw.cardRounded
    : d.cardRounded
  const cardShadow = ['none', 'sm', 'md', 'lg', 'xl'].includes(raw.cardShadow) ? raw.cardShadow : d.cardShadow
  const cardBorder = ['none', 'light', 'default', 'strong'].includes(raw.cardBorder) ? raw.cardBorder : d.cardBorder

  let cardBgPreset = d.cardBgPreset
  if (BUTTON_BG_PRESET_IDS.includes(raw.cardBgPreset)) {
    cardBgPreset = raw.cardBgPreset
  } else if (raw.cardBg) {
    const fromLegacy = legacyCardBgToPreset(raw.cardBg)
    if (fromLegacy) cardBgPreset = fromLegacy
  }

  const imageHeight = clamp(Number(raw.imageHeight) || d.imageHeight, 24, 64)
  const stepped = Math.round(imageHeight / 4) * 4
  const imageHeightKey = [24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64].includes(stepped)
    ? stepped
    : 36
  const imageObjectFit =
    raw.imageObjectFit === 'contain' || raw.imageObjectFit === 'cover'
      ? raw.imageObjectFit
      : d.imageObjectFit
  const titleSize = ['xl', '2xl', '3xl'].includes(raw.titleSize) ? raw.titleSize : d.titleSize
  const titleWeight = ['semibold', 'bold', 'extrabold'].includes(raw.titleWeight) ? raw.titleWeight : d.titleWeight

  let titleColorPreset = d.titleColorPreset
  if (BUTTON_BG_PRESET_IDS.includes(raw.titleColorPreset)) {
    titleColorPreset = raw.titleColorPreset
  } else if (raw.titleColorKey) {
    const fromLegacy = legacyTitleColorKeyToPreset(raw.titleColorKey)
    if (fromLegacy) titleColorPreset = fromLegacy
  }

  const excerptSize = ['sm', 'base', 'lg'].includes(raw.excerptSize) ? raw.excerptSize : d.excerptSize

  let excerptColorPreset = d.excerptColorPreset
  if (BUTTON_BG_PRESET_IDS.includes(raw.excerptColorPreset)) {
    excerptColorPreset = raw.excerptColorPreset
  } else if (raw.excerptColorKey) {
    const fromLegacy = legacyExcerptColorKeyToPreset(raw.excerptColorKey)
    if (fromLegacy) excerptColorPreset = fromLegacy
  }
  const clampVal = raw.excerptLineClamp === 0 || raw.excerptLineClamp === '0' ? 0 : clamp(Number(raw.excerptLineClamp) || 3, 2, 6)
  const excerptLineClamp = [0, 2, 3, 4, 5, 6].includes(clampVal) ? clampVal : 3

  const bodyPadding = ['3', '4', '6', '8'].includes(String(raw.bodyPadding)) ? String(raw.bodyPadding) : d.bodyPadding

  let buttonBgPreset = BUTTON_BG_PRESET_IDS.includes(raw.buttonBgPreset) ? raw.buttonBgPreset : d.buttonBgPreset
  if (!BUTTON_BG_PRESET_IDS.includes(raw.buttonBgPreset) && typeof raw.buttonBgHex === 'string') {
    const h = raw.buttonBgHex.trim().toLowerCase()
    if (/^#[0-9a-f]{6}$/.test(h)) {
      const found = POST_CARD_BUTTON_BG_PRESETS.find((p) => p.hex.toLowerCase() === h)
      if (found) buttonBgPreset = found.id
    }
  }

  const buttonBgOpacity = clamp(Number(raw.buttonBgOpacity) || d.buttonBgOpacity, 20, 100)
  const buttonTextLight = raw.buttonTextLight !== false
  const buttonLabel = safeButtonLabel(raw.buttonLabel)
  const buttonShowArrow = raw.buttonShowArrow !== false
  const buttonPadding = ['compact', 'default', 'comfort'].includes(raw.buttonPadding) ? raw.buttonPadding : d.buttonPadding
  const buttonRounded = ['sm', 'md', 'lg', 'xl', 'full'].includes(raw.buttonRounded) ? raw.buttonRounded : d.buttonRounded
  const buttonFontSize = ['xs', 'sm', 'base'].includes(raw.buttonFontSize) ? raw.buttonFontSize : d.buttonFontSize
  const buttonFullWidth = raw.buttonFullWidth === true

  const listImageWidth = ['compact', 'default', 'wide'].includes(raw.listImageWidth)
    ? raw.listImageWidth
    : d.listImageWidth
  const listImageMinHeight = ['short', 'medium', 'tall'].includes(raw.listImageMinHeight)
    ? raw.listImageMinHeight
    : d.listImageMinHeight
  const listMobileCoverHeight = ['compact', 'normal', 'tall'].includes(raw.listMobileCoverHeight)
    ? raw.listMobileCoverHeight
    : d.listMobileCoverHeight
  const listContentAlign = raw.listContentAlign === 'top' ? 'top' : 'center'

  return {
    cardMaxWidth,
    cardRounded,
    cardShadow,
    cardBorder,
    cardBgPreset,
    imageHeight: imageHeightKey,
    imageObjectFit,
    titleSize,
    titleWeight,
    titleColorPreset,
    excerptSize,
    excerptColorPreset,
    excerptLineClamp,
    bodyPadding,
    buttonLabel,
    buttonShowArrow,
    buttonBgPreset,
    buttonBgOpacity,
    buttonTextLight,
    buttonPadding,
    buttonRounded,
    buttonFontSize,
    buttonFullWidth,
    listImageWidth,
    listImageMinHeight,
    listMobileCoverHeight,
    listContentAlign
  }
}

const LIST_ROW_IMG_W = {
  compact: 'sm:w-48',
  default: 'sm:w-56',
  wide: 'sm:w-64'
}

/** Те же ширины колонки фото без sm: — для предпросмотра в узкой колонке настроек */
const LIST_ROW_IMG_W_DESKTOP = {
  compact: 'w-48',
  default: 'w-56',
  wide: 'w-64'
}

const LIST_MOBILE_COVER_H = {
  compact: 'h-40',
  normal: 'h-48',
  tall: 'h-56'
}

/** Мобильная полоса фото в списке — укладывается в max-h карточки 200px вместе с текстом */
const LIST_MOBILE_COVER_H_LIST = {
  compact: 'h-20',
  normal: 'h-24',
  tall: 'h-28'
}

/** Мин. высота колонки с фото на sm+ (ниже max-h карточки 200px) */
const LIST_IMAGE_COL_MIN_SM = {
  short: 'sm:min-h-[5rem]',
  medium: 'sm:min-h-[6rem]',
  tall: 'sm:min-h-[7rem]'
}

/**
 * Обёртка ссылки на обложку в режиме «список в строку»
 * @param {Record<string, unknown>} style
 * @param {{ asDesktopPreview?: boolean }} [opts] — предпросмотр: вид как на широком экране (ряд фото|текст)
 */
export function getListImageLinkWrapperClass(style, opts = {}) {
  const s = normalizePostCardStyle(style)
  if (opts.asDesktopPreview) {
    const w = LIST_ROW_IMG_W_DESKTOP[s.listImageWidth] || LIST_ROW_IMG_W_DESKTOP.default
    return [
      'block overflow-hidden shrink-0',
      w,
      'rounded-l-lg rounded-tr-none rounded-br-none',
      'flex items-center justify-center bg-gray-100',
      'h-full max-h-[200px] min-h-0'
    ].join(' ')
  }
  const w = LIST_ROW_IMG_W[s.listImageWidth] || LIST_ROW_IMG_W.default
  const minCol = LIST_IMAGE_COL_MIN_SM[s.listImageMinHeight] || LIST_IMAGE_COL_MIN_SM.medium
  return [
    'block overflow-hidden shrink-0 w-full',
    w,
    'rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none sm:rounded-br-none',
    'flex items-center justify-center bg-gray-100',
    LIST_MOBILE_COVER_H_LIST[s.listMobileCoverHeight] || LIST_MOBILE_COVER_H_LIST.normal,
    /* sm+: колонка на всю высоту строки — обложка до нижнего края карточки */
    'sm:self-stretch sm:h-full',
    minCol
  ].join(' ')
}

/** Класс img в режиме списка — cover на всю высоту растянутой колонки */
export function getListImageClass(style, opts = {}) {
  if (opts.asDesktopPreview) {
    return ['h-full w-full min-h-0 object-cover object-center'].join(' ')
  }
  return ['h-full w-full min-h-0 object-cover object-center'].join(' ')
}

/** Плейсхолдер без фото в режиме списка */
export function getListPlaceholderImageClass(style, opts = {}) {
  const s = normalizePostCardStyle(style)
  if (opts.asDesktopPreview) {
    return ['w-full h-full max-h-[200px] min-h-0 bg-gray-200', 'flex', 'items-center', 'justify-center'].join(' ')
  }
  return ['h-full w-full bg-gray-200', 'flex', 'items-center', 'justify-center'].join(' ')
}

/** Правая колонка с текстом и кнопкой в режиме списка */
export function getListContentColumnClass(style, opts = {}) {
  const s = normalizePostCardStyle(style)
  const key = String(s.bodyPadding)
  const pad =
    LIST_CONTENT_PADDING[key] || LIST_CONTENT_PADDING[3]
  const justify = s.listContentAlign === 'top' ? 'justify-start' : 'justify-center'
  if (opts.asDesktopPreview) {
    return [pad, 'flex flex-1 flex-col min-w-0 min-h-0 overflow-x-hidden overflow-y-auto', justify, 'rounded-r-lg rounded-bl-none'].join(' ')
  }
  return [
    pad,
    'flex flex-1 flex-col min-w-0 min-h-0 overflow-x-hidden overflow-y-auto',
    justify,
    'sm:rounded-r-lg sm:rounded-bl-none rounded-b-lg'
  ].join(' ')
}

/** Hex для кнопки после нормализации стиля */
export function getButtonBgHexForStyle(style) {
  const s = normalizePostCardStyle(style)
  return hexForButtonBgPreset(s.buttonBgPreset)
}

export function loadPostCardStyle() {
  if (typeof window === 'undefined') return { ...DEFAULT_POST_CARD_STYLE }
  try {
    const raw = localStorage.getItem(POST_CARD_STYLE_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_POST_CARD_STYLE }
    return normalizePostCardStyle(JSON.parse(raw))
  } catch {
    return { ...DEFAULT_POST_CARD_STYLE }
  }
}

export function persistPostCardStyle(style) {
  const n = normalizePostCardStyle(style)
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(POST_CARD_STYLE_STORAGE_KEY, JSON.stringify(n))
    window.dispatchEvent(new Event(POST_CARD_STYLE_CHANGED_EVENT))
    import('~/utils/blogClientSettingsRemote').then((m) => m.schedulePersistBlogSettingsToServer()).catch(() => {})
  } catch {
    /* ignore */
  }
}

const MAX_W = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg'
}

const ROUNDED = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl'
}

const ROUNDED_T = {
  none: 'rounded-t-none',
  sm: 'rounded-t-sm',
  md: 'rounded-t-md',
  lg: 'rounded-t-lg',
  xl: 'rounded-t-xl',
  '2xl': 'rounded-t-2xl'
}

const SHADOW = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
}

const BORDER = {
  none: 'border-0',
  light: 'border border-gray-100',
  default: 'border border-gray-200',
  strong: 'border-2 border-gray-400'
}

const TITLE_SIZE = {
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl'
}

const TITLE_WEIGHT = {
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold'
}

const EXCERPT = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg'
}

const LINE_CLAMP = {
  0: '',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
  5: 'line-clamp-5',
  6: 'line-clamp-6'
}

const PADDING = {
  3: 'p-3',
  4: 'p-4',
  6: 'p-6',
  8: 'p-8'
}

/** Режим «список»: отступы слева/справа/сверху как у bodyPadding, снизу 0 — без поля под кнопкой */
const LIST_CONTENT_PADDING = {
  3: 'px-3 pt-3 pb-0',
  4: 'px-4 pt-4 pb-0',
  6: 'px-6 pt-6 pb-0',
  8: 'px-8 pt-8 pb-0'
}

const BTN_PAD = {
  compact: 'px-2 py-1.5',
  default: 'px-3 py-2',
  comfort: 'px-5 py-3'
}

const BTN_ROUND = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full'
}

const BTN_TEXT = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base'
}

const IMG_H = {
  24: 'h-24',
  28: 'h-28',
  32: 'h-32',
  36: 'h-36',
  40: 'h-40',
  44: 'h-44',
  48: 'h-48',
  52: 'h-52',
  56: 'h-56',
  60: 'h-60',
  64: 'h-64'
}

/** @param {Record<string, unknown> | null | undefined} style */
/** Фон карточки: тот же пресет, что у кнопки, смешанный с белым */
export function getPostCardArticleSurfaceStyle(style) {
  const s = normalizePostCardStyle(style)
  const hex = hexForButtonBgPreset(s.cardBgPreset)
  return { backgroundColor: `color-mix(in srgb, ${hex} 16%, white)` }
}

export function getPostCardTitleColorStyle(style) {
  const s = normalizePostCardStyle(style)
  return { color: hexForButtonBgPreset(s.titleColorPreset) }
}

export function getPostCardExcerptColorStyle(style) {
  const s = normalizePostCardStyle(style)
  return { color: hexForButtonBgPreset(s.excerptColorPreset) }
}

/**
 * @param {Record<string, unknown> | null | undefined} style
 * @param {{ omitMaxWidth?: boolean }} [opts] — для «Список в строку»: без max-w-* карточка на всю ширину контейнера
 */
export function getPostCardArticleClass(style, opts = {}) {
  const s = normalizePostCardStyle(style)
  const parts = []
  if (!opts.omitMaxWidth) {
    parts.push(MAX_W[s.cardMaxWidth] || MAX_W.sm)
  } else {
    parts.push('w-full max-w-full min-w-0')
  }
  parts.push(
    'flex',
    'min-h-0',
    'w-full',
    'flex-col',
    'h-full',
    'overflow-hidden',
    BORDER[s.cardBorder] || BORDER.default,
    ROUNDED[s.cardRounded] || ROUNDED.lg,
    SHADOW[s.cardShadow] || SHADOW.md,
    'relative',
    'group'
  )
  return parts.join(' ')
}

/** @param {Record<string, unknown> | null | undefined} style */
export function getPostCardImageClass(style) {
  const s = normalizePostCardStyle(style)
  const hk = Number(s.imageHeight)
  const heightClass = IMG_H[hk] || IMG_H[36]
  const fit = s.imageObjectFit === 'contain' ? 'object-contain' : 'object-cover'
  const rt = ROUNDED_T[s.cardRounded] || ROUNDED_T.lg
  return ['w-full', heightClass, fit, 'object-center', rt].join(' ')
}

export function getPostCardImagePlaceholderClass(style) {
  const s = normalizePostCardStyle(style)
  const hk = Number(s.imageHeight)
  const heightClass = IMG_H[hk] || IMG_H[36]
  const rt = ROUNDED_T[s.cardRounded] || ROUNDED_T.lg
  return ['w-full', heightClass, 'bg-gray-200', 'flex', 'items-center', 'justify-center', rt].join(' ')
}

export function getPostCardTitleClass(style) {
  const s = normalizePostCardStyle(style)
  return [
    'mb-2',
    'tracking-tight',
    TITLE_SIZE[s.titleSize] || TITLE_SIZE['2xl'],
    TITLE_WEIGHT[s.titleWeight] || TITLE_WEIGHT.bold
  ].join(' ')
}

export function getPostCardExcerptClass(style) {
  const s = normalizePostCardStyle(style)
  const lc = LINE_CLAMP[s.excerptLineClamp] ?? LINE_CLAMP[3]
  return [
    'mb-2',
    'font-normal',
    EXCERPT[s.excerptSize] || EXCERPT.base,
    lc
  ]
    .filter(Boolean)
    .join(' ')
}

export function getPostCardBodyPaddingClass(style) {
  const s = normalizePostCardStyle(style)
  return PADDING[s.bodyPadding] || PADDING[4]
}

export function hexToRgba(hex, opacityPercent) {
  const h = (hex || '#a79d1c').replace('#', '')
  if (h.length !== 6) return 'rgba(167, 157, 28, 0.5)'
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const a = clamp(Number(opacityPercent) || 50, 0, 100) / 100
  return `rgba(${r},${g},${b},${a})`
}

export function getPostCardButtonStyles(style) {
  const s = normalizePostCardStyle(style)
  const hex = hexForButtonBgPreset(s.buttonBgPreset)
  return {
    backgroundColor: hexToRgba(hex, s.buttonBgOpacity)
  }
}

export function getPostCardButtonClass(style) {
  const s = normalizePostCardStyle(style)
  const text = s.buttonTextLight ? 'text-white' : 'text-gray-900'
  const pad = BTN_PAD[s.buttonPadding] || BTN_PAD.default
  const rnd = BTN_ROUND[s.buttonRounded] || BTN_ROUND.lg
  const fs = BTN_TEXT[s.buttonFontSize] || BTN_TEXT.sm
  const width = s.buttonFullWidth ? 'w-full justify-center' : ''
  return [
    'post-card-more-btn',
    'inline-flex',
    'items-center',
    pad,
    fs,
    'font-medium',
    'text-center',
    rnd,
    'focus:ring-4',
    'focus:outline-none',
    'focus:ring-blue-300',
    'transition-colors',
    'hover:brightness-110',
    text,
    width
  ]
    .filter(Boolean)
    .join(' ')
}

export function getPostCardLoadMoreStyles(style) {
  const s = normalizePostCardStyle(style)
  const hex = hexForButtonBgPreset(s.buttonBgPreset)
  return {
    backgroundColor: hexToRgba(hex, Math.min(55, s.buttonBgOpacity + 5)),
    color: hex,
    borderColor: hex,
    borderWidth: '1px',
    borderStyle: 'solid'
  }
}

export function getPostCardLoadMoreClass() {
  return [
    'block',
    'm-auto',
    'w-40',
    'my-8',
    'font-black',
    'rounded-lg',
    'text-base',
    'py-4',
    'text-center',
    'hover:text-white',
    'hover:brightness-95',
    'focus:ring-4',
    'focus:outline-none',
    'focus:ring-amber-300',
    'transition-colors'
  ].join(' ')
}
