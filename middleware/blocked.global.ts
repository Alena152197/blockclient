/**
 * Заблокированный аккаунт (JWT) — выход и редирект на /blocked.
 * Гостям сайт доступен.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return
  if (to.path === '/blocked') return

  const token = localStorage.getItem('jwt')
  if (!token) return

  try {
    const res = await $fetch<{ blocked?: boolean }>('/api/blocked/status', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res?.blocked) return

    const search = useSearchStore()
    search.logout()
    return navigateTo('/blocked')
  } catch {
    /* сеть / сервер — не блокируем навигацию */
  }
})
