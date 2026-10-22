/** Сетка на «Мои интересы»: карточки max-w-sm, по центру ячейки. Рамка страницы — в blog.vue (max-w + px). */
export const POSTS_INTERESTS_GRID_CLASS =
  'grid w-full grid-cols-1 items-stretch gap-x-3 gap-y-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 justify-items-center'

/** Сортировка копии массива постов (сервер может отдавать в любом порядке). */
export function sortPostsList(posts, sortOrder) {
  if (!Array.isArray(posts)) return []
  const copy = [...posts]
  const title = (p) => String(p?.title ?? '')
  const time = (p) => new Date(p?.createdAt || 0).getTime()
  switch (sortOrder) {
    case 'oldest':
      return copy.sort((a, b) => time(a) - time(b))
    case 'title_az':
      return copy.sort((a, b) => title(a).localeCompare(title(b), 'ru'))
    case 'title_za':
      return copy.sort((a, b) => title(b).localeCompare(title(a), 'ru'))
    case 'newest':
    default:
      return copy.sort((a, b) => time(b) - time(a))
  }
}
