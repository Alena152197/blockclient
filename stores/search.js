import { defineStore } from 'pinia'
import { ref } from 'vue'
import { STRAPI_BASE } from '~/utils/strapiBase'

const defaultProfileNote = `В этом блоге я хочу рассказать
про свой жизненный путь, с чего всё началось, поиски себя и своего места
в жизни, и всё ли так просто, как кажется на первый взгляд.
Надеюсь, моя история будет для кого-то полезной, как преодолеть трудности,
как не потерять себя и найти силы на что-то новое.
Жизнь, мягко говоря, непредсказуема. В один момент все идет хорошо,
а потом вдруг что-то происходит, и вся жизнь переворачивается с ног на голову,
так случилось и у меня...`

const getInitialProfileNote = () => {
  try {
    const stored = localStorage.getItem('profile_note_guest')
    return stored && stored.trim().length ? stored : defaultProfileNote
  } catch (e) {
    return defaultProfileNote
  }
}

/** Роль из /users/me: Strapi 4/5, вложенный data, attributes */
function normalizeStrapiRole(rawRole) {
  let r = rawRole
  if (r && typeof r === 'object' && r.data !== undefined) {
    const d = r.data
    r = Array.isArray(d) ? d[0] : d
  }
  if (typeof r === 'string') {
    return { name: r, type: null }
  }
  if (!r || typeof r !== 'object') return null
  const row = Array.isArray(r) ? r[0] : r
  if (!row || typeof row !== 'object') return null
  const attrs = row.attributes
  if (attrs && typeof attrs === 'object') {
    const name = attrs.name
    const type = attrs.type
    if (name || type) {
      return { name: typeof name === 'string' ? name : undefined, type: typeof type === 'string' ? type : undefined }
    }
  }
  if (row.name || row.type) {
    return { name: row.name, type: row.type }
  }
  return null
}

function roleLooksUsable(role) {
  return Boolean(role && (String(role.name || '').trim() || String(role.type || '').trim()))
}

const AUTH_USER_KEY = 'strapi_auth_user'

function readCachedAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    if (!raw) return null
    const u = JSON.parse(raw)
    return u && typeof u === 'object' ? u : null
  } catch {
    return null
  }
}

function writeCachedAuthUser(user) {
  try {
    if (!user?.id && !user?.documentId) {
      localStorage.removeItem(AUTH_USER_KEY)
      return
    }
    localStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify({
        id: user.id,
        documentId: user.documentId,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      })
    )
  } catch {
    /* ignore */
  }
}

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchQuery: ref(''),
    authToggle: true,
    userMe: {}, // Всегда плоский объект: id, username, email, avatar и т.д.
    config: {},
    profileNote: getInitialProfileNote(),
  }),

  actions: {
    /**
     * @param {Record<string, unknown> | null} [fallbackUser] — user из /auth/local, если /users/me даёт 403
     */
    async fetchUserMe(fallbackUser = null) {
      try {
        const token = localStorage.getItem('jwt')
        if (!token) return

        const baseMe = `${STRAPI_BASE}/api/users/me`
        const tryUrls = [
          `${baseMe}?populate[avatar]=true&populate[role]=true`,
          `${baseMe}?populate[role]=true`,
          `${baseMe}?populate=role`,
          `${baseMe}?populate=*`,
          `${baseMe}?populate[avatar]=true`,
          baseMe,
        ]
        let data = null
        let chosenRole = null
        let lastStatus = 0

        for (const meUrl of tryUrls) {
          try {
            const r = await fetch(meUrl, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            lastStatus = r.status
            const d = await r.json()
            if (!r.ok) continue
            const role = normalizeStrapiRole(d.role)
            if (roleLooksUsable(role)) {
              data = d
              chosenRole = role
              break
            }
            if (!data) {
              data = d
              chosenRole = role
            }
          } catch {
            /* следующий вариант populate */
          }
        }

        // 403 = в Strapi выключен User.me — user из аргумента или из localStorage после логина
        if (!data) {
          const cached = fallbackUser || readCachedAuthUser()
          if (cached && typeof cached === 'object') {
            data = cached
            chosenRole = normalizeStrapiRole(cached.role)
            if (import.meta.dev) {
              console.warn(
                'fetchUserMe: /users/me HTTP ' +
                  lastStatus +
                  ' — используем кэш логина. В Strapi включите Authenticated → User → me.'
              )
            }
          }
        }

        if (!data) throw new Error('Ошибка получения пользователя')

        if (!roleLooksUsable(chosenRole)) {
          chosenRole = normalizeStrapiRole(data.role)
        }

        this.userMe = {
          id: data.id,
          documentId: data.documentId,
          username: data.username,
          email: data.email,
          avatar: data.avatar,
          role: chosenRole,
        }
        writeCachedAuthUser(this.userMe)
        this.loadProfileNote(data.id)

      } catch (error) {
        if (import.meta.dev) {
          console.warn('fetchUserMe:', error)
        }
        // Не затираем сессию при 403 /users/me — оставляем кэш / pinia persist
        const cached = readCachedAuthUser()
        if (cached?.id || cached?.documentId) {
          this.userMe = {
            id: cached.id,
            documentId: cached.documentId,
            username: cached.username,
            email: cached.email,
            avatar: cached.avatar,
            role: normalizeStrapiRole(cached.role),
          }
          this.loadProfileNote(cached.id)
          return
        }
        this.userMe = {}
        this.profileNote = defaultProfileNote
      }
    },

    loadProfileNote(userId) {
      const key = userId ? `profile_note_${userId}` : 'profile_note_guest'
      try {
        const stored = localStorage.getItem(key)
        this.profileNote = stored && stored.trim().length ? stored : defaultProfileNote
      } catch (e) {
        this.profileNote = defaultProfileNote
      }
    },

    saveProfileNote(note) {
      const key = this.userMe?.id ? `profile_note_${this.userMe.id}` : 'profile_note_guest'
      const cleaned = note && note.trim().length ? note.trim() : defaultProfileNote
      this.profileNote = cleaned
      localStorage.setItem(key, cleaned)
    },

    logout() {
      localStorage.removeItem('jwt')
      try {
        localStorage.removeItem(AUTH_USER_KEY)
      } catch {
        /* ignore */
      }
      this.userMe = {}
      this.profileNote = defaultProfileNote
    },

    async login(loginData) {
      try {
        const response = await fetch(`${STRAPI_BASE}/api/auth/local`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: loginData.email,
            password: loginData.password,
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error?.message || 'Ошибка при входе')
        }

        localStorage.setItem('jwt', data.jwt)
        if (data.user) writeCachedAuthUser(data.user)

        await this.fetchUserMe(data.user || null)

      } catch (error) {
        if (import.meta.dev) {
          console.warn('Авторизация:', error)
        }
      }
    },
  },

  persist: true,
})
