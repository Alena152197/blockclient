import { isContentAdminRole } from '~/utils/strapiUserRole'

/** Маршруты /settings* и /console* — только администратор контента (серверная проверка UI). */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const search = useSearchStore()

  if (!search.userMe?.id) {
    try {
      await search.fetchUserMe()
    } catch {
      /* ignore */
    }
  } else if (search.userMe.isContentAdmin == null) {
    try {
      await search.refreshContentAdminFlag()
    } catch {
      /* ignore */
    }
  }

  if (!isContentAdminRole(search.userMe)) {
    return navigateTo('/')
  }
})
