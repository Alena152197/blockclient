import { defineStore } from 'pinia'
import { ref } from 'vue'

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

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchQuery: ref(''),
    authToggle: true,
    userMe: {}, // Всегда плоский объект: id, username, email, avatar и т.д.
    config: {},
    profileNote: getInitialProfileNote(),
  }),

  actions: {
    async fetchUserMe() {
      try {
        const token = localStorage.getItem('jwt')
        if (!token) return

        const response = await fetch('https://324cbb377ef9.vps.myjino.ru/api/users/me?populate=avatar', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error?.message || 'Ошибка получения пользователя')

        // Явно сохраняем только нужные поля
        this.userMe = {
          id: data.id,
          username: data.username,
          email: data.email,
          avatar: data.avatar // Может быть null или объект с url
        }

        console.log('Пользователь загружен:', this.userMe)
        this.loadProfileNote(data.id)

      } catch (error) {
        console.log('Ошибка в fetchUserMe:', error)
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
      this.userMe = {}
      this.profileNote = defaultProfileNote
    },

    async login(loginData) {
      try {
        const response = await fetch('https://324cbb377ef9.vps.myjino.ru/api/auth/local', {
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

        // Подгружаем полные данные с аватаром
        await this.fetchUserMe()

      } catch (error) {
        console.log('Ошибка при авторизации:', error)
      }
    },
  },

  persist: true,
})
