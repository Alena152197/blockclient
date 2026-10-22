import { isContentAdminRole } from '~/utils/strapiUserRole'

/** Маршруты /settings* и /console* — только администратор контента (Strapi Users & Permissions). */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const search = useSearchStore()
  if (!search.userMe?.id) {
    try {
      await search.fetchUserMe()
    } catch {
      /* ignore */
    }
  }

  if (!isContentAdminRole(search.userMe)) {
    return navigateTo('/')
  }
})
