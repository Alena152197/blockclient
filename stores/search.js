import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', {
  state: () => ({
    searchQuery: ref(''),
    authToggle: true,
    userMe: {}, // Всегда плоский объект: id, username, email, avatar и т.д.
    config: {},
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

      } catch (error) {
        console.log('Ошибка в fetchUserMe:', error)
        this.userMe = {}
      }
    },

    logout() {
      localStorage.removeItem('jwt')
      this.userMe = {}
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
