/** Та же логика, что `isContentAdminRole` в `utils/strapiUserRole.js` — для проверки на сервере. */
export function isContentAdminStrapiUser(user: Record<string, unknown> | null | undefined): boolean {
  if (!user) return false
  let raw = user.role as Record<string, unknown> | unknown[] | undefined
  if (Array.isArray(raw)) raw = raw[0] as Record<string, unknown>
  if (!raw || typeof raw !== 'object') return false
  const type = String((raw as Record<string, unknown>).type || '')
    .toLowerCase()
    .trim()
  if (type === 'admin') return true
  const name = String((raw as Record<string, unknown>).name || '')
    .toLowerCase()
    .trim()
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
