<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-6 transition-all duration-500">
    <div v-if="!index.userMe.documentId"
      class="text-center bg-white rounded-xl shadow-xl p-8 max-w-md w-full transform transition-all hover:scale-105">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Доступ закрыт</h2>
      <p class="text-gray-600 mb-6">Пожалуйста, войдите в свой аккаунт.</p>
      <button @click="$router.push('/')"
        class="px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
        На главную
      </button>
    </div>

    <div v-else
      class="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full transform transition-all hover:shadow-3xl duration-300">
      <!-- Фото профиля -->
      <div class="flex justify-center mb-6">
        <div class="relative group">
          <div
            class="w-28 h-28 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-500 p-[2px] group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-500">
            <img :src="profileImage || 'https://placehold.co/150x150 '" alt="Фото профиля"
              class="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500">
          </div>

          <!-- Кнопка загрузки фото (появляется при наведении) -->
          <label
            class="absolute bottom-0 right-0 bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full p-2 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd" />
            </svg>
            <!-- Скрытое поле для выбора файла -->
            <input type="file" accept="image/*" @change="uploadProfileImage" class="hidden">
          </label>
        </div>
      </div>

      <div class="text-center">
        <h2 class="text-2xl font-extrabold text-gray-800 tracking-tight">Вы авторизованы</h2>
        <button @click="logout"
          class="mt-5 px-5 py-2.5 bg-gradient-to-r from-red-400 to-orange-500 text-white font-medium rounded-full shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-0.5">
          Выйти
        </button>
      </div>

      <!-- Информация о пользователе -->
      <div class="mt-8 space-y-5 text-left">
        <div class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition">
          <div class="text-blue-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
          <span class="text-gray-700"><strong>Email:</strong> {{ index.userMe.email }}</span>
        </div>

        <div class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition">
          <div class="text-indigo-500 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span class="text-gray-700"><strong>Имя пользователя:</strong> {{ index.userMe.username }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const index = useSearchStore()

// Хранение изображения профиля
const profileImage = ref(null)

// Базовый URL сервера Strapi
const baseUrl = 'https://324cbb377ef9.vps.myjino.ru' // Замени на свой, если другой

// При монтировании компонента проверяем localStorage и сервер
onMounted(async () => {
  if (index.userMe && index.userMe.id) {
    // Проверка localStorage
    const savedAvatar = localStorage.getItem(`userAvatar_${index.userMe.id}`)
    if (savedAvatar) {
      profileImage.value = savedAvatar
    }

    // Попробуем получить аватар с сервера
    try {
      const response = await fetch(`${baseUrl}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        if (userData.avatar?.url) {
          const avatarUrl = `${baseUrl}${userData.avatar.url}`
          profileImage.value = avatarUrl
          localStorage.setItem(`userAvatar_${userData.id}`, avatarUrl)
        }
      } else {
        console.error('Ошибка получения данных пользователя:', await response.text())
      }
    } catch (error) {
      console.error('Ошибка сети при получении аватара:', error)
    }
  }
})

// Загрузка фото профиля + отправка на Strapi
const uploadProfileImage = async (event) => {
  const file = event.target.files[0]
  if (!file || !index.userMe || !index.userMe.id) return

  const formData = new FormData()
  formData.append('files.avatar', file)
  formData.append('data', JSON.stringify({}))

  try {
    const response = await fetch(`${baseUrl}/api/users/me/avatar`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: formData
    })

    if (response.ok) {
      const updatedUser = await response.json()
      if (updatedUser.avatar?.url) {
        const avatarUrl = `${baseUrl}${updatedUser.avatar.url}`
        profileImage.value = avatarUrl
        localStorage.setItem(`userAvatar_${updatedUser.id}`, avatarUrl)
        alert('Фото успешно загружено')
      }
    } else {
      const errText = await response.text()
      console.error('Ошибка при обновлении аватара:', errText)
      alert('Не удалось загрузить фото. Попробуйте снова.')
    }
  } catch (error) {
    console.error('Ошибка сети:', error)
    alert('Нет подключения к серверу')
  }
}

// Выход
const logout = () => {
  index.logout()
  router.push('/')
}
</script>