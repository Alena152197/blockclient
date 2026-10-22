/** localStorage: своё название сайта для вкладки браузера (перекрывает title из Strapi) */
export const BLOG_DISPLAY_TITLE_KEY = 'blog_display_title'

export function readBlogDisplayTitle() {
    if (typeof window === 'undefined') return ''
    try {
        return localStorage.getItem(BLOG_DISPLAY_TITLE_KEY)?.trim() || ''
    } catch {
        return ''
    }
}
