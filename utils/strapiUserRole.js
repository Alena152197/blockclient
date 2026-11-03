/**
 * Роль пользователя из Strapi Users & Permissions (JWT /api/users/me).
 * Не путать с учёткой панели Strapi Super Admin.
 *
 * Роль «Authenticated» = просто вошёл на сайт, это НЕ администратор.
 * Админ на клиенте: me.isContentAdmin (с сервера /api/auth/content-admin)
 * либо role.name/type содержит admin.
 * Allowlist почт живёт только на сервере (CONTENT_ADMIN_EMAILS) — не в NUXT_PUBLIC_*.
 */

/**
 * @param {unknown} me
 */
function hasServerAdminFlag(me) {
  if (!me || typeof me !== 'object') return false
  return /** @type {{ isContentAdmin?: boolean }} */ (me).isContentAdmin === true
}

/**
 * @param {unknown} me
 * @param {{ emails?: string, usernames?: string }} [_allow] — устарело, игнорируется
 */
export function canAccessBlogSettings(me, _allow) {
  return isContentAdminRole(me)
}

/**
 * @param {unknown} me
 * @param {{ emails?: string, usernames?: string }} [_allow] — устарело, игнорируется
 */
export function canManageBlogContent(me, _allow) {
  return isContentAdminRole(me)
}

/**
 * @param {unknown} me
 * @param {{ emails?: string, usernames?: string }} [_allow] — устарело, игнорируется
 */
export function isContentAdminRole(me, _allow) {
  if (hasServerAdminFlag(me)) return true

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
