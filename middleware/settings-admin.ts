import { isContentAdminRole } from '~/utils/strapiUserRole'

/** Маршруты /settings* и /console* — только администратор контента (Strapi Users & Permissions). */
export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const search = useSearchStore()
  const runtimeConfig = useRuntimeConfig()
  const allow = {
    emails: String(runtimeConfig.public.contentAdminEmails || ''),
    usernames: String(runtimeConfig.public.contentAdminUsernames || '')
  }

  if (!search.userMe?.id) {
    try {
      await search.fetchUserMe()
    } catch {
      /* ignore */
    }
  }

  if (!isContentAdminRole(search.userMe, allow)) {
    return navigateTo('/')
  }
})
