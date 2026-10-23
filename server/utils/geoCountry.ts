import { getHeader, getRequestIP } from 'h3'
import type { H3Event } from 'h3'

const COUNTRY_RU: Record<string, string> = {
  RU: 'Россия',
  BY: 'Беларусь',
  KZ: 'Казахстан',
  UA: 'Украина',
  UZ: 'Узбекистан',
  AM: 'Армения',
  AZ: 'Азербайджан',
  GE: 'Грузия',
  MD: 'Молдова',
  KG: 'Кыргызстан',
  TJ: 'Таджикистан',
  TM: 'Туркменистан',
  DE: 'Германия',
  FR: 'Франция',
  IT: 'Италия',
  ES: 'Испания',
  GB: 'Великобритания',
  US: 'США',
  CA: 'Канада',
  TR: 'Турция',
  PL: 'Польша',
  CZ: 'Чехия',
  NL: 'Нидерланды',
  BE: 'Бельгия',
  AT: 'Австрия',
  CH: 'Швейцария',
  SE: 'Швеция',
  NO: 'Норвегия',
  FI: 'Финляндия',
  EE: 'Эстония',
  LV: 'Латвия',
  LT: 'Литва',
  IL: 'Израиль',
  AE: 'ОАЭ',
  CN: 'Китай',
  JP: 'Япония',
  KR: 'Южная Корея',
  IN: 'Индия',
  BR: 'Бразилия',
  AU: 'Австралия'
}

function labelFromCode(code: string, fallbackName?: string): string {
  const c = code.trim().toUpperCase()
  if (!c || c === 'XX' || c === 'T1') return ''
  return COUNTRY_RU[c] || fallbackName || c
}

function isPrivateIp(ip: string): boolean {
  if (!ip) return true
  if (ip === '127.0.0.1' || ip === '::1') return true
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('127.')) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true
  return false
}

/** Подпись из кода/имени, присланных клиентом (браузерный geo). */
export function labelClientCountryHint(codeOrName: unknown): string {
  const raw = String(codeOrName || '').trim()
  if (!raw || raw.length > 80) return ''
  if (!/^[\p{L}\p{N}\s.',()-]+$/u.test(raw)) return ''
  if (/^[A-Za-z]{2}$/.test(raw)) {
    return labelFromCode(raw)
  }
  return raw.slice(0, 80)
}

/**
 * Страна посетителя: заголовки CDN/прокси, иначе geo по IP (ip-api.com),
 * иначе подсказка с клиента (нужна на localhost / private IP).
 */
export async function resolveVisitorCountry(
  event: H3Event,
  clientHint?: unknown
): Promise<string> {
  const fromHeader =
    getHeader(event, 'cf-ipcountry') ||
    getHeader(event, 'x-vercel-ip-country') ||
    getHeader(event, 'x-country-code') ||
    getHeader(event, 'cloudfront-viewer-country')

  if (fromHeader) {
    const labeled = labelFromCode(fromHeader)
    if (labeled) return labeled
  }

  let ip = ''
  try {
    ip = getRequestIP(event, { xForwardedFor: true }) || ''
  } catch {
    ip = ''
  }
  if (ip && !isPrivateIp(ip)) {
    try {
      const ctrl = new AbortController()
      const t = setTimeout(() => ctrl.abort(), 1800)
      const res = await fetch(
        `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode`,
        { signal: ctrl.signal }
      )
      clearTimeout(t)
      if (res.ok) {
        const data = (await res.json()) as {
          status?: string
          country?: string
          countryCode?: string
        }
        if (data.status === 'success') {
          const labeled =
            labelFromCode(data.countryCode || '', data.country) || data.country || ''
          if (labeled) return labeled
        }
      }
    } catch {
      /* fallback ниже */
    }
  }

  return labelClientCountryHint(clientHint)
}
