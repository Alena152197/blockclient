/**
 * Роль пользователя из Strapi Users & Permissions (JWT /api/users/me).
 * Не путать с учёткой панели Strapi Super Admin.
 *
 * Роль «Authenticated» = просто вошёл на сайт, это НЕ администратор.
 * Админ: role.name/type содержит admin, либо email в NUXT_PUBLIC_CONTENT_ADMIN_EMAILS.
 */

function splitList(raw) {
  if (!raw || typeof raw !== 'string') return []
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * @param {unknown} me
 * @param {{ emails?: string, usernames?: string }} [allow]
 */
function isEnvAllowlistedAdmin(me, allow = {}) {
  if (!me || typeof me !== 'object') return false

  let emails = splitList(allow.emails)
  let names = splitList(allow.usernames)

  if (!emails.length || !names.length) {
    try {
      if (!emails.length) emails = splitList(import.meta.env?.NUXT_PUBLIC_CONTENT_ADMIN_EMAILS)
      if (!names.length) names = splitList(import.meta.env?.NUXT_PUBLIC_CONTENT_ADMIN_USERNAMES)
    } catch {
      /* ignore */
    }
  }
  if (typeof process !== 'undefined' && process.env) {
    if (!emails.length) emails = splitList(process.env.NUXT_PUBLIC_CONTENT_ADMIN_EMAILS)
    if (!names.length) names = splitList(process.env.NUXT_PUBLIC_CONTENT_ADMIN_USERNAMES)
  }

  const email = String(/** @type {{ email?: string }} */ (me).email || '')
    .toLowerCase()
    .trim()
  const username = String(/** @type {{ username?: string }} */ (me).username || '')
    .toLowerCase()
    .trim()

  if (email && emails.includes(email)) return true
  if (username && names.includes(username)) return true
  return false
}

/**
 * @param {unknown} me
 * @param {{ emails?: string, usernames?: string }} [allow] — из useRuntimeConfig().public
 */
export function canAccessBlogSettings(me, allow) {
  return isContentAdminRole(me, allow)
}

/**
 * @param {unknown} me
 * @param {{ emails?: string, usernames?: string }} [allow]
 */
export function canManageBlogContent(me, allow) {
  return isContentAdminRole(me, allow)
}

/**
 * @param {unknown} me
 * @param {{ emails?: string, usernames?: string }} [allow]
 */
export function isContentAdminRole(me, allow) {
  if (isEnvAllowlistedAdmin(me, allow)) return true

  const r = /** @type {{ role?: { name?: string, type?: string } }} */ (me)?.role
  if (!r || typeof r !== 'object') return false
  const name = (r.name || '').toLowerCase().trim()
  const type = (r.type || '').toLowerCase().trim()
  if (type === 'admin') return true
  if (
    name.includes('admin') ||
    name.includes('админ') ||
    name.includes('administrator') ||
    name.includes('администратор')
  ) {
    return true
  }
  return false
}
