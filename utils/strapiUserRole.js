/**
 * Роль пользователя из Strapi Users & Permissions (JWT /api/users/me).
 * Не путать с учёткой панели Strapi Super Admin.
 */
/** Настройки блога, консоль, удаление постов, редактирование статей, удаление любых комментариев */
export function canAccessBlogSettings(me) {
    return isContentAdminRole(me)
}

/** То же: полный доступ к управлению контентом на сайте (не только настройки). */
export function canManageBlogContent(me) {
    return isContentAdminRole(me)
}

export function isContentAdminRole(me) {
    const r = me?.role
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
