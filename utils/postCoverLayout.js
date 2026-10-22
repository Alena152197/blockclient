/**
 * Настройки обложки поста хранятся в конце поля desc в виде маркера (без отдельных полей в Strapi).
 * В форме и в карточках показывается только «чистый» текст описания.
 */

export const DEFAULT_COVER_LAYOUT = {
    /** @type {'left'|'center'|'right'} */
    align: 'center',
    /** ширина блока с фото, % от контейнера */
    widthPercent: 100,
    /** высота области обложки (vh), ограничивается CSS max на странице */
    maxHeightVh: 42,
    /** @type {'cover'|'contain'} */
    objectFit: 'cover'
}

const MARKER_RE = /\n<!--bc-cover:([\w+/=]+)-->\s*$/

function layoutToPayload(layout) {
    const m = { ...DEFAULT_COVER_LAYOUT, ...layout }
    return {
        a: m.align,
        w: Math.min(100, Math.max(30, Number(m.widthPercent) || DEFAULT_COVER_LAYOUT.widthPercent)),
        h: Math.min(70, Math.max(20, Number(m.maxHeightVh) || DEFAULT_COVER_LAYOUT.maxHeightVh)),
        f: m.objectFit === 'contain' ? 'contain' : 'cover'
    }
}

function payloadToLayout(p) {
    if (!p || typeof p !== 'object') return { ...DEFAULT_COVER_LAYOUT }
    return {
        align: ['left', 'center', 'right'].includes(p.a) ? p.a : DEFAULT_COVER_LAYOUT.align,
        widthPercent: typeof p.w === 'number' ? p.w : DEFAULT_COVER_LAYOUT.widthPercent,
        maxHeightVh: typeof p.h === 'number' ? p.h : DEFAULT_COVER_LAYOUT.maxHeightVh,
        objectFit: p.f === 'contain' ? 'contain' : 'cover'
    }
}

export function parseDescWithCover(desc) {
    const raw = desc == null ? '' : String(desc)
    const m = raw.match(MARKER_RE)
    let cleanDesc = raw
    let layout = { ...DEFAULT_COVER_LAYOUT }
    if (m) {
        cleanDesc = raw.slice(0, m.index)
        try {
            const json = decodeURIComponent(escape(atob(m[1])))
            layout = payloadToLayout(JSON.parse(json))
        } catch {
            /* оставляем defaults */
        }
    }
    return { cleanDesc, layout }
}

export function mergeDescWithCover(cleanDesc, layout) {
    const text = cleanDesc == null ? '' : String(cleanDesc)
    const payload = layoutToPayload(layout)
    const json = JSON.stringify(payload)
    const b64 = btoa(unescape(encodeURIComponent(json)))
    return text + '\n<!--bc-cover:' + b64 + '-->'
}

/** Для карточек блога / поиска — убрать маркер из desc */
export function stripCoverFromDesc(desc) {
    return parseDescWithCover(desc).cleanDesc
}

export function coverLayoutStyle(layout) {
    const L = { ...DEFAULT_COVER_LAYOUT, ...layout }
    const ta = L.align === 'left' ? 'left' : L.align === 'right' ? 'right' : 'center'
    const objPos =
        L.align === 'left' ? 'left center' : L.align === 'right' ? 'right center' : 'center center'
    const w = Math.min(100, Math.max(30, Number(L.widthPercent) || 100))
    const h = Math.min(70, Math.max(20, Number(L.maxHeightVh) || 42))
    const fit = L.objectFit === 'contain' ? 'contain' : 'cover'
    const innerWrapStyle = {
        width: `${w}%`,
        maxWidth: '100%',
        display: 'block'
    }
    if (ta === 'center') {
        innerWrapStyle.marginLeft = 'auto'
        innerWrapStyle.marginRight = 'auto'
    } else if (ta === 'right') {
        innerWrapStyle.marginLeft = 'auto'
        innerWrapStyle.marginRight = '0'
    } else {
        innerWrapStyle.marginLeft = '0'
        innerWrapStyle.marginRight = 'auto'
    }
    return {
        figureStyle: { textAlign: ta },
        innerWrapStyle,
        boxStyle: {
            position: 'relative',
            width: '100%',
            minHeight: '200px',
            height: `min(${h}vh, 520px)`,
            overflow: 'hidden'
        },
        imgClass: fit === 'contain' ? 'object-contain' : 'object-cover',
        imgStyle: {
            objectPosition: objPos
        }
    }
}
